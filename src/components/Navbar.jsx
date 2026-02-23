import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Avatar from './Avatar';
import Connectimi_logo from './Connectimi_logo';
import { useTheme } from '../context/ThemeContext';

import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const navRef = React.useRef(null);

    const isActive = (path) => {
        if (path === '/courses') {
            return location.pathname.startsWith('/courses') || location.pathname === '/course';
        }

        if (path === '/me') {
            return ['/profile', '/notifications'].includes(location.pathname);
        }
        return location.pathname === path;
    };

    React.useEffect(() => {
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
    }, [location.pathname]); // Re-run when route changes

    return (
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

            <div className="navbar-center" ref={navRef}>
                {/* Sliding Background Pill */}
                <div className="nav-background-pill" style={indicatorStyle} />

                <div className={`nav-item ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>
                    <div className="nav-icon"><Icon name="home" /></div>
                    <span className="nav-label">Home</span>
                </div>

                <div className={`nav-item ${isActive('/mynetwork') ? 'active' : ''}`} onClick={() => navigate('/mynetwork')}>
                    <div className="nav-icon"><Icon name="user-friends" /></div>
                    <span className="nav-label">My Connection</span>
                </div>

                <div className={`nav-item ${isActive('/work') ? 'active' : ''}`} onClick={() => navigate('/work')}>
                    <div className="nav-icon"><Icon name="briefcase" /></div>
                    <span className="nav-label">Work</span>
                </div>
                <div className={`nav-item ${isActive('/courses') ? 'active' : ''}`} onClick={() => navigate('/courses')}>
                    <div className="nav-icon">
                        <Icon name="course" />
                    </div>
                    <span className="nav-label">Courses</span>
                </div>


                <div className={`nav-item me-dropdown ${isActive('/me') ? 'active' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="nav-icon">
                        <Avatar
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            alt="Me"
                            role="professional"
                            size={24}
                            className="nav-profile-img"
                        />
                        <div className="nav-icon-badge">3</div>
                    </div>
                    <span className="nav-label">Me</span>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}>
                                <Icon name="user" />
                                View Profile
                            </div>
                            <div className="dropdown-item" onClick={() => { navigate('/notifications'); setIsDropdownOpen(false); }}>
                                <Icon name="bell" />
                                Notifications
                                <span className="dropdown-badge">3 New</span>
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
        </nav>
    );
};

export default Navbar;
