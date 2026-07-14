import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Connectimi_logo from '../components/Connectimi_logo';
import gsap from 'gsap';
import './Notifications.css';
import API from '../services/api';

// Import Profile.css to get shared variables if they aren't global
import './Profile.css';

const Notifications = ({ embedded = false }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.notifications-page-header', {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
            gsap.from('.notification-card', {
                opacity: 0,
                y: 20,
                stagger: 0.08,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.2
            });
            gsap.from('.promoted-section', {
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                ease: 'back.out(1.7)',
                delay: 0.4
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            setNotificationsLoading(true);
            try {
                const res = await API.get("/notifications");
                setNotifications(res.data.notifications || []);
            } catch (err) {
                console.error("Failed to load notifications:", err.message);
            } finally {
                setNotificationsLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const created = new Date(dateStr);
        const now = new Date();
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d`;
    };

    const mapNotificationToUI = (n) => {
        const senderName = n.sender?.full_name || n.sender?.consultant_name || "Someone";
        const senderImg = n.sender?.profile_picture || n.sender?.logo || null;
        const senderRole = n.sender?.role || "professional";
        const time = formatTime(n.created_at);

        let text = "";
        let icon = "bell";
        let iconBg = "rgba(16, 185, 129, 0.1)";
        let iconColor = "#10B981";

        switch (n.type) {
            case "like":
                text = `${senderName} liked your post.`;
                icon = "thumbs-up";
                iconBg = "rgba(59, 130, 246, 0.1)";
                iconColor = "#3b82f6";
                break;
            case "comment":
                text = `${senderName} commented on your post.`;
                icon = "comment";
                iconBg = "rgba(16, 185, 129, 0.1)";
                iconColor = "#10B981";
                break;
            case "connection_request":
                text = `${senderName} sent you a connection request.`;
                icon = "user-friends";
                iconBg = "rgba(245, 158, 11, 0.1)";
                iconColor = "#f59e0b";
                break;
            case "connection_accept":
                text = `${senderName} accepted your connection request.`;
                icon = "check-circle";
                iconBg = "rgba(16, 185, 129, 0.1)";
                iconColor = "#10B981";
                break;
            case "message":
                text = `${senderName} sent you a message.`;
                icon = "comment-dots";
                iconBg = "rgba(139, 92, 246, 0.1)";
                iconColor = "#8b5cf6";
                break;
            default:
                text = `${senderName} interacted with your profile.`;
        }

        return {
            id: n._id,
            text,
            time,
            read: n.is_read,
            userRole: senderRole,
            image: senderImg,
            icon,
            iconBg,
            iconColor,
            postId: n.post?._id || n.post,
            senderId: n.sender?._id || n.sender
        };
    };

    const uiNotifications = notifications.map(mapNotificationToUI);

    const handleMarkAsRead = async (id) => {
        try {
            await API.put("/notifications/read", { notificationId: id });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
            window.dispatchEvent(new Event('notifications_updated'));
        } catch (err) {
            console.error("Failed to mark notification as read:", err.message);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await API.put("/notifications/read");
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            window.dispatchEvent(new Event('notifications_updated'));
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err.message);
        }
    };

    const handleNotificationClick = (item) => {
        if (!item.read) {
            handleMarkAsRead(item.id);
        }
        
        // Navigate based on type
        if (item.postId) {
            navigate("/home");
        } else if (item.senderId) {
            navigate(`/profile/${item.senderId}`);
        }
    };

    // Grouping
    const groupedNotifications = {
        New: uiNotifications.filter(n => !n.read),
        Earlier: uiNotifications.filter(n => n.read)
    };

    return (
        <div className="notifications-container" ref={containerRef}>
            <div className="notifications-wrapper">
                <header className="notifications-page-header">
                    <h1>Notifications</h1>
                    <div className="notifications-actions">
                        <div className="filter-pill active">All</div>
                        <div className="filter-pill">My Posts</div>
                        <div className="filter-pill">Mentions</div>
                    </div>
                    {notifications.some(n => !n.is_read) && (
                        <button className="settings-btn" onClick={handleMarkAllAsRead} title="Mark all as read" style={{ display: 'flex', alignItems: 'center', gap: '5px', width: 'auto', padding: '8px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.85rem', color: 'white' }}>
                            <Icon name="check" size={14} /> Mark all as read
                        </button>
                    )}
                </header>

                <div className="notifications-feed">
                    {notificationsLoading && (
                        <p style={{ color: 'var(--text-muted)', padding: '32px', textAlign: 'center' }}>Loading notifications…</p>
                    )}
                    
                    {!notificationsLoading && notifications.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔔</div>
                            <h3>No notifications yet</h3>
                            <p>We'll notify you when someone interacts with you or your posts.</p>
                        </div>
                    )}

                    {!notificationsLoading && Object.entries(groupedNotifications).map(([group, items], index) => (
                        <div key={group}>
                            {group === 'Earlier' && items.length > 0 && (
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
                                        <div 
                                            key={notification.id} 
                                            className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                                            onClick={() => handleNotificationClick(notification)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="notification-content-wrapper">
                                                <div className="notification-user-media">
                                                    {notification.image ? (
                                                        <Avatar
                                                            src={notification.image}
                                                            alt=""
                                                            role={notification.userRole}
                                                            size={56}
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
                                                            <Icon name={notification.icon} size={24} />
                                                        </div>
                                                    )}
                                                    {!notification.read && <div className="unread-dot-indicator"></div>}
                                                </div>

                                                <div className="notification-info">
                                                    <div className="notification-main-text">
                                                        {notification.text}
                                                    </div>
                                                    <div className="notification-meta">
                                                        <span className="time-stamp">{notification.time}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="notification-options" onClick={(e) => e.stopPropagation()}>
                                                {!notification.read ? (
                                                    <button className="more-options-btn" onClick={() => handleMarkAsRead(notification.id)} title="Mark as read" style={{ color: 'var(--emerald-500)' }}>
                                                        <Icon name="check" size={14} />
                                                    </button>
                                                ) : (
                                                    <button className="more-options-btn">
                                                        <Icon name="ellipsis-h" />
                                                    </button>
                                                )}
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
