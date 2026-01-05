import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Connectimi_logo from '../components/Connectimi_logo';
import './MyNetwork.css';
const MyNetwork = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const invitations = [
        {
            id: 2,
            name: "Michael Chen",
            role: "Product Manager at InnovateSoft",
            avatar: "https://i.pravatar.cc/150?u=michael"
        },
        {
            id: 1,
            name: "Sarah Miller",
            role: "Software Engineer at TechCorp",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        }
    ];

    const suggestions = [
        {
            id: 101,
            name: "David Wilson",
            role: "Full Stack Developer | React & Node.js",
            avatar: "https://i.pravatar.cc/150?u=david"
        },
        {
            id: 102,
            name: "Emily Blunt",
            role: "UI/UX Designer at Creative Studio",
            avatar: "https://i.pravatar.cc/150?u=emily"
        },
        {
            id: 103,
            name: "James Bond",
            role: "Security Analyst",
            avatar: "https://i.pravatar.cc/150?u=james"
        },
        {
            id: 104,
            name: "Jessica Alba",
            role: "Marketing Manager",
            avatar: "https://i.pravatar.cc/150?u=jessica"
        },
        {
            id: 105,
            name: "Iron Man",
            role: "Genius, Billionaire, Philanthropist",
            avatar: "https://i.pravatar.cc/150?u=ironman"
        },
        {
            id: 106,
            name: "Black Widow",
            role: "Special Agent",
            avatar: "https://i.pravatar.cc/150?u=natasha"
        }
    ];

    const Navbar = () => (
        <nav className="navbar">
            <div className="navbar-left">
                <Connectimi_logo />
                <div className="search-bar">
                    <Icon name="search" className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                    />
                </div>
            </div>

            <div className="navbar-center">
                <div className="nav-item" onClick={() => navigate('/home')}>
                    <div className="nav-icon"><Icon name="home" /></div>
                    <span className="nav-label">Home</span>
                </div>

                <div className="nav-item active" onClick={() => navigate('/mynetwork')}>
                    <div className="nav-icon"><Icon name="user-friends" /></div>
                    <span className="nav-label">My Connection</span>
                </div>

                <div className="nav-item" onClick={() => navigate('/work')}>
                    <div className="nav-icon"><Icon name="briefcase" /></div>
                    <span className="nav-label">Work</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/messaging')}>
                    <div className="nav-icon"><Icon name="comment-dots" /></div>
                    <span className="nav-label">Messaging</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/notifications')}>
                    <div className="nav-icon"><Icon name="bell" /></div>
                    <span className="nav-label">Notifications</span>
                </div>

                <div className="nav-item me-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="nav-icon">
                        <img src="https://via.placeholder.com/24" alt="Me" className="nav-profile-img" />
                        <Icon name="caret-down" size={12} />
                    </div>
                    <span className="nav-label">Me</span>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                View Profile
                            </div>
                            <div className="dropdown-item signout-item" onClick={() => navigate('/')}>
                                Sign Out
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );

    return (
        <div className="network-container">
            <Navbar />
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
                    <section className="invitations-section">
                        <div className="section-header">
                            <h2>Invitations</h2>
                            <button className="see-all-btn">See all 2</button>
                        </div>
                        {invitations.map(invite => (
                            <div key={invite.id} className="invitation-card">
                                <img src={invite.avatar} alt={invite.name} className="invite-avatar" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
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
                                    <img src={person.avatar} alt={person.name} className="suggestion-avatar" />
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
