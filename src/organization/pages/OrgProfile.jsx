import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';
import { FaGlobe, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';
import OrgEditForm from '../components/OrgEditForm';
import API from '../../services/api';
import './OrgPages.css';
import './OrgProfile.css';

const OrgProfile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await API.get("/consultant/services/me");
                setServices(res.data.services || []);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        };
        fetchServices();
    }, []);

    // Empty-state fallback for orgs with an incomplete profile
    const defaultData = {
        name: "",
        industry: "",
        email: "",
        location: "",
        website: "",
        about: "",
        profileImage: "https://via.placeholder.com/150",
        bannerImage: "",
        companySize: "",
        foundedDate: "",
        specialties: [],
        services: []
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
        services: services
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
            services: [...services.map(s => ({ ...s }))]
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            // 1. Save profile basic details
            // orgData is derived from `user` on every render, so it updates automatically once updateUser() resolves.
            await updateUser(editData);

            // 2. Sync services list with backend
            const originalServices = services;
            const editedServices = editData.services;

            // Delete removed services
            const toDelete = originalServices.filter(orig => !editedServices.some(ed => ed._id === orig._id));
            for (const s of toDelete) {
                await API.delete(`/consultant/services/${s._id}`);
            }

            // Create or update services
            for (const s of editedServices) {
                const payload = {
                    title: s.title,
                    description: s.description,
                    price: Number(s.price) || 0,
                    category: s.category || "Other"
                };

                if (s._id) {
                    await API.put(`/consultant/services/${s._id}`, payload);
                } else {
                    await API.post("/consultant/services", payload);
                }
            }

            // Reload services
            const res = await API.get("/consultant/services/me");
            setServices(res.data.services || []);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile or services:", error);
            alert(error.response?.data?.error || "Failed to save profile changes. Please try again.");
        }
    };

    return (
        <div className="org-page-container">
            <div className="org-glass-card fade-in">
                <div className="org-banner-hero" style={!orgData.bannerImage ? { background: "var(--bg-color)" } : undefined}>
                    {orgData.bannerImage && <img src={orgData.bannerImage} alt="Banner" className="hero-img" />}
                    <button className="edit-banner-btn" onClick={handleStartEdit}><Icon name="camera" /></button>
                </div>
                <div className="org-profile-header">
                    <img src={orgData.profileImage} alt="Logo" className="org-logo-large" />
                    <div className="org-info-text">
                        <h1>{orgData.name}</h1>
                        {(orgData.industry || orgData.location) && (
                            <p className="org-tagline">
                                {[orgData.industry, orgData.location].filter(Boolean).join(" · ")}
                            </p>
                        )}
                        <div className="org-quick-stats">
                            {orgData.website && (
                                <a href={orgData.website} target="_blank" rel="noopener noreferrer" className="stat-link">
                                    <FaGlobe /> {orgData.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            {orgData.companySize && (
                                <span className="stat-item"><FaUsers /> {orgData.companySize}</span>
                            )}
                            {orgData.foundedDate && (
                                <span className="stat-item"><FaCalendarAlt /> Founded {orgData.foundedDate}</span>
                            )}
                        </div>
                    </div>
                    <button className="profile-btn primary" onClick={handleStartEdit}>Edit Profile</button>
                </div>

                <div className="org-profile-grid">
                    <div className="org-main-content">
                        <div className="org-section-card">
                            <h3>About</h3>
                            <p className="org-about-text">{orgData.about || "No description provided yet."}</p>
                        </div>

                        <div className="org-section-card">
                            <h3>Our Services</h3>
                            {orgData.services.length > 0 ? (
                                <div className="services-list">
                                    {orgData.services.map(service => (
                                        <div key={service.id || service._id} className="service-item" style={{ marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px" }}>
                                            <div className="service-icon"><FaBriefcase /></div>
                                            <div className="service-info" style={{ width: "100%" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <h4 style={{ margin: 0 }}>{service.title}</h4>
                                                    <span style={{ fontSize: "0.85rem", color: "var(--emerald-500)", fontWeight: "600" }}>
                                                        ${service.price} · {service.category}
                                                    </span>
                                                </div>
                                                <p style={{ marginTop: "5px", color: "var(--text-muted)", fontSize: "0.9rem" }}>{service.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-msg">No services listed yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="org-sidebar">
                        <div className="org-section-card">
                            <h3>Specialties</h3>
                            {orgData.specialties.length > 0 ? (
                                <div className="specialties-tags">
                                    {orgData.specialties.map(spec => (
                                        <span key={spec} className="spec-tag">{spec}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-msg">No specialties added yet.</p>
                            )}
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
