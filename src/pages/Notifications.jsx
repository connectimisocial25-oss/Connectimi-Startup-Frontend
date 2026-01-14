import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Connectimi_logo from '../components/Connectimi_logo';
import './Notifications.css';

// Import Profile.css to get shared variables if they aren't global
import './Profile.css';

const Notifications = ({ embedded = false }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    // Mock Notifications Data
    const notifications = [
        {
            id: 1,
            type: 'job',
            text: 'Your job alert for "Frontend Developer" in "New York" has 30+ new opportunities.',
            time: '2h',
            read: false,
            userRole: 'company',
            icon: 'briefcase',
            iconBg: '#e7f3ff',
            iconColor: '#0a66c2',
            group: 'New'
        },
        {
            id: 2,
            type: 'connection',
            text: 'Sarah Miller accepted your connection request.',
            time: '5h',
            read: true,
            userRole: 'professional',
            image: 'https://i.pravatar.cc/150?u=sarah',
            group: 'New'
        },
        {
            id: 3,
            type: 'view',
            text: '5 people viewed your profile today.',
            time: '1d',
            read: true,
            userRole: 'company',
            icon: 'eye',
            iconBg: '#fff7e6',
            iconColor: '#d69e2e',
            group: 'Earlier'
        },
        {
            id: 4,
            type: 'post',
            text: 'David Wilson posted: "Just launched my new portfolio! Check it out 🚀"',
            time: '1d',
            read: true,
            userRole: 'professor',
            image: 'https://i.pravatar.cc/150?u=david',
            group: 'Earlier'
        },
        {
            id: 5,
            type: 'trending',
            text: 'Trending in Tech: React 19 is officially released. See what everyone is talking about.',
            time: '2d',
            read: true,
            userRole: 'company',
            icon: 'trending-up',
            iconBg: '#f2f2f2',
            iconColor: '#333333',
            group: 'Earlier'
        }
    ];

    // Grouping
    const groupedNotifications = {
        New: notifications.filter(n => n.group === 'New'),
        Earlier: notifications.filter(n => n.group === 'Earlier')
    };

    return (
        <div className="notifications-container">
            <div className="notifications-wrapper">
                <header className="notifications-page-header">
                    <h1>Notifications</h1>
                    <div className="notifications-actions">
                        <div className="filter-pill active">All</div>
                        <div className="filter-pill">My Posts</div>
                        <div className="filter-pill">Mentions</div>
                    </div>
                    <button className="settings-btn" title="Notification Settings">
                        <Icon name="cog" />
                    </button>
                </header>

                <div className="notifications-feed">
                    {Object.entries(groupedNotifications).map(([group, items], index) => (
                        <div key={group}>
                            {group === 'Earlier' && (
                                <div className="promoted-section">
                                    <div className="promoted-header">
                                        <span className="promoted-label">Promoted</span>
                                        <button className="promoted-more-btn"><Icon name="ellipsis-h" /></button>
                                    </div>
                                    <div className="promoted-content">
                                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=150" alt="Ad" className="promoted-image" />
                                        <div className="promoted-info">
                                            <h3>Unlock your full potential with Premium</h3>
                                            <p>See who viewed your profile and get exclusive insights.</p>
                                            <button className="promoted-cta">Try for Free</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {items.length > 0 && (
                                <div className="notification-group">
                                    <h2 className="group-title">{group}</h2>
                                    {items.map(notification => (
                                        <div key={notification.id} className={`notification-card ${notification.read ? 'read' : 'unread'}`}>
                                            <div className="notification-content-wrapper">
                                                <div className="notification-user-media">
                                                    {notification.image ? (
                                                        <Avatar
                                                            src={notification.image}
                                                            alt=""
                                                            role={notification.userRole}
                                                            size={48}
                                                            className="notification-avatar"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="system-icon-wrapper"
                                                            style={{
                                                                backgroundColor: notification.iconBg,
                                                                color: notification.iconColor
                                                            }}
                                                        >
                                                            <Icon name={notification.icon} size={20} />
                                                        </div>
                                                    )}
                                                    {/* Role Icon Badger - Optional, can be added if needed */}
                                                    {!notification.read && <div className="unread-dot-indicator"></div>}
                                                </div>

                                                <div className="notification-info">
                                                    <div className="notification-main-text">
                                                        {notification.text}
                                                    </div>
                                                    <div className="notification-meta">
                                                        <span className="time-stamp">{notification.time}</span>
                                                        {/* <span className="meta-separator">•</span> */}
                                                        {/* <span className="notification-type">{notification.type}</span> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="notification-options">
                                                <button className="more-options-btn">
                                                    <Icon name="ellipsis-h" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
