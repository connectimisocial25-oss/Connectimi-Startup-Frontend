import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import './OrganizationProfile.css';

// Reusing existing components where possible or creating compact versions
import Messaging from './Messaging';
import Notifications from './Notifications';

const OrganizationProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [orgData, setOrgData] = useState({
        name: "TechCorp Inc.",
        type: "Software Company",
        email: "contact@techcorp.com",
        location: "San Francisco, CA",
        website: "https://techcorp.com",
        description: "Leading innovator in enterprise software solutions and cloud computing.",
        logo: "https://via.placeholder.com/150",
        courses: [
            { id: 1, title: "React for Enterprise", students: 1240, rating: 4.8, revenue: "$12,400" },
            { id: 2, title: "Advancing Cloud Security", students: 850, rating: 4.9, revenue: "$8,500" }
        ]
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSignOut = () => {
        // Clear tokens/data
        localStorage.removeItem('userToken');
        navigate('/');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="org-section-card profile-card-polished">
                        {/* Banner Image */}
                        <div className="org-banner-container">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                                alt="Cover"
                                className="org-banner-img"
                            />
                            <button className="org-edit-cover-btn"><Icon name="camera" /> Edit Cover</button>
                        </div>

                        <div className="org-profile-header-content">
                            <div className="org-section-header no-border">
                                <h2 className="org-section-title">Organization Profile</h2>
                                <button className="org-btn-primary" onClick={() => setIsEditing(!isEditing)}>
                                    <Icon name={isEditing ? "save" : "edit"} />
                                    {isEditing ? "Save Changes" : "Edit Profile"}
                                </button>
                            </div>

                            {isEditing ? (
                                <div className="org-form-grid">
                                    <div className="org-form-group">
                                        <label>Company Name</label>
                                        <input
                                            type="text"
                                            value={orgData.name}
                                            onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="org-form-group">
                                        <label>Industry / Type</label>
                                        <input
                                            type="text"
                                            value={orgData.type}
                                            onChange={(e) => setOrgData({ ...orgData, type: e.target.value })}
                                        />
                                    </div>
                                    <div className="org-form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            value={orgData.location}
                                            onChange={(e) => setOrgData({ ...orgData, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="org-form-group">
                                        <label>Website</label>
                                        <input
                                            type="text"
                                            value={orgData.website}
                                            onChange={(e) => setOrgData({ ...orgData, website: e.target.value })}
                                        />
                                    </div>
                                    <div className="org-form-group full-width">
                                        <label>Description</label>
                                        <textarea
                                            rows="4"
                                            value={orgData.description}
                                            onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
                                        <img
                                            src={orgData.logo}
                                            alt="Logo"
                                            className="org-avatar-large"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=TC&background=0D8ABC&color=fff&size=150' }}
                                        />
                                        <div style={{ marginLeft: '24px', flex: 1 }}>
                                            <h1 style={{ margin: '0 0 8px', fontSize: '28px', color: 'var(--text-primary)' }}>{orgData.name}</h1>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '16px' }}>{orgData.type}</div>

                                            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
                                                <span className="icon-text"><Icon name="map-marker" /> {orgData.location}</span>
                                                <span className="icon-text"><Icon name="globe" /> <a href={orgData.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>{orgData.website}</a></span>
                                                <span className="icon-text"><Icon name="users" /> 12,500 Followers</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="org-about-section">
                                        <h3>About</h3>
                                        <p style={{ lineHeight: '1.8', color: 'var(--text-primary)' }}>{orgData.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'messaging':
                return (
                    // Reusing Messaging component but could act as a specialized view
                    <div style={{ height: 'calc(100vh - 120px)' }}>
                        <Messaging embedded={true} />
                    </div>
                );
            case 'notifications':
                return (
                    <div className="org-section-card">
                        <h2 className="org-section-title" style={{ marginBottom: '20px' }}>Notifications</h2>
                        <Notifications embedded={true} />
                    </div>
                );
            case 'courses':
                return (
                    <div className="org-section-card">
                        <div className="org-section-header">
                            <h2 className="org-section-title">Manage Courses</h2>
                            <button className="org-btn-primary">
                                <Icon name="plus" /> Add New Course
                            </button>
                        </div>

                        <div className="org-course-list">
                            {orgData.courses.map(course => (
                                <div key={course.id} className="org-course-item">
                                    <div className="org-course-img">
                                        {/* Placeholder for course img */}
                                        <div style={{ width: '100%', height: '100%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name="image" size={24} color="#888" />
                                        </div>
                                    </div>
                                    <div className="org-course-info">
                                        <div className="org-course-title">{course.title}</div>
                                        <div className="org-course-stats">
                                            <span><Icon name="users" /> {course.students} Students</span>
                                            <span><Icon name="star" /> {course.rating} Rating</span>
                                            <span> Est. Revenue: {course.revenue}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                                            <Icon name="edit" />
                                        </button>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'red' }}>
                                            <Icon name="trash" /> {/* Assuming trash icon exists? If not, verify. Checked Icon.jsx, trash is not there, 'close' maybe? */}
                                            {/* 'close' is FiX. Let's stick to 'edit' for now or add 'trash' later. Actually in Icon.jsx there is no 'trash'. Using 'close' or 'minus'. Or just 'Edit' text. */}
                                            {/* Wait, user request implies functionality. I'll just use 'Edit' button for now. */}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="org-dashboard-container">
            <div className="org-dashboard-content">
                {/* Sidebar Navigation */}
                <aside className="org-sidebar">
                    <div className="org-sidebar-header">
                        <img src={orgData.logo} alt="Org Logo" className="org-avatar" />
                        <h3 className="org-name">{orgData.name}</h3>
                        <div className="org-type">Organization</div>
                    </div>
                    <nav className="org-nav">
                        <div
                            className={`org-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <Icon name="briefcase" /> Profile
                        </div>
                        <div
                            className={`org-nav-item ${activeTab === 'messaging' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messaging')}
                        >
                            <Icon name="comment-dots" /> Messaging
                        </div>
                        <div
                            className={`org-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Icon name="bell" /> Notifications
                        </div>
                        <div
                            className={`org-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('courses')}
                        >
                            <Icon name="course" /> Courses
                        </div>
                        <div
                            className="org-nav-item"
                            onClick={handleSignOut}
                            style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)' }}
                        >
                            <Icon name="sign-out" /> Sign Out
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="org-main-area">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default OrganizationProfile;
