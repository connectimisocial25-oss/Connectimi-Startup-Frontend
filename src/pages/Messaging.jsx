import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Connectimi_logo from '../components/Connectimi_logo';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './Messaging.css';
import './Profile.css'; // For shared Navbar styles

const Messaging = ({ embedded = false }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // recipient ID
    const [messageInput, setMessageInput] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.conversations-sidebar', 
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
            gsap.fromTo('.chat-window', 
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
            gsap.fromTo('.conversation-item', 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.2 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Load active conversation chats list
    useEffect(() => {
        const loadChats = async () => {
            try {
                const res = await API.get("/messages/chats/active");
                const mappedChats = res.data.conversations.map((c) => ({
                    id: c.user._id,
                    name: c.user.full_name,
                    lastMessage: c.latestMessage.content,
                    date: new Date(c.latestMessage.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                    avatar: c.user.profile_picture || "https://i.pravatar.cc/150",
                    role: c.user.role || "professional"
                }));
                setConversations(mappedChats);
                
                // If there's an active chat, select it, otherwise pick the first one
                if (mappedChats.length > 0 && !activeChat) {
                    setActiveChat(mappedChats[0].id);
                }
            } catch (err) {
                console.error("Failed to load active chats:", err.message);
            }
        };
        loadChats();
    }, []);

    // Load active chat history
    useEffect(() => {
        if (activeChat) {
            const loadHistory = async () => {
                try {
                    const res = await API.get(`/messages/${activeChat}`);
                    const mappedMessages = res.data.messages.map((m) => ({
                        id: m._id,
                        text: m.content,
                        sent: m.sender === user?.id || m.sender?._id === user?.id,
                        time: new Date(m.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                    }));
                    setMessages(mappedMessages);
                } catch (err) {
                    console.error("Failed to load chat history:", err.message);
                }
            };
            loadHistory();
        }
    }, [activeChat, user]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!messageInput.trim() || !activeChat) return;

        try {
            const res = await API.post("/messages", {
                recipientId: activeChat,
                content: messageInput
            });

            const newMsg = {
                id: res.data.message._id,
                text: res.data.message.content,
                sent: true,
                time: new Date(res.data.message.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
            };

            setMessages([...messages, newMsg]);
            setMessageInput('');

            // Optionally refresh conversations list to show latest message preview
            setConversations(conversations.map(c => 
                c.id === activeChat ? { ...c, lastMessage: res.data.message.content, date: "Just now" } : c
            ));
        } catch (err) {
            console.error("Failed to send message:", err.message);
        }
    };

    const activeUser = conversations.find(c => c.id === activeChat);

    return (
        <div className="messaging-container" ref={containerRef} style={embedded ? { padding: 0, height: '100%' } : {}}>
            <div className="messaging-content" style={embedded ? { maxWidth: 'none', height: '100%' } : {}}>
                <div className="messaging-main" style={embedded ? { height: '100%' } : {}}>
                    {/* Conversations Sidebar */}
                    <div className="conversations-sidebar">
                        <div className="conversations-header">
                            <span>Messaging</span>
                            <Icon name="edit" className="cursor-pointer" />
                        </div>
                        <div className="conversations-list">
                            {conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${activeChat === conv.id ? 'active' : ''}`}
                                    onClick={() => setActiveChat(conv.id)}
                                >
                                    <Avatar src={conv.avatar} role={conv.role} size={48} />
                                    <div className="conversation-details">
                                        <div className="conversation-top">
                                            <span className="conversation-name">{conv.name}</span>
                                            <span className="conversation-date">{conv.date}</span>
                                        </div>
                                        <div className="conversation-preview">{conv.lastMessage}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="chat-window">
                        {activeChat ? (
                            <>
                                <div className="chat-header">
                                    <Avatar src={activeUser?.avatar} role={activeUser?.role} size={48} />
                                    <div className="chat-user-info">
                                        <h4>{activeUser?.name}</h4>
                                        <span>Active now</span>
                                    </div>
                                </div>
                                <div className="chat-messages">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`message-bubble ${msg.sent ? 'message-sent' : 'message-received'}`}>
                                            {msg.text}
                                            <div className="message-time">{msg.time}</div>
                                        </div>
                                    ))}
                                </div>
                                <form className="chat-input-area" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        className="chat-input"
                                        placeholder="Write a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                    />
                                    <button className="chat-send-btn" type="submit">Send</button>
                                </form>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                                <Connectimi_logo size={120} />
                                <br />
                                <h3>Select a chat conversation to start messaging.</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messaging;
