import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import './OrganizationProfile.css';

// Reusing existing components where possible or creating compact versions
import Messaging from './Messaging';
import Notifications from './Notifications';
import Feed from '../components/home/Feed';

const OrganizationProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('feed');
    const [orgData, setOrgData] = useState({
        name: "TechCorp Inc.",
        type: "Software Company",
        email: "contact@techcorp.com",
        location: "San Francisco, CA",
        website: "https://techcorp.com",
        description: "Leading innovator in enterprise software solutions and cloud computing. We empower businesses to build better futures through technology.",
        logo: "https://via.placeholder.com/150",
        courses: [
            { id: 1, title: "React for Enterprise", students: 1240, rating: 4.8, revenue: "$12,400", isVerified: true },
            { id: 2, title: "Advancing Cloud Security", students: 850, rating: 4.9, revenue: "$8,500", isVerified: true }
        ]
    });

    // Image Upload State
    const [imagePreview, setImagePreview] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: '',
        price: '',
        videoUrl: '',
        requestVerification: false
    });

    // Clean up previews on unmount
    React.useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        };
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (imagePreview) URL.revokeObjectURL(imagePreview);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setOrgData(prev => ({ ...prev, logo: previewUrl }));
    };

    const handleBannerUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        const previewUrl = URL.createObjectURL(file);
        setBannerPreview(previewUrl);
        // Note: orgData currently uses hardcoded banner in JSX, ideally should be in state
        // For now we will rely on bannerPreview in render
    };

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
            case 'feed':
                return (
                    <div className="org-section-card profile-card-polished" style={{ height: 'calc(100vh - 120px)', padding: 20, overflow: 'auto' }}>
                        <Feed />
                    </div>
                );
            case 'profile':
                return (
                    <div className="org-section-card profile-card-polished" style={{ height: 'calc(100vh - 120px)', padding: 0, overflow: 'auto' }}>
                        {/* Banner Image */}
                        <div className="org-banner-container">
                            <img
                                src={isEditing && bannerPreview ? bannerPreview : "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"}
                                alt="Cover"
                                className="org-banner-img"
                            />
                            {isEditing && (
                                <div className="org-banner-upload">
                                    <label htmlFor="org-banner-upload" className="org-upload-btn">
                                        <Icon name="camera" /> Change Banner
                                    </label>
                                    <input
                                        id="org-banner-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerUpload}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="org-profile-header-content">
                                <div className="org-section-header no-border">
                                    <div style={{ flex: 1 }}>{/* Spacer */}</div>
                                    <button className="org-btn-primary" onClick={() => setIsEditing(!isEditing)}>
                                        <Icon name="save" />
                                        Save Changes
                                    </button>
                                </div>

                                <div className="org-form-grid">
                                    <div className="org-logo-upload-section" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                                        <div className="org-avatar-edit-wrapper">
                                            <img
                                                src={imagePreview || orgData.logo}
                                                alt="Current Logo"
                                                className="org-avatar-large"
                                                style={{ marginTop: 0 }}
                                            />
                                            <label htmlFor="org-logo-upload" className="org-upload-btn small">
                                                <Icon name="camera" /> Change Photo
                                            </label>
                                            <input
                                                id="org-logo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </div>

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
                            </div>
                        ) : (
                            <div className="org-profile-content-container">
                                <div className="org-profile-left">
                                    <img
                                        src={orgData.logo}
                                        alt="Logo"
                                        className="org-avatar-large"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=TC&background=0D8ABC&color=fff&size=150' }}
                                    />
                                    <div className="org-about-section">
                                        <h3 className="org-about-title">About</h3>
                                        <p className="org-about-text">{orgData.description}</p>
                                    </div>
                                </div>

                                <div className="org-profile-right">
                                    <div className="org-section-header no-border" style={{ marginBottom: '8px' }}>
                                        <div style={{ flex: 1 }}>{/* Spacer */}</div>
                                        <button className="org-btn-primary" onClick={() => setIsEditing(!isEditing)}>
                                            <Icon name="edit" />
                                            Edit Profile
                                        </button>
                                    </div>
                                    <h1 className="org-profile-name">
                                        {orgData.name}
                                    </h1>
                                    <div className="org-profile-type">{orgData.type}</div>

                                    <div className="org-profile-meta">
                                        <span className="icon-text"><Icon name="map-marker" /> {orgData.location}</span>
                                        <span className="icon-text"><Icon name="globe" /> <a href={orgData.website} target="_blank" rel="noopener noreferrer" className="org-website-link">{orgData.website}</a></span>
                                        <span className="icon-text"><Icon name="users" /> 12,500 Followers</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'messaging':
                return (
                    <div className="org-section-card" style={{ height: 'calc(100vh - 120px)', padding: 0, overflow: 'hidden' }}>
                        <Messaging embedded={true} />
                    </div>
                );
            case 'notifications':
                return (
                    <div className="org-section-card profile-card-polished" style={{ height: 'calc(100vh - 120px)', padding: 0, overflow: 'auto' }}>
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
                                        <Icon name="image" size={32} color="#9ca3af" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="org-course-title">
                                            {course.title}
                                            {course.isVerified && <Icon name="check-circle" size={16} color="#0a66c2" style={{ marginLeft: '6px' }} />}
                                        </div>
                                        <div className="org-course-stats">
                                            <span><Icon name="users" size={14} /> {course.students} Students</span>
                                            <span><Icon name="star" size={14} /> {course.rating} Rating</span>
                                            <span>Est. Revenue: {course.revenue}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button className="org-btn-outline">Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'ads':
                return (
                    <div className="org-section-card profile-card-polished" style={{ height: 'calc(100vh - 120px)', padding: 0, overflow: 'hidden' }}>
                        <div className="org-profile-content-container">
                            <div className="org-profile-right">
                                <div className="org-section-header">
                                    <h2 className="org-section-title">Advertising & Revenue</h2>
                                    <button className="org-btn-outline">Download Report</button>
                                </div>
                                <div className="ads-dashboard-grid">
                                    <div className="ads-stat-card">
                                        <h3>Total Ad Revenue</h3>
                                        <div className="stat-value">$12,450.00</div>
                                        <div className="stat-trend positive">
                                            <Icon name="arrow-up" size={12} /> 15% this month
                                        </div>
                                    </div>
                                    <div className="ads-stat-card">
                                        <h3>Ad Spend</h3>
                                        <div className="stat-value">$1,200.00</div>
                                        <div className="stat-trend negative">
                                            <Icon name="arrow-up" size={12} /> 5% this month
                                        </div>
                                    </div>
                                    <div className="ads-stat-card">
                                        <h3>Active Campaigns</h3>
                                        <div className="stat-value">3</div>
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '16px', color: '#191919' }}>Boost Your Courses</h3>
                                <div className="org-course-list">
                                    {orgData.courses.map(course => (
                                        <div key={course.id} className="org-course-item">
                                            <div style={{ flex: 1 }}>
                                                <div className="org-course-title">{course.title}</div>
                                                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                                    {course.isBoosted ? 'Currently Boosted' : 'Not Boosted'}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <button
                                                    className={`org-btn-primary ${course.isBoosted ? 'secondary' : ''}`}
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
                        <img src={orgData.logo} alt="Org Logo" className="org-avatar" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=TC&background=0a66c2&color=fff&size=150' }} />
                        <h3 className="org-name">{orgData.name}</h3>
                        <div className="org-type">Organization</div>
                    </div>
                    <nav className="org-nav">
                        <div
                            className={`org-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('feed')}
                        >
                            <Icon name="home" /> Home
                        </div>
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
                            style={{ marginTop: 'auto', borderTop: '1px solid #e0e0e0', borderRadius: '0' }}
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
                <div className="org-modal-overlay" onClick={() => setIsAddCourseModalOpen(false)}>
                    <div className="org-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', background: 'white' }}>
                        <div className="org-section-header" style={{ padding: '24px', marginBottom: 0 }}>
                            <h2 className="org-section-title">Add New Course</h2>
                            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setIsAddCourseModalOpen(false)}><Icon name="close" /></button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div className="org-form-group">
                                <label>Course Title</label>
                                <input type="text" placeholder="e.g. Advanced React Patterns" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
                            </div>
                            <div className="org-form-group">
                                <label>Price ($)</label>
                                <input type="number" placeholder="49.99" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })} />
                            </div>
                            <div className="org-form-group">
                                <label>Video Preview URL</label>
                                <input type="text" placeholder="https://..." value={newCourse.videoUrl} onChange={(e) => setNewCourse({ ...newCourse, videoUrl: e.target.value })} />
                            </div>

                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '4px', marginTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="verification"
                                        checked={newCourse.requestVerification}
                                        onChange={(e) => setNewCourse({ ...newCourse, requestVerification: e.target.checked })}
                                        style={{ width: 'auto', marginRight: '10px' }}
                                    />
                                    <label htmlFor="verification" style={{ margin: 0, fontWeight: '600', color: '#191919' }}>Apply for Connectimi Verification</label>
                                </div>
                                <p style={{ fontSize: '13px', color: '#666', marginLeft: '24px', lineHeight: '1.5' }}>
                                    Verified courses get a badge, priority listing, and higher trust.
                                    Subject to review.
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button className="org-btn-outline" onClick={() => setIsAddCourseModalOpen(false)}>Cancel</button>
                                <button className="org-btn-primary" onClick={handleAddCourseSubmit}>Create Course</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationProfile;
