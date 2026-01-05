import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Connectimi_logo from '../components/Connectimi_logo';
import './Profile.css';

function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
              <div className="dropdown-item signout-item" onClick={() => navigate('/')}>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="home-container" style={{ paddingTop: '52px', minHeight: '100vh', backgroundColor: '#f3f2ef' }}>
      <Navbar />
      <div className="home-content" style={{ maxWidth: '1128px', margin: '24px auto', padding: '0 24px' }}>
        <div className="auth-form" style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}>
          <h2>Welcome to Connectimi!</h2>
          <p>This is your professional networking feed. Features for posting and interaction are coming soon.</p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button className="btn" onClick={() => navigate('/profile')}>View Profile</button>
            <button className="btn btn-outline-primary" style={{ background: 'white', color: 'var(--primary-blue)', border: '1px solid var(--primary-blue)' }} onClick={() => navigate('/work')}>Find Work</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
