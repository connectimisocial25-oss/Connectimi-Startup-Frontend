import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Connectimi_logo from '../components/Connectimi_logo';
import { useChat } from '../context/ChatContext';
import API from '../services/api';
import './Messaging.css';

const Messaging = ({ embedded = false, contactId = null, initialPartner = null }) => {
    const { theme } = useTheme();
    const {
        isConnected,
        conversations,
        messages,
        activeContactId,
        typingUsers,
        onlineUsers,
        setActiveContact,
        sendMessage,
        setTyping,
    } = useChat();

    const [messageInput, setMessageInput] = useState('');
    const [fetchedPartner, setFetchedPartner] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Sidebar search — filters existing conversations by name locally, and
    // (once the local list has nothing left, or for people not yet chatted
    // with) fuzzy-searches all people via the pg_trgm-backed API to start a new chat.
    const [searchTerm, setSearchTerm] = useState('');
    const [peopleResults, setPeopleResults] = useState([]);
    const searchDebounceRef = useRef(null);

    useEffect(() => {
        const term = searchTerm.trim();
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

        searchDebounceRef.current = setTimeout(async () => {
            if (term.length < 2) {
                setPeopleResults([]);
                return;
            }
            try {
                const res = await API.get('/search/people', { params: { q: term } });
                setPeopleResults(res.data.results || []);
            } catch (err) {
                console.error('People search failed:', err.message);
                setPeopleResults([]);
            }
        }, 300);

        return () => clearTimeout(searchDebounceRef.current);
    }, [searchTerm]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // If contactId is passed via props (e.g. from a "Message" button), open that contact
    useEffect(() => {
        if (contactId) {
            setActiveContact(contactId);
        }
        // Do NOT auto-open first conversation — user picks manually
    }, [contactId, setActiveContact]);

    // Fallback: If partner is not in active chats list (e.g. fresh chat), fetch details from API
    useEffect(() => {
        if (activeContactId && !conversations.some(c => c.id === activeContactId)) {
            const fetchProfile = async () => {
                try {
                    let res;
                    try {
                        res = await API.get(`/profile/${activeContactId}`);
                    } catch {
                        res = await API.get(`/consultant/profile/${activeContactId}`);
                    }
                    const data = res.data.user || res.data.consultant;
                    setFetchedPartner({
                        id: activeContactId,
                        name: data.full_name || data.consultant_name || "User",
                        avatar: data.profile_picture || data.logo || "https://i.pravatar.cc/150",
                        role: data.headline || data.industry || "Connectimi Member",
                    });
                } catch (err) {
                    console.error("Failed to fetch partner profile:", err);
                }
            };
            fetchProfile();
        } else {
            setFetchedPartner(null);
        }
    }, [activeContactId, conversations]);

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
        setTyping(true);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
        }, 2000);
    };

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!messageInput.trim() || !activeContactId) return;

        sendMessage(messageInput);
        setMessageInput('');
        setTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };

    // Resolve details for active chat header/display
    let activeUser = conversations.find(c => c.id === activeContactId);
    if (!activeUser && activeContactId) {
        if (initialPartner && initialPartner.id === activeContactId) {
            activeUser = initialPartner;
        } else if (fetchedPartner && fetchedPartner.id === activeContactId) {
            activeUser = fetchedPartner;
        } else {
            activeUser = {
                id: activeContactId,
                name: "Loading...",
                avatar: "https://i.pravatar.cc/150",
                role: "",
            };
        }
    }

    // Build sidebar list. If it is a new chat, prepend the partner to the list
    const localConversations = [...conversations];
    if (activeContactId && activeUser && !conversations.some(c => c.id === activeContactId)) {
        localConversations.unshift({
            id: activeUser.id,
            name: activeUser.name,
            avatar: activeUser.avatar,
            role: activeUser.role,
            lastMessage: "Start a conversation...",
            date: "",
            unreadCount: 0,
        });
    }

    const isPartnerTyping = typingUsers[activeContactId];
    const isPartnerOnline = onlineUsers[activeContactId];

    // Client-side filter of already-loaded conversations by contact name
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const filteredConversations = trimmedSearch
        ? localConversations.filter(c => c.name?.toLowerCase().includes(trimmedSearch))
        : localConversations;

    // People search results, minus anyone already shown in the conversation list
    const shownIds = new Set(localConversations.map(c => c.id));
    const newChatResults = trimmedSearch
        ? peopleResults.filter(p => !shownIds.has(p.id))
        : [];

    return (
        <div className="messaging-container" style={embedded ? { padding: 0, height: '100%' } : {}}>
            <div className="messaging-content" style={embedded ? { maxWidth: 'none', height: '100%' } : {}}>
                <div
                    className={`messaging-main${activeContactId ? ' has-active-chat' : ''}`}
                    style={embedded ? { height: '100%' } : {}}
                >
                    {/* Conversations Sidebar */}
                    <div className="conversations-sidebar">
                        <div className="conversations-header">
                            <span>Messaging</span>
                            <Icon name="edit" className="cursor-pointer" />
                        </div>
                        <div className="conversations-search">
                            <Icon name="search" className="conversations-search-icon" />
                            <input
                                type="text"
                                className="conversations-search-input"
                                placeholder="Search or start a new chat"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="conversations-list">
                            {filteredConversations.length === 0 && newChatResults.length === 0 ? (
                                <p style={{ padding: "20px", color: "var(--text-muted)", textAlign: "center" }}>
                                    {trimmedSearch ? "No matches found" : "No active conversations"}
                                </p>
                            ) : (
                                <>
                                    {filteredConversations.map(conv => (
                                        <div
                                            key={conv.id}
                                            className={`conversation-item ${activeContactId === conv.id ? 'active' : ''}`}
                                            onClick={() => setActiveContact(conv.id)}
                                        >
                                            <div className="avatar-wrapper-relative">
                                                <Avatar src={conv.avatar} role={conv.role} size={48} />
                                                {onlineUsers[conv.id] && <span className="online-badge-dot"></span>}
                                            </div>
                                            <div className="conversation-details">
                                                <div className="conversation-top">
                                                    <span className="conversation-name">{conv.name}</span>
                                                    <span className="conversation-date">{conv.date}</span>
                                                </div>
                                                <div className="conversation-bottom-row">
                                                    <span className="conversation-preview">
                                                        {typingUsers[conv.id] ? (
                                                            <span className="typing-text-color">typing...</span>
                                                        ) : (
                                                            conv.lastMessage
                                                        )}
                                                    </span>
                                                    {conv.unreadCount > 0 && (
                                                        <span className="unread-count-badge">{conv.unreadCount}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {newChatResults.length > 0 && (
                                        <>
                                            <div className="conversations-section-label">Start a new chat</div>
                                            {newChatResults.map(person => (
                                                <div
                                                    key={person.id}
                                                    className="conversation-item new-chat-item"
                                                    onClick={() => setActiveContact(person.id)}
                                                >
                                                    <Avatar
                                                        src={person.profile_picture}
                                                        role={person.account_type === 'organization' ? 'company' : 'professional'}
                                                        size={48}
                                                    />
                                                    <div className="conversation-details">
                                                        <div className="conversation-top">
                                                            <span className="conversation-name">{person.name}</span>
                                                        </div>
                                                        <div className="conversation-bottom-row">
                                                            <span className="conversation-preview">
                                                                {person.headline || "Start a conversation"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="chat-window">
                        {activeContactId ? (
                            <>
                                <div className="chat-header">
                                    <Avatar src={activeUser?.avatar} role={activeUser?.role} size={48} />
                                    <div className="chat-user-info">
                                        <h4>{activeUser?.name}</h4>
                                        <span className={isPartnerOnline ? "online-status" : "offline-status"}>
                                            {isPartnerOnline ? "Online" : "Offline"}
                                        </span>
                                        {isPartnerTyping && <span className="header-typing-indicator"> (typing...)</span>}
                                    </div>
                                    <button
                                        className="chat-close-btn"
                                        onClick={() => setActiveContact(null)}
                                        title="Close chat"
                                        type="button"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="chat-messages">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`message-bubble ${msg.sent ? 'message-sent' : 'message-received'}`}>
                                            {msg.text}
                                            <div className="message-time">{msg.time}</div>
                                        </div>
                                    ))}
                                    {isPartnerTyping && (
                                        <div className="message-bubble message-received typing-indicator-bubble">
                                            <div className="typing-dots">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form className="chat-input-area" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        className="chat-input"
                                        placeholder="Write a message..."
                                        value={messageInput}
                                        onChange={handleInputChange}
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
