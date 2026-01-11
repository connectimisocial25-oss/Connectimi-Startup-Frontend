import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Connectimi_logo from '../components/Connectimi_logo';
import './Messaging.css';
import './Profile.css'; // For shared Navbar styles

const Messaging = ({ embedded = false }) => {
    const navigate = useNavigate();
    const { theme } = useTheme(); // toggleTheme removed if unused
    // isDropdownOpen removed
    const [activeChat, setActiveChat] = useState(1);
    const [messageInput, setMessageInput] = useState('');

    const conversations = [
        {
            id: 1,
            name: "Sarah Miller",
            lastMessage: "Hey, are you free for a call tomorrow?",
            date: "Oct 24",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            role: "professional"
        },
        {
            id: 2,
            name: "TechCorp",
            lastMessage: "Your application has been received.",
            date: "Oct 22",
            avatar: "https://i.pravatar.cc/150?u=alex",
            role: "company"
        },
        {
            id: 3,
            name: "Dr. Aris",
            lastMessage: "The project looks promising. Let's discuss further.",
            date: "Oct 20",
            avatar: "https://i.pravatar.cc/150?u=aris",
            role: "professor"
        }
    ];

    const messages = [
        { id: 1, text: "Hi there!", sent: false, time: "10:00 AM" },
        { id: 2, text: "Hello! How can I help you?", sent: true, time: "10:05 AM" },
        { id: 3, text: "I wanted to ask about the upcoming project.", sent: false, time: "10:10 AM" },
        { id: 4, text: "Sure, let's talk about it.", sent: true, time: "10:15 AM" }
    ];

    const activeUser = conversations.find(c => c.id === activeChat);



    return (
        <div className="messaging-container" style={embedded ? { padding: 0, height: '100%' } : {}}>
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
                        <div className="chat-header">
                            <Avatar src={activeUser?.avatar} role={activeUser?.role} size={40} />
                            <div className="chat-user-info">
                                <h4>{activeUser?.name}</h4>
                                <span>Active now</span>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {messages.map(msg => (
                                <div key={msg.id} className={`message-bubble ${msg.sent ? 'message-sent' : 'message-received'}`}>
                                    {msg.text}
                                    <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>{msg.time}</div>
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-area">
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Write a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            />
                            <button className="chat-send-btn">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messaging;
