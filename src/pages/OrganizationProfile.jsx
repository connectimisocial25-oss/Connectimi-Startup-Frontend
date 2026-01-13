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
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: '',
        price: '',
        videoUrl: '',
        requestVerification: false
    });

    const handleAddCourseSubmit = () => {
        const course = {
            id: orgData.courses.length + 1,
            title: newCourse.title,
            students: 0,
            rating: 0,
            revenue: "$0",
            isVerified: newCourse.requestVerification,
            isBoosted: false
        };
        setOrgData({ ...orgData, courses: [...orgData.courses, course] });
        setIsAddCourseModalOpen(false);
        setNewCourse({ title: '', price: '', videoUrl: '', requestVerification: false });
        alert("Course submitted successfully! Verification pending approval.");
    };

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
                            <button className="org-btn-primary" onClick={() => setIsAddCourseModalOpen(true)}>
                                <Icon name="plus" /> Add New Course
                            </button>
                        </div>

                        <div className="org-course-list">
                            {orgData.courses.map(course => (
                                <div key={course.id} className="org-course-item">
                                    <div className="org-course-img">
                                        <div style={{ width: '100%', height: '100%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name="image" size={24} color="#888" />
                                        </div>
                                    </div>
                                    <div className="org-course-info">
                                        <div className="org-course-title">
                                            {course.title}
                                            {course.isVerified && <Icon name="check-circle" size={14} color="#3B82F6" style={{ marginLeft: '6px' }} />}
                                        </div>
                                        <div className="org-course-stats">
                                            <span><Icon name="users" /> {course.students} Students</span>
                                            <span><Icon name="star" /> {course.rating} Rating</span>
                                            <span> Est. Revenue: {course.revenue}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="org-btn-outline" style={{ marginRight: '12px' }}>Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'ads':
                return (
                    <div className="org-section-card">
                        <h2 className="org-section-title" style={{ marginBottom: '20px' }}>Advertising & Revenue</h2>

                        <div className="ads-dashboard-grid">
                            <div className="ads-stat-card">
                                <h3>Total Ad Revenue</h3>
                                <div className="stat-value">$12,450.00</div>
                                <div className="stat-trend positive">+15% this month</div>
                            </div>
                            <div className="ads-stat-card">
                                <h3>Ad Spend</h3>
                                <div className="stat-value">$1,200.00</div>
                                <div className="stat-trend negative">+5% this month</div>
                            </div>
                            <div className="ads-stat-card">
                                <h3>Active Campaigns</h3>
                                <div className="stat-value">3</div>
                            </div>
                        </div>

                        <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Boost Your Courses</h3>
                        <div className="org-course-list">
                            {orgData.courses.map(course => (
                                <div key={course.id} className="org-course-item">
                                    <div className="org-course-info">
                                        <div className="org-course-title">{course.title}</div>
                                        <div className="org-course-stats" style={{ color: 'var(--text-secondary)' }}>
                                            {course.isBoosted ? 'Currently Boosted' : 'Not Boosted'}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            className={`org-btn-primary ${course.isBoosted ? 'secondary' : ''}`}
                                            style={{
                                                backgroundColor: course.isBoosted ? 'var(--bg-secondary)' : 'var(--primary-blue)',
                                                color: course.isBoosted ? 'var(--text-primary)' : 'white'
                                            }}
                                            onClick={() => {
                                                const updatedCourses = orgData.courses.map(c =>
                                                    c.id === course.id ? { ...c, isBoosted: !c.isBoosted } : c
                                                );
                                                setOrgData({ ...orgData, courses: updatedCourses });
                                                alert(course.isBoosted ? "Campaign paused." : "Course boosted successfully! Ad spend initialized.");
                                            }}
                                        >
                                            {course.isBoosted ? 'Pause Campaign' : 'Boost Course'}
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
                            <Icon name="book" /> Courses
                        </div>
                        <div
                            className={`org-nav-item ${activeTab === 'ads' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ads')}
                        >
                            <Icon name="trending-up" /> Ads & Revenue
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

            {/* Add Course Modal */}
            {isAddCourseModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAddCourseModalOpen(false)}>
                    <div className="payment-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="payment-header">
                            <h2>Add New Course</h2>
                            <button className="close-btn" onClick={() => setIsAddCourseModalOpen(false)}><Icon name="close" /></button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Course Title</label>
                                <input type="text" placeholder="e.g. Advanced React Patterns" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input type="number" placeholder="49.99" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Video Preview URL</label>
                                <input type="text" placeholder="https://..." value={newCourse.videoUrl} onChange={(e) => setNewCourse({ ...newCourse, videoUrl: e.target.value })} />
                            </div>

                            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="verification"
                                        checked={newCourse.requestVerification}
                                        onChange={(e) => setNewCourse({ ...newCourse, requestVerification: e.target.checked })}
                                        style={{ width: 'auto', marginRight: '10px' }}
                                    />
                                    <label htmlFor="verification" style={{ margin: 0, fontWeight: '600', color: 'var(--text-primary)' }}>Apply for Connectimi Verification</label>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '24px' }}>
                                    Verified courses get a badge, priority listing, and higher trust.
                                    Subject to review.
                                </p>
                            </div>

                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setIsAddCourseModalOpen(false)}>Cancel</button>
                                <button className="pay-btn-primary" onClick={handleAddCourseSubmit}>Create Course</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationProfile;
