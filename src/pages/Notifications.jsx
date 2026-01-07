import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Connectimi_logo from '../components/Connectimi_logo';
import './Notifications.css';

// Import Profile.css to get shared variables if they aren't global
import './Profile.css';

const Notifications = () => {
    const navigate = useNavigate();
    const { theme } = useTheme(); // toggleTheme removed
    // isDropdownOpen removed

    // Mock Notifications Data
    const notifications = [
        {
            id: 1,
            type: 'job',
            text: 'Your job alert for "Frontend Developer" in "New York" has 30+ new opportunities.',
            time: '2h',
            read: false,
            userRole: 'company',
            image: 'https://via.placeholder.com/48/0a66c2/ffffff?text=Job'
        },
        {
            id: 2,
            type: 'connection',
            text: 'Sarah Miller accepted your connection request.',
            time: '5h',
            read: true,
            userRole: 'professional',
            image: 'https://i.pravatar.cc/150?u=sarah'
        },
        {
            id: 3,
            type: 'view',
            text: '5 people viewed your profile today.',
            time: '1d',
            read: true,
            userRole: 'company',
            image: 'https://via.placeholder.com/48/f8c77e/000000?text=View'
        },
        {
            id: 4,
            type: 'post',
            text: 'David Wilson posted: "Just launched my new portfolio! Check it out 🚀"',
            time: '1d',
            read: true,
            userRole: 'professor',
            image: 'https://i.pravatar.cc/150?u=david'
        },
        {
            id: 5,
            type: 'trending',
            text: 'Trending in Tech: React 19 is officially released. See what everyone is talking about.',
            time: '2d',
            read: true,
            userRole: 'company',
            image: 'https://via.placeholder.com/48/000000/ffffff?text=News'
        }
    ];



    return (
        <div className="notifications-container">
            <div className="notifications-content">
                {/* Left Sidebar */}
                <aside className="notifications-left-sidebar">
                    <div className="notifications-sidebar-card">
                        <div className="notifications-sidebar-items">
                            Manage your Notifications
                        </div>
                        <div style={{ marginTop: '16px', color: 'var(--primary-blue)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                            View Settings
                        </div>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="notifications-main">
                    <div className="notifications-header">
                        <div style={{ fontWeight: '600' }}>Notifications</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="notifications-filter-btn">My posts</button>
                            <button className="notifications-filter-btn">Mentions</button>
                        </div>
                    </div>

                    <div className="notifications-list">
                        {notifications.map(notification => (
                            <div key={notification.id} className={`notification-item ${notification.read ? '' : 'unread'}`}>
                                <div className="notification-icon">
                                    <Avatar
                                        src={notification.image}
                                        alt=""
                                        role={notification.userRole}
                                        size={48}
                                        className="notification-avatar"
                                    />
                                </div>
                                <div className="notification-details">
                                    <div className="notification-text">
                                        {notification.text}
                                    </div>
                                    <div className="notification-time">
                                        {notification.time}
                                    </div>
                                </div>
                                <button className="notification-options-btn">
                                    <Icon name="ellipsis-h" />
                                </button>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="notifications-right-sidebar">
                    <div className="ad-card">
                        <div style={{ fontSize: '12px', textAlign: 'right', marginBottom: '8px' }}>Ad</div>
                        <div style={{ marginBottom: '12px' }}>
                            <img src="https://via.placeholder.com/80" alt="Ad" style={{ borderRadius: '8px' }} />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            Master the skills you need for your future.
                        </div>
                        <button style={{
                            background: 'transparent',
                            border: '1px solid var(--primary-blue)',
                            color: 'var(--primary-blue)',
                            borderRadius: '16px',
                            padding: '6px 16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                            Learn more
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Notifications;
