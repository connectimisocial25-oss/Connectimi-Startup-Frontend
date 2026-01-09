import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Connectimi_logo from '../components/Connectimi_logo';
import './MyNetwork.css';
const MyNetwork = () => {
    const navigate = useNavigate();
    const { theme } = useTheme(); // toggleTheme removed
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    const invitations = [
        {
            id: 2,
            name: "Michael Chen",
            role: "Product Manager at InnovateSoft",
            userRole: "company", // Testing square shape
            avatar: "https://i.pravatar.cc/150?u=michael"
        },
        {
            id: 1,
            name: "Sarah Miller",
            role: "Software Engineer at TechCorp",
            userRole: "professional", // Testing round shape
            avatar: "https://i.pravatar.cc/150?u=sarah"
        }
    ];

    const suggestions = [
        {
            id: 101,
            name: "David Wilson",
            role: "Full Stack Developer | React & Node.js",
            userRole: "professional",
            avatar: "https://i.pravatar.cc/150?u=david"
        },
        {
            id: 102,
            name: "Emily Blunt",
            role: "UI/UX Designer at Creative Studio",
            userRole: "company",
            avatar: "https://i.pravatar.cc/150?u=emily"
        },
        {
            id: 103,
            name: "James Bond",
            role: "Security Analyst",
            userRole: "professor", // Testing hexagon
            avatar: "https://i.pravatar.cc/150?u=james"
        },
        {
            id: 104,
            name: "Jessica Alba",
            role: "Marketing Manager",
            userRole: "professional",
            avatar: "https://i.pravatar.cc/150?u=jessica"
        },
        {
            id: 105,
            name: "Iron Man",
            role: "Genius, Billionaire, Philanthropist",
            userRole: "company",
            avatar: "https://i.pravatar.cc/150?u=ironman"
        },
        {
            id: 106,
            name: "Black Widow",
            role: "Special Agent",
            userRole: "professor",
            avatar: "https://i.pravatar.cc/150?u=natasha"
        }
    ];

    return (
        <div className="network-container">
            <div className="network-content">
                <aside className="network-sidebar">
                    <div className="network-sidebar-card">
                        <div className="sidebar-title">Manage my connections</div>
                        <div className="sidebar-item">
                            <Icon name="users" />
                            <span>Connections</span>
                            <span className="sidebar-count">482</span>
                        </div>
                        <div className="sidebar-item">
                            <Icon name="comment-dots" />
                            <span>Messaging</span>
                        </div>
                        <div className="sidebar-item">
                            <Icon name="user-circle" size={18} />
                            <span>Following & followers</span>
                        </div>
                        <div className="sidebar-item">
                            <Icon name="users" />
                            <span>Groups</span>
                            <span className="sidebar-count">12</span>
                        </div>
                        <div className="sidebar-item">
                            <Icon name="calendar-alt" />
                            <span>Events</span>
                            <span className="sidebar-count">2</span>
                        </div>
                        <div className="sidebar-item">
                            <Icon name="newspaper" />
                            <span>Newsletter</span>
                            <span className="sidebar-count">5</span>
                        </div>
                        <div className="sidebar-item">
                            <Icon name="hashtag" />
                            <span>Hashtags</span>
                            <span className="sidebar-count">24</span>
                        </div>
                    </div>
                </aside>

                <main className="network-main">
                    {/* Embedded Messaging Section */}
                    <section className="messaging-section" style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid var(--border-color)', display: 'flex', height: '600px', gap: '20px' }}>
                        {/* Conversations List */}
                        <div className="conversations-sidebar" style={{ width: '320px', borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
                            <div className="conversations-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                <span>Messaging</span>
                                <Icon name="edit" className="cursor-pointer" />
                            </div>
                            <div className="conversations-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', height: 'calc(100% - 50px)' }}>
                                {conversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        className={`conversation-item ${activeChat === conv.id ? 'active' : ''}`}
                                        onClick={() => setActiveChat(conv.id)}
                                        style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '8px', cursor: 'pointer', gap: '12px', background: activeChat === conv.id ? 'var(--hover-bg)' : 'transparent' }}
                                    >
                                        <Avatar src={conv.avatar} role={conv.role} size={48} />
                                        <div className="conversation-details" style={{ flex: 1, minWidth: 0 }}>
                                            <div className="conversation-top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span className="conversation-name" style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{conv.name}</span>
                                                <span className="conversation-date" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{conv.date}</span>
                                            </div>
                                            <div className="conversation-preview" style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Window */}
                        <div className="chat-window" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div className="chat-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Avatar src={activeUser?.avatar} role={activeUser?.role} size={40} />
                                <div className="chat-user-info">
                                    <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{activeUser?.name}</h4>
                                    <span style={{ fontSize: '12px', color: 'var(--accent-primary)' }}>Active now</span>
                                </div>
                            </div>
                            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {messages.map(msg => (
                                    <div key={msg.id} className={`message-bubble ${msg.sent ? 'message-sent' : 'message-received'}`} style={{
                                        maxWidth: '70%',
                                        padding: '10px 16px',
                                        borderRadius: '12px',
                                        alignSelf: msg.sent ? 'flex-end' : 'flex-start',
                                        background: msg.sent ? 'var(--accent-primary)' : 'var(--hover-bg)',
                                        color: msg.sent ? '#fff' : 'var(--text-primary)'
                                    }}>
                                        {msg.text}
                                        <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>{msg.time}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input-area" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Write a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '10px 16px',
                                        borderRadius: '24px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-primary)',
                                        color: 'var(--text-primary)',
                                        outline: 'none'
                                    }}
                                />
                                <button className="chat-send-btn" style={{
                                    padding: '10px 24px',
                                    borderRadius: '24px',
                                    background: 'var(--accent-primary)',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}>Send</button>
                            </div>
                        </div>
                    </section>

                    <section className="invitations-section">
                        <div className="section-header">
                            <h2>Invitations</h2>
                            <button className="see-all-btn">See all 2</button>
                        </div>
                        {invitations.map(invite => (
                            <div key={invite.id} className="invitation-card">
                                <Avatar
                                    src={invite.avatar}
                                    alt={invite.name}
                                    role={invite.userRole}
                                    size={56}
                                    className="invite-avatar"
                                    style={{ borderRadius: 'unset' }} // Components handles shape class, need to unset inline style if it conflicts or let class take over. Avatar component adds class.
                                />
                                <div className="invite-info">
                                    <div className="invite-name">{invite.name}</div>
                                    <div className="invite-role">{invite.role}</div>
                                </div>
                                <div className="invite-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                                    <button className="ignore-btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>Ignore</button>
                                    <button className="accept-btn">Accept</button>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="suggestions-section">
                        <div className="modern-teal-badge">PEOPLE YOU MAY KNOW</div>
                        <div className="suggestions-grid">
                            {suggestions.map(person => (
                                <div key={person.id} className="suggestion-card">
                                    <div className="suggestion-banner"></div>
                                    <Avatar
                                        src={person.avatar}
                                        alt={person.name}
                                        role={person.userRole}
                                        size={110}
                                        className="suggestion-avatar"
                                    />
                                    <div className="suggestion-info" style={{ padding: '0 16px' }}>
                                        <div className="suggestion-name">{person.name}</div>
                                        <div className="suggestion-role">{person.role}</div>
                                    </div>
                                    <button className="connect-btn">
                                        <Icon name="user-plus" /> Connect
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default MyNetwork;
