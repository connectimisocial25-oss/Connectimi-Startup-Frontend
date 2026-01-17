import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import Icon from '../Icon';

const LeftSidebar = () => {
    const navigate = useNavigate();

    const user = {
        name: 'Alex Johnson',
        role: 'Senior Software Engineer',
        company: 'Opster',
        stack: 'React • TypeScript • Engineer',
        location: 'San Francisco',
        connections: '200+',
    };

    return (
        <aside className="left-sidebar-panel">
            {/* Profile Header Section */}
            <div className="sidebar-section profile-section">
                <div className="profile-header-row">
                    <Avatar
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                        size={60}
                        className="profile-avatar-dark"
                    />
                    <div className="profile-info-dark">
                        <h3 className="profile-name-dark" onClick={() => navigate('/profile')}>{user.name}</h3>
                        <p className="profile-role-dark">
                            {user.role} <span className="highlight-text">@{user.company}</span>
                        </p>
                        <p className="profile-role-dark">{user.stack}</p>
                        <p className="profile-sub-dark">GreyDants</p>
                        <p className="profile-sub-dark">Dutch Franchise • 200m 2099</p>
                    </div>
                </div>
            </div>

            <div className="sidebar-divider"></div>

            {/* Profile Analytics Section */}
            <div className="sidebar-section analytics-section">
                <h4 className="sidebar-title">Profile Analytics</h4>
                <div className="stats-list-dark">
                    <div className="stat-row-dark">
                        <span>Profile View</span>
                        <span className="stat-value-dark">883</span>
                    </div>
                    <div className="stat-row-dark">
                        <span>Post Interactions</span>
                        <span className="stat-value-dark">1.22M</span>
                    </div>
                    <div className="stat-row-dark">
                        <span>Reached be botmed</span>
                        <span className="stat-value-dark">390.09</span>
                    </div>
                    <div className="stat-row-dark">
                        <span>Search</span>
                        <span className="stat-value-dark">190</span>
                    </div>
                </div>
            </div>

            <div className="sidebar-divider"></div>

            {/* Resources Section */}
            <div className="sidebar-section resources-section">
                <h4 className="sidebar-title">Resources</h4>
                <div className="stats-list-dark">
                    <div className="stat-row-dark">
                        <span>Post Impressions</span>
                        <span className="stat-value-dark">3299</span>
                    </div>
                    <div className="stat-row-dark">
                        <span>Provce apppearances</span>
                        <span className="stat-value-dark">99</span>
                    </div>
                </div>
            </div>

            <div className="sidebar-divider"></div>

            {/* Mentorship Section */}
            <div className="sidebar-section mentorship-section">
                <h4 className="sidebar-title">Mentorship Opportunities</h4>
                <div className="mentorship-content">
                    <div className="mentorship-row">
                        <span>Border adicone P820-K</span>
                        <span className="mentorship-val">$345.99</span>
                    </div>
                    <div className="mentorship-row">
                        <span>Skils: 8223UG</span>
                        <span className="mentorship-val">03</span>
                    </div>
                </div>
                <div className="mentorship-footer">
                    <span>Deader hiy a Collab</span>
                    <Icon name="arrow-right" size={14} />
                </div>
            </div>

        </aside>
    );
};

export default LeftSidebar;
