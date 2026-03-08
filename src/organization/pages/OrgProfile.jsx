import React, { useState } from 'react';
import Icon from '../../components/Icon';
import './OrgPages.css';

const OrgProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [orgData, setOrgData] = useState({
        name: "TechCorp Inc.",
        type: "Software Company",
        email: "contact@techcorp.com",
        location: "San Francisco, CA",
        website: "https://techcorp.com",
        description: "Leading innovator in enterprise software solutions and cloud computing. We empower businesses to build better futures through technology.",
        logo: "https://via.placeholder.com/150",
        bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    });

    return (
        <div className="org-page-container">
            <div className="org-glass-card fade-in">
                <div className="org-banner-hero">
                    <img src={orgData.bannerImage} alt="Banner" className="hero-img" />
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
        </div>
    );
};

export default OrgProfile;
