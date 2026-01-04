import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch, FaHome, FaUserFriends, FaBriefcase,
  FaCommentDots, FaBell, FaCaretDown
} from 'react-icons/fa';
import Connectimi_logo from '../components/Connectimi_logo';
import './Profile.css';

const Home = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const Navbar = () => (
    <nav className="navbar">
      <div className="navbar-left">
        <Connectimi_logo />
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-center">
        <div className="nav-item active" onClick={() => navigate('/home')}>
          <div className="nav-icon"><FaHome /></div>
          <span className="nav-label">Home</span>
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
    <div className="home-container" style={{ paddingTop: '52px', minHeight: '100vh', backgroundColor: '#f3f2ef' }}>
      <Navbar />
      <div className="home-content" style={{ maxWidth: '1128px', margin: '24px auto', padding: '0 24px' }}>
        <div className="auth-form" style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}>
          <h2>Welcome to Connectimi!</h2>
          <p>This is your professional networking feed. Features for posting and interaction are coming soon.</p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button className="btn" onClick={() => navigate('/profile')}>View Profile</button>
            <button className="btn" style={{ background: 'white', color: '#0a66c2', border: '1px solid #0a66c2' }} onClick={() => navigate('/jobs')}>Find Jobs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
