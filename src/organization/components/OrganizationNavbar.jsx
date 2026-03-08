import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Icon from '../../components/Icon';
import Avatar from '../../components/Avatar';
import Connectimi_logo from '../../components/Connectimi_logo';
import { useTheme } from '../../context/ThemeContext';

import './OrganizationNavbar.css';

const OrganizationNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navBarRef = useRef(null);

    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const navRef = React.useRef(null);

    const isActive = (path) => {
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
    }, [location.pathname]);

    const navItems = [
        { id: 'feed', path: '/organization/feed', icon: 'home', label: 'Feed' },
        { id: 'messaging', path: '/organization/messages', icon: 'comment-dots', label: 'Messages' },
        { id: 'notifications', path: '/organization/alerts', icon: 'bell', label: 'Alerts' },
        { id: 'courses', path: '/organization/courses', icon: 'book', label: 'Courses' },
        { id: 'ads', path: '/organization/ads', icon: 'trending-up', label: 'Ads' }
    ];

    return (
        <>
            <nav className="navbar" ref={navBarRef}>
                <div className="navbar-left">
                    <Connectimi_logo />
                    <div className="search-bar">
                        <Icon name="search" className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search Organization"
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="navbar-center desktop-nav" ref={navRef}>
                    {/* Sliding Background Pill */}
                    <div className="nav-background-pill" style={indicatorStyle} />

                    {navItems.map(item => (
                        <div
                            key={item.id}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <div className="nav-icon"><Icon name={item.icon} /></div>
                            <span className="nav-label">{item.label}</span>
                        </div>
                    ))}

                    <div className={`nav-item me-dropdown`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <div className="nav-icon">
                            <Avatar
                                src="https://via.placeholder.com/150"
                                alt="Organization"
                                role="organization"
                                size={24}
                                className="nav-profile-img"
                            />
                        </div>
                        <span className="nav-label">Me</span>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => { navigate('/organization/profile'); setIsDropdownOpen(false); }}>
                                    <Icon name="user" />
                                    View Profile
                                </div>
                                <div className="dropdown-item" onClick={toggleTheme}>
                                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </div>
                                <div className="dropdown-item signout-item" onClick={() => navigate('/')}>
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
                    <div className={`nav-item me-dropdown`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <Avatar
                            src="https://via.placeholder.com/150"
                            alt="Organization"
                            role="organization"
                            size={32}
                            className="nav-profile-img"
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => { navigate('/organization/profile'); setIsDropdownOpen(false); }}>
                                    <Icon name="user" />
                                    View Profile
                                </div>
                                <div className="dropdown-item" onClick={toggleTheme}>
                                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </div>
                                <div className="dropdown-item signout-item" onClick={() => navigate('/')}>
                                    <Icon name="sign-out" />
                                    Sign Out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="mobile-bottom-nav">
                {navItems.slice(0, 4).map(item => (
                    <div
                        key={item.id}
                        className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <Icon name={item.icon} size={24} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default OrganizationNavbar;
