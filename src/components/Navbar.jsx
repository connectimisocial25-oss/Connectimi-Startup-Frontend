import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Icon from './Icon';
import Avatar from './Avatar';
import Connectimi_logo from './Connectimi_logo';
import { useTheme } from '../context/ThemeContext';

import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import API from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { conversations, isConnected, fetchConversations } = useChat();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navBarRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const unreadMessagesCount = (conversations || []).reduce((acc, c) => acc + (c.unreadCount || 0), 0);

    // Messaging lives in the "Me" dropdown now, so the badge has to be live everywhere
    useEffect(() => {
        if (isConnected) {
            fetchConversations();
        }
    }, [isConnected, fetchConversations]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await API.get("/notifications");
                const unread = (res.data.notifications || []).filter(n => !n.is_read).length;
                setUnreadCount(unread);
            } catch (err) {
                console.error("Failed to fetch unread notification count:", err.message);
            }
        };
        if (user) {
            fetchUnreadCount();
        }

        window.addEventListener('notifications_updated', fetchUnreadCount);
        return () => {
            window.removeEventListener('notifications_updated', fetchUnreadCount);
        };
    }, [location.pathname, user]);

    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const navRef = React.useRef(null);

    // Messaging is a tab of /mynetwork, so the two share a pathname and split on ?tab
    const isMessaging = location.pathname === '/mynetwork'
        && new URLSearchParams(location.search).get('tab') === 'messaging';

    const isActive = (path) => {
        if (path === '/messaging') return isMessaging;
        if (path === '/mynetwork') return location.pathname === '/mynetwork' && !isMessaging;
        if (path === '/me') return location.pathname === '/profile';
        return location.pathname === path;
    };

    useEffect(() => {
        // Entrance animation
        gsap.fromTo(navBarRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
    }, []);

    useEffect(() => {
        const updateIndicator = () => {
            if (!navRef.current) return;

            const activeItem = navRef.current.querySelector('.nav-item.active');

            if (activeItem) {
                const { offsetLeft, offsetWidth } = activeItem;
                setIndicatorStyle({
                    left: offsetLeft,
                    width: offsetWidth,
                    opacity: 1
                });
            } else {
                setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
            }
        };

        updateIndicator();
        const timeoutId = setTimeout(updateIndicator, 50);

        window.addEventListener('resize', updateIndicator);
        return () => {
            window.removeEventListener('resize', updateIndicator);
            clearTimeout(timeoutId);
        };
    }, [location.pathname, location.search]);

    return (
        <>
            <nav className="navbar" ref={navBarRef}>
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

                <div className="navbar-center desktop-nav" ref={navRef}>
                    {/* Sliding Background Pill */}
                    <div className="nav-background-pill" style={indicatorStyle} />

                    <div className={`nav-item ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>
                        <div className="nav-icon"><Icon name="home" /></div>
                        <span className="nav-label">Home</span>
                    </div>

                    <div className={`nav-item ${isActive('/mynetwork') ? 'active' : ''}`} onClick={() => navigate('/mynetwork')}>
                        <div className="nav-icon"><Icon name="user-friends" /></div>
                        <span className="nav-label">Connections</span>
                    </div>

                    <div className={`nav-item ${isActive('/messaging') ? 'active' : ''}`} onClick={() => navigate('/mynetwork?tab=messaging')}>
                        <div className="nav-icon">
                            <Icon name="comment-dots" />
                            {unreadMessagesCount > 0 && <div className="nav-icon-badge">{unreadMessagesCount}</div>}
                        </div>
                        <span className="nav-label">Messaging</span>
                    </div>

                    <div className={`nav-item ${isActive('/notifications') ? 'active' : ''}`} onClick={() => navigate('/notifications')}>
                        <div className="nav-icon">
                            <Icon name="bell" />
                            {unreadCount > 0 && <div className="nav-icon-badge">{unreadCount}</div>}
                        </div>
                        <span className="nav-label">Notifications</span>
                    </div>

                    <div className={`nav-item me-dropdown ${isActive('/me') ? 'active' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <div className="nav-icon">
                            <Avatar
                                src={user?.profileImage}
                                alt="Me"
                                role="professional"
                                size={24}
                                className="nav-profile-img"
                            />
                        </div>
                        <span className="nav-label">Me</span>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}>
                                    <Icon name="user" />
                                    View Profile
                                </div>
                                <div className="dropdown-item" onClick={toggleTheme}>
                                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </div>
                                <div className="dropdown-item signout-item" onClick={() => logout()}>
                                    <Icon name="sign-out" />
                                    Sign Out
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="nav-indicator" style={indicatorStyle} />
                </div>

                <div className="navbar-right-mobile">
                    <div className="mobile-search-trigger">
                        <Icon name="search" />
                    </div>
                    <div className={`nav-item me-dropdown ${isActive('/me') ? 'active' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <Avatar
                            src={user?.profileImage}
                            alt="Me"
                            role="professional"
                            size={32}
                            className="nav-profile-img"
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}>
                                    <Icon name="user" />
                                    View Profile
                                </div>
                                <div className="dropdown-item" onClick={() => { navigate('/projects/new'); setIsDropdownOpen(false); }}>
                                    <Icon name="project" />
                                    Share Project
                                </div>
                                <div className="dropdown-item" onClick={toggleTheme}>
                                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </div>
                                <div className="dropdown-item signout-item" onClick={() => logout()}>
                                    <Icon name="sign-out" />
                                    Sign Out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="mobile-bottom-nav">
                <div className={`mobile-nav-item ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>
                    <Icon name="home" size={24} />
                    <span>Home</span>
                </div>
                <div className={`mobile-nav-item ${isActive('/mynetwork') ? 'active' : ''}`} onClick={() => navigate('/mynetwork')}>
                    <Icon name="user-friends" size={24} />
                    <span>Network</span>
                </div>
                <div className={`mobile-nav-item ${isActive('/messaging') ? 'active' : ''}`} onClick={() => navigate('/mynetwork?tab=messaging')}>
                    <Icon name="comment-dots" size={24} />
                    {unreadMessagesCount > 0 && <div className="nav-icon-badge">{unreadMessagesCount}</div>}
                    <span>Messaging</span>
                </div>
                <div className={`mobile-nav-item ${isActive('/notifications') ? 'active' : ''}`} onClick={() => navigate('/notifications')}>
                    <Icon name="bell" size={24} />
                    {unreadCount > 0 && <div className="nav-icon-badge">{unreadCount}</div>}
                    <span>Alerts</span>
                </div>
            </div>
        </>
    );
};

export default Navbar;
