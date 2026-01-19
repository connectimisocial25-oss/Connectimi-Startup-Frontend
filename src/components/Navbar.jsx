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

    const isActive = (path) => location.pathname === path;

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

            <div className="navbar-center">
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
                <div className={`nav-item ${isActive('/resources') ? 'active' : ''}`} onClick={() => navigate('/resources')}>
                    <div className="nav-icon"><Icon name="course" /></div>
                    <span className="nav-label">Resources</span>
                </div>


                <div className="nav-item me-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="nav-icon">
                        <Avatar
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            alt="Me"
                            role="professional"
                            size={24}
                            className="nav-profile-img"
                        />
                        <Icon name="caret-down" size={12} />
                    </div>
                    <span className="nav-label">Me</span>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                View Profile
                            </div>
                            <div className="dropdown-item" onClick={() => navigate('/notifications')}>
                                <Icon name="bell" />
                                Notifications
                            </div>
                            <div className="dropdown-item" onClick={toggleTheme}>
                                <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
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
};

export default Navbar;
