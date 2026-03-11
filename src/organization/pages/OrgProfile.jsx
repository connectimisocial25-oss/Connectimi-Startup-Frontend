import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';
import { FaGlobe, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';
import OrgEditForm from '../components/OrgEditForm';
import './OrgPages.css';
import './OrgProfile.css';

const OrgProfile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    // Initial dummy data as fallback
    const defaultData = {
        name: "TechCorp Inc.",
        industry: "Software Company",
        email: "contact@techcorp.com",
        location: "San Francisco, CA",
        website: "https://techcorp.com",
        about: "Leading innovator in enterprise software solutions and cloud computing. We empower businesses to build better futures through technology.",
        profileImage: "https://via.placeholder.com/150",
        bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        companySize: "501-1000 employees",
        foundedDate: "2010",
        specialties: ["Cloud Computing", "Enterprise Software", "AI"],
        services: [
            { id: 1, title: "Cloud Infrastructure", description: "Scalable cloud solutions for modern businesses." },
            { id: 2, title: "AI Integration", description: "Bring the power of AI to your existing workflows." }
        ]
    };

    const orgData = {
        name: user?.name || user?.firstName || defaultData.name,
        industry: user?.industry || defaultData.industry,
        location: user?.location || defaultData.location,
        website: user?.website || defaultData.website,
        about: user?.about || defaultData.about,
        profileImage: user?.profileImage || defaultData.profileImage,
        bannerImage: user?.bannerImage || defaultData.bannerImage,
        companySize: user?.companySize || defaultData.companySize,
        foundedDate: user?.foundedDate || defaultData.foundedDate,
        specialties: user?.specialties || defaultData.specialties,
        services: user?.services || defaultData.services
    };

    const handleStartEdit = () => {
        setEditData({
            name: orgData.name,
            industry: orgData.industry,
            location: orgData.location,
            website: orgData.website,
            about: orgData.about,
            companySize: orgData.companySize,
            foundedDate: orgData.foundedDate,
            profileImage: orgData.profileImage,
            bannerImage: orgData.bannerImage,
            specialties: [...orgData.specialties],
            services: [...orgData.services.map(s => ({ ...s }))]
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await updateUser(editData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    return (
        <div className="org-page-container">
            <div className="org-glass-card fade-in">
                <div className="org-banner-hero">
                    <img src={orgData.bannerImage} alt="Banner" className="hero-img" />
                    <button className="edit-banner-btn" onClick={handleStartEdit}><Icon name="camera" /></button>
                </div>
                <div className="org-profile-header">
                    <img src={orgData.profileImage} alt="Logo" className="org-logo-large" />
                    <div className="org-info-text">
                        <h1>{orgData.name}</h1>
                        <p className="org-tagline">{orgData.industry} · {orgData.location}</p>
                        <div className="org-quick-stats">
                            {orgData.website && (
                                <a href={orgData.website} target="_blank" rel="noopener noreferrer" className="stat-link">
                                    <FaGlobe /> {orgData.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            <span className="stat-item"><FaUsers /> {orgData.companySize}</span>
                            <span className="stat-item"><FaCalendarAlt /> Founded {orgData.foundedDate}</span>
                        </div>
                    </div>
                    <button className="profile-btn primary" onClick={handleStartEdit}>Edit Profile</button>
                </div>

                <div className="org-profile-grid">
                    <div className="org-main-content">
                        <div className="org-section-card">
                            <h3>About</h3>
                            <p className="org-about-text">{orgData.about}</p>
                        </div>

                        <div className="org-section-card">
                            <h3>Our Services</h3>
                            <div className="services-list">
                                {orgData.services.map(service => (
                                    <div key={service.id} className="service-item">
                                        <div className="service-icon"><FaBriefcase /></div>
                                        <div className="service-info">
                                            <h4>{service.title}</h4>
                                            <p>{service.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="org-sidebar">
                        <div className="org-section-card">
                            <h3>Specialties</h3>
                            <div className="specialties-tags">
                                {orgData.specialties.map(spec => (
                                    <span key={spec} className="spec-tag">{spec}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <OrgEditForm
                    editData={editData}
                    setEditData={setEditData}
                    handleSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </div>
    );
};

export default OrgProfile;
