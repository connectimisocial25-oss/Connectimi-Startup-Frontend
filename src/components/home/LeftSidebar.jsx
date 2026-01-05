import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import Icon from '../Icon';

const LeftSidebar = () => {
    const navigate = useNavigate();

    // Mock data - replace with actual context/props later
    const user = {
        name: 'Alex Johnson',
        headline: 'Senior Software Engineer at TechCorp',
        location: 'San Francisco',
        joined: '2019',
        bgGradient: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)' // Fallback or specific
    };

    const stats = {
        views: '1,234',
        impressions: '12.5K',
        searchAppearances: 89
    };

    return (
        <aside className="left-sidebar">
            {/* Profile Card */}
            <div className="card profile-card">
                <div className="card-banner" style={{ background: '#5735e0ff' }}></div>
                <div className="card-body profile-body">
                    <div className="profile-avatar-wrapper">
                        <Avatar
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            alt={user.name}
                            size={72}
                            className="profile-avatar-large"
                        />
                    </div>
                    <div className="profile-identity">
                        <h3 className="profile-name" onClick={() => navigate('/profile')}>{user.name}</h3>
                        <p className="profile-headline">{user.headline}</p>
                        <div className="profile-meta">
                            <span className="meta-item">
                                <Icon name="map-marker-alt" size={12} /> {user.location}
                            </span>
                            <span className="meta-item">
                                <Icon name="calendar-alt" size={12} /> Joined {user.joined}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Card */}
            <div className="card stats-card">
                <h4 className="card-title">
                    <Icon name="chart-line" size={14} style={{ color: 'var(--primary-blue)' }} />
                    Profile Analytics
                </h4>
                <div className="stats-list">
                    <div className="stat-row">
                        <span className="stat-label">Profile views</span>
                        <span className="stat-value">{stats.views}</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Post impressions</span>
                        <span className="stat-value">{stats.impressions}</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Search appearances</span>
                        <span className="stat-value">{stats.searchAppearances}</span>
                    </div>
                </div>
            </div>

            {/* Resources / Menu Card */}
            <div className="card menu-card">
                <h4 className="card-title">Resources</h4>
                <ul className="menu-list">
                    <li className="menu-item">
                        <div className="menu-label">Saved items</div>
                        <span className="menu-badge">12</span>
                    </li>
                    <li className="menu-item">
                        <div className="menu-label">My events</div>
                        <span className="menu-badge">3</span>
                    </li>
                    <li className="menu-item">
                        <div className="menu-label">My groups</div>
                        <span className="menu-badge">8</span>
                    </li>
                </ul>
            </div>

            {/* Profile Strength */}
            <div className="card strength-card">
                <div className="strength-header">
                    <h4 className="card-title">Profile Strength</h4>
                    <span className="strength-score">85%</span>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
                <p className="strength-hint">Add a portfolio link to reach 100%</p>
            </div>

        </aside>
    );
};

export default LeftSidebar;
