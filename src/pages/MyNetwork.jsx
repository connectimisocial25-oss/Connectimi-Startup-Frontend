import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaSearch, FaHome, FaUserFriends, FaBriefcase,
    FaCommentDots, FaBell, FaCaretDown, FaUserPlus,
    FaUsers, FaAddressBook, FaCalendarAlt, FaFileAlt, FaRss
} from 'react-icons/fa';
import Connectimi_logo from '../components/Connectimi_logo';
import './MyNetwork.css';
import './Profile.css';
import './Jobs.css';

const MyNetwork = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const invitations = [
        {
            id: 1,
            name: 'Priya Sharma',
            role: 'Product Designer at Creative Labs',
            mutual: 12,
            avatar: 'https://i.pravatar.cc/150?u=priya'
        },
        {
            id: 2,
            name: 'Rahul Verma',
            role: 'Full Stack Developer',
            mutual: 5,
            avatar: 'https://i.pravatar.cc/150?u=rahul'
        }
    ];

    const suggestions = [
        {
            id: 101,
            name: 'Anjali Gupta',
            role: 'Recruiter at Tech Giants',
            mutual: 24,
            avatar: 'https://i.pravatar.cc/150?u=anjali'
        },
        {
            id: 102,
            name: 'Vikram Singh',
            role: 'Director of Engineering',
            mutual: 8,
            avatar: 'https://i.pravatar.cc/150?u=vikram'
        },
        {
            id: 103,
            name: 'Sneha Rao',
            role: 'UX Researcher',
            mutual: 15,
            avatar: 'https://i.pravatar.cc/150?u=sneha'
        },
        {
            id: 104,
            name: 'Arjun Mehta',
            role: 'Marketing Lead',
            mutual: 3,
            avatar: 'https://i.pravatar.cc/150?u=arjun'
        }
    ];

    const Navbar = () => (
        <nav className="navbar">
            <div className="navbar-left">
                <Connectimi_logo />
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search network"
                        className="search-input"
                    />
                </div>
            </div>

            <div className="navbar-center">
                <div className="nav-item" onClick={() => navigate('/home')}>
                    <div className="nav-icon"><FaHome /></div>
                    <span className="nav-label">Home</span>
                </div>
                <div className="nav-item active" onClick={() => navigate('/mynetwork')}>
                    <div className="nav-icon"><FaUserFriends /></div>
                    <span className="nav-label">My Network</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/jobs')}>
                    <div className="nav-icon"><FaBriefcase /></div>
                    <span className="nav-label">Jobs</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/messaging')}>
                    <div className="nav-icon"><FaCommentDots /></div>
                    <span className="nav-label">Messaging</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/notifications')}>
                    <div className="nav-icon"><FaBell /></div>
                    <span className="nav-label">Notifications</span>
                </div>

                <div className="nav-item me-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="nav-icon">
                        <img src="https://via.placeholder.com/24" alt="Me" className="nav-profile-img" />
                        <FaCaretDown size={12} />
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
                        <h3 className="sidebar-title">Manage my network</h3>
                        <div className="sidebar-item">
                            <FaUserFriends /> <span>Connections</span>
                            <span className="sidebar-count">482</span>
                        </div>
                        <div className="sidebar-item">
                            <FaUsers /> <span>Teammates</span>
                        </div>
                        <div className="sidebar-item">
                            <FaAddressBook /> <span>Contacts</span>
                        </div>
                        <div className="sidebar-item">
                            <FaUserPlus /> <span>Following & Followers</span>
                        </div>
                        <div className="sidebar-item">
                            <FaUsers /> <span>Groups</span>
                        </div>
                        <div className="sidebar-item">
                            <FaCalendarAlt /> <span>Events</span>
                        </div>
                        <div className="sidebar-item">
                            <FaFileAlt /> <span>Pages</span>
                        </div>
                        <div className="sidebar-item">
                            <FaRss /> <span>Newsletters</span>
                        </div>
                    </div>
                </aside>

                <main className="network-main">
                    <section className="invitations-section">
                        <div className="section-header">
                            <h2>Invitations</h2>
                            <button className="see-all-btn">See all</button>
                        </div>
                        <div className="invitations-list">
                            {invitations.map(invite => (
                                <div key={invite.id} className="invitation-card">
                                    <img src={invite.avatar} alt={invite.name} className="invite-avatar" />
                                    <div className="invite-info">
                                        <div className="invite-name">{invite.name}</div>
                                        <div className="invite-role">{invite.role}</div>
                                        <div className="invite-mutual">{invite.mutual} mutual connections</div>
                                    </div>
                                    <div className="invite-actions">
                                        <button className="ignore-btn">Ignore</button>
                                        <button className="accept-btn">Accept</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="suggestions-section">
                        <div className="section-header">
                            <h2>People you may know</h2>
                            <button className="see-all-btn">See all</button>
                        </div>
                        <div className="suggestions-grid">
                            {suggestions.map(person => (
                                <div key={person.id} className="suggestion-card">
                                    <div className="suggestion-banner"></div>
                                    <img src={person.avatar} alt={person.name} className="suggestion-avatar" />
                                    <div className="suggestion-info">
                                        <div className="suggestion-name">{person.name}</div>
                                        <div className="suggestion-role">{person.role}</div>
                                        <div className="suggestion-mutual">{person.mutual} mutual connections</div>
                                    </div>
                                    <button className="connect-btn">
                                        <FaUserPlus /> Connect
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
