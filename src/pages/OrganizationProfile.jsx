import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import './OrganizationProfile.css';
import { gsap } from 'gsap';

// Reusing existing components where possible
import Messaging from './Messaging';
import Notifications from './Notifications';
import Feed from '../components/home/Feed';

const OrganizationProfile = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
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
            { id: 1, title: "Speak with Impact: Master Spoken English for the Modern World", students: 1240, rating: 4.8, revenue: "₹49,999", isVerified: true, isBoosted: false },
            { id: 2, title: "The Resume Lab: Transform Your Experience into a Job Magnet", students: 850, rating: 4.9, revenue: "₹14,999", isVerified: true, isBoosted: false },
            { id: 3, title: "Interview Decoder: Your Blueprint to Cracking Top-Tier Companies", students: 1100, rating: 4.7, revenue: "₹34,999", isVerified: true, isBoosted: false }
        ]
    });

    const [imagePreview, setImagePreview] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', price: '', videoUrl: '', requestVerification: false });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".org-sidebar", { x: -50, opacity: 0, duration: 1, ease: "power3.out" });
            gsap.from(".org-main-area", { opacity: 0, duration: 0.8, delay: 0.2 });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setOrgData(prev => ({ ...prev, logo: previewUrl }));
    };

    const handleAddCourseSubmit = () => {
        const course = {
            id: orgData.courses.length + 1,
            title: newCourse.title,
            students: 0,
            rating: 0,
            revenue: "₹0",
            isVerified: newCourse.requestVerification,
            isBoosted: false
        };
        setOrgData({ ...orgData, courses: [...orgData.courses, course] });
        setIsAddCourseModalOpen(false);
        setNewCourse({ title: '', price: '', videoUrl: '', requestVerification: false });
    };

    const renderFeed = () => (
        <div className="org-glass-card fade-in">
            <Feed />
        </div>
    );

    const renderProfile = () => (
        <div className="org-glass-card fade-in">
            <div className="org-banner-hero">
                <img src={bannerPreview || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"} alt="Banner" className="hero-img" />
                <button className="edit-banner-btn" onClick={() => setIsEditing(true)}><Icon name="camera" /></button>
            </div>
            <div className="org-profile-header">
                <img src={orgData.logo} alt="Logo" className="org-logo-large" />
                <div className="org-info-text">
                    <h1>{orgData.name}</h1>
                    <p className="org-tagline">{orgData.type} · {orgData.location}</p>
                </div>
                <button className="profile-btn primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
            <div className="org-about-panel">
                <h3>About</h3>
                <p>{orgData.description}</p>
            </div>
        </div>
    );

    const renderCourses = () => (
        <div className="org-glass-card fade-in">
            <div className="section-header-flex">
                <h2>Course Catalog</h2>
                <button className="profile-btn primary" onClick={() => setIsAddCourseModalOpen(true)}>
                    <Icon name="plus" /> New Course
                </button>
            </div>
            <div className="course-grid-modern">
                {orgData.courses.map(course => (
                    <div key={course.id} className="course-item-glass">
                        <div className="course-icon-box"><Icon name="book" size={24} /></div>
                        <div className="course-details">
                            <h4>{course.title} {course.isVerified && <Icon name="check-circle" size={14} color="var(--primary-emerald)" />}</h4>
                            <div className="course-stats-row">
                                <span><Icon name="users" size={12} /> {course.students}</span>
                                <span><Icon name="star" size={12} /> {course.rating}</span>
                                <span className="revenue-tag">{course.revenue}</span>
                            </div>
                        </div>
                        <button className="course-action-btn">Manage</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAds = () => (
        <div className="org-glass-card fade-in">
            <div className="section-header-flex">
                <h2>Ads & Revenue</h2>
                <button className="profile-btn">Reports</button>
            </div>
            <div className="ads-dashboard-grid">
                <div className="ads-stat-card-modern">
                    <span className="label">Total Revenue</span>
                    <div className="value">₹1,12,450.00</div>
                    <div className="trend positive"><Icon name="arrow-up" /> 15%</div>
                </div>
                <div className="ads-stat-card-modern">
                    <span className="label">Ad Spend</span>
                    <div className="value">₹12,200.00</div>
                    <div className="trend"><Icon name="arrow-up" /> 5%</div>
                </div>
            </div>
            <div className="campaigns-section">
                <h3>Active Campaigns</h3>
                {orgData.courses.map(course => (
                    <div key={course.id} className="campaign-row">
                        <span>{course.title}</span>
                        <button
                            className={`toggle-btn ${course.isBoosted ? 'active' : ''}`}
                            onClick={() => {
                                const updated = orgData.courses.map(c => c.id === course.id ? { ...c, isBoosted: !c.isBoosted } : c);
                                setOrgData({ ...orgData, courses: updated });
                            }}
                        >
                            {course.isBoosted ? 'Active' : 'Boost Now'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'feed': return renderFeed();
            case 'profile': return renderProfile();
            case 'messaging': return <div className="org-glass-card full-height"><Messaging embedded={true} /></div>;
            case 'notifications': return <div className="org-glass-card full-height"><Notifications embedded={true} /></div>;
            case 'courses': return renderCourses();
            case 'ads': return renderAds();
            default: return null;
        }
    };

    return (
        <div className="org-dashboard-container" ref={containerRef}>
            <aside className="org-sidebar-modern">
                <div className="sidebar-brand">
                    <img src={orgData.logo} alt="Logo" className="sidebar-logo" />
                    <div className="brand-text">
                        <h4>{orgData.name}</h4>
                        <span>Organization</span>
                    </div>
                </div>
                <nav className="org-nav-modern">
                    {[
                        { id: 'feed', icon: 'home', label: 'Feed' },
                        { id: 'profile', icon: 'briefcase', label: 'Profile' },
                        { id: 'messaging', icon: 'comment-dots', label: 'Messages' },
                        { id: 'notifications', icon: 'bell', label: 'Alerts' },
                        { id: 'courses', icon: 'book', label: 'Courses' },
                        { id: 'ads', icon: 'trending-up', label: 'Ads' }
                    ].map(tab => (
                        <div
                            key={tab.id}
                            className={`nav-item-modern ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon name={tab.icon} />
                            <span>{tab.label}</span>
                        </div>
                    ))}
                    <div className="nav-item-modern logout" onClick={() => navigate('/')}>
                        <Icon name="sign-out" />
                        <span>Sign Out</span>
                    </div>
                </nav>
            </aside>

            <main className="org-main-area-modern">
                {renderContent()}
            </main>

            {isAddCourseModalOpen && (
                <div className="modal-overlay-modern" onClick={() => setIsAddCourseModalOpen(false)}>
                    <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
                        <h2>Add New Course</h2>
                        <div className="form-group-modern">
                            <label>Course Title</label>
                            <input type="text" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />
                        </div>
                        <div className="modal-actions">
                            <button className="profile-btn" onClick={() => setIsAddCourseModalOpen(false)}>Cancel</button>
                            <button className="profile-btn primary" onClick={handleAddCourseSubmit}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationProfile;
