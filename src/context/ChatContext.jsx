import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import chatApi from "../services/chatApi";
import API from "../services/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [typingUsers, setTypingUsers] = useState({}); // senderId -> boolean
  const [onlineUsers, setOnlineUsers] = useState({}); // userId -> boolean
  const [connectionError, setConnectionError] = useState(null);

  const activeContactIdRef = useRef(null);
  activeContactIdRef.current = activeContactId;

  // Fetch all conversations for the user, enriched with profiles from main Express API
  const fetchConversations = useCallback(async () => {
    try {
      const response = await chatApi.get("/user/conversations");
      const rawConversations = response.data;

      if (!rawConversations.length) {
        setConversations([]);
        return;
      }

      // Batch-fetch all partner profiles in parallel from the main Express backend
      const profileResults = await Promise.allSettled(
        rawConversations.map((c) => API.get(`/profile/${c.partnerId}`))
      );

      const mapped = rawConversations.map((c, i) => {
        const profileResult = profileResults[i];
        const profileData = profileResult.status === "fulfilled"
          ? profileResult.value.data?.user || profileResult.value.data
          : null;

        return {
          id: c.partnerId,
          name: profileData?.full_name || profileData?.consultant_name || "Unknown User",
          lastMessage: c.lastMessage,
          date: c.lastTime ? new Date(c.lastTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
          avatar: profileData?.profile_picture || profileData?.logo || null,
          role: profileData?.headline || profileData?.industry || "Connectimi Member",
          unreadCount: c.unreadCount || 0,
        };
      });

      setConversations(mapped);

      // Check online status of all partners in parallel
      rawConversations.forEach(async (c) => {
        try {
          const statusRes = await chatApi.get(`/user/${c.partnerId}/status`);
          setOnlineUsers((prev) => ({
            ...prev,
            [c.partnerId]: statusRes.data.online,
          }));
        } catch (err) {
          console.error("Failed to fetch online status for user:", c.partnerId);
        }
      });
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  // Fetch messages with a contact
  const userId = user?.id;
  const fetchHistory = useCallback(async (contactId) => {
    try {
      const response = await chatApi.get(`/message/conversation/${contactId}`);
      // UI expects messages: { id, text, sent, time }
      const mapped = response.data.map((m) => ({
        id: m.id,
        text: m.message,
        sent: m.sender_id === userId,
        time: new Date(m.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        createdAt: m.created_at,
      }));
      setMessages(mapped);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  }, [userId]);

  // Handle switching active conversation
  const setActiveContact = useCallback((contactId) => {
    setActiveContactId(contactId);
    if (contactId) {
      fetchHistory(contactId);
      // Mark read via socket if connected
      if (socket && isConnected) {
        socket.emit("mark_read", { senderId: contactId });
      }
      // Reset unread count locally for this contact
      setConversations((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, unreadCount: 0 } : c))
      );
    } else {
      setMessages([]);
    }
  }, [fetchHistory, socket, isConnected]);

  // Connect socket
  useEffect(() => {
    const token = localStorage.getItem("connectimi_token");
    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setIsConnected(false);
      setConversations([]);
      setMessages([]);
      setActiveContactId(null);
      setTypingUsers({});
      setOnlineUsers({});
      return;
    }

    const chatUrl = import.meta.env.VITE_CHAT_URL || "http://localhost:8000";
    const newSocket = io(chatUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      setConnectionError(err.message);
      setIsConnected(false);
      if (err.message === "Invalid token" || err.message === "Authentication error") {
        console.error("Socket authentication failed. Reconnection stopped.");
        newSocket.disconnect();
      }
    });

    // RealTimeChat server emits 'new_message' when a message is received
    newSocket.on("new_message", (msg) => {
      const isFromActive = msg.sender_id === activeContactIdRef.current;
      
      if (isFromActive) {
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            text: msg.message,
            sent: false,
            time: new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            createdAt: msg.created_at,
          },
        ]);
        // Let server know we read it
        newSocket.emit("mark_read", { senderId: msg.sender_id });
      }

      // Update conversations list (lastMessage, unread count, etc.)
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === msg.sender_id);
        const updatedMsgText = msg.message;
        const updatedTime = new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: updatedMsgText,
            date: updatedTime,
            unreadCount: isFromActive ? 0 : (updated[index].unreadCount || 0) + 1,
          };
          // Move to top
          const [item] = updated.splice(index, 1);
          return [item, ...updated];
        } else {
          fetchConversations();
          return prev;
        }
      });
    });

    // RealTimeChat server emits 'message_sent' back to sender
    newSocket.on("message_sent", (msg) => {
      const isToActive = msg.receiver_id === activeContactIdRef.current;

      if (isToActive) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [
            ...prev,
            {
              id: msg.id,
              text: msg.message,
              sent: true,
              time: new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
              createdAt: msg.created_at,
            },
          ];
        });
      }

      // Update last message in conversation list
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === msg.receiver_id);
        const updatedMsgText = msg.message;
        const updatedTime = new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: updatedMsgText,
            date: updatedTime,
          };
          // Move to top
          const [item] = updated.splice(index, 1);
          return [item, ...updated];
        } else {
          fetchConversations();
          return prev;
        }
      });
    });

    newSocket.on("typing", (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.senderId]: data.isTyping,
      }));
    });

    newSocket.on("user_online", (userId) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: true,
      }));
    });

    newSocket.on("user_offline", (userId) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: false,
      }));
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: false,
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Send message function
  const sendMessage = useCallback((text) => {
    if (!activeContactId) return;

    if (socket && isConnected) {
      socket.emit("send_message", {
        receiverId: activeContactId,
        message: text,
        messageType: "text",
      });
    } else {
      sendMessageHttp(text);
    }
  }, [socket, isConnected, activeContactId]);

  // Send message via HTTP fallback
  const sendMessageHttp = useCallback(async (text) => {
    if (!activeContactId) return;
    try {
      const response = await chatApi.post("/message/", {
        receiverId: activeContactId,
        message: text,
        messageType: "text",
      });
      const msg = response.data;
      
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          text: msg.message,
          sent: true,
          time: new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          createdAt: msg.created_at,
        },
      ]);

      fetchConversations();
    } catch (error) {
      console.error("HTTP send message failed:", error);
    }
  }, [activeContactId, fetchConversations]);

  // Emit typing indicator
  const setTyping = useCallback((isTyping) => {
    if (socket && isConnected && activeContactId) {
      socket.emit("typing", {
        receiverId: activeContactId,
        isTyping,
      });
    }
  }, [socket, isConnected, activeContactId]);

  const disconnectChat = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsConnected(false);
    setConversations([]);
    setMessages([]);
    setActiveContactId(null);
    setTypingUsers({});
    setOnlineUsers({});
  }, [socket]);

  return (
    <ChatContext.Provider
      value={{
        isConnected,
        connectionError,
        conversations,
        messages,
        activeContactId,
        typingUsers,
        onlineUsers,
        setActiveContact,
        sendMessage,
        setTyping,
        disconnectChat,
        fetchConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
