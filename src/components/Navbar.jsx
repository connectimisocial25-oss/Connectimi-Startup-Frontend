import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import Avatar from './Avatar';
import Connectimi_logo from './Connectimi_logo';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'var(--nav-bg)', borderBottom: '1px solid var(--border-color)', height: '60px' }}>
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
                <div className="nav-item active" onClick={() => navigate('/home')}>
                    <div className="nav-icon"><Icon name="home" /></div>
                    <span className="nav-label">Home</span>
                </div>

                <div className="nav-item" onClick={() => navigate('/mynetwork')}>
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
                        <Avatar
                            src="https://via.placeholder.com/24"
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
