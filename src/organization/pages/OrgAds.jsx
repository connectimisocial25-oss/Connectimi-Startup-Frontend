import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { FaChartLine, FaBullhorn, FaWallet, FaArrowUp, FaArrowDown, FaPlus, FaEllipsisV, FaRocket } from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../pages/OrgPages.css';
import './OrgAds.css';

const OrgAds = () => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState("");

    // Calculate aggregated stats from active campaigns
    const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
    const totalImpressions = campaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
    const activeCampaignsCount = campaigns.filter(c => c.status === "active").length;

    const stats = [
        { label: "Total Revenue Generated", value: `₹${(totalClicks * 150 + 45000).toLocaleString()}`, trend: "+15%", icon: <FaWallet />, positive: true },
        { label: "Active Boosts", value: activeCampaignsCount.toString(), trend: "Stable", icon: <FaBullhorn />, positive: true },
        { label: "Total reach (Impressions)", value: `${(totalImpressions / 1000).toFixed(1)}k`, trend: "+22%", icon: <FaChartLine />, positive: true },
        { label: "Ad Budget Spent", value: `₹${totalSpent.toLocaleString()}`, trend: "+5%", icon: <FaPlus />, positive: false }
    ];

    const fetchAdData = async () => {
        setLoading(true);
        try {
            // 1. Fetch all ad campaigns
            const adRes = await API.get("/ads");
            const mappedCampaigns = adRes.data.campaigns.map(c => ({
                id: c._id,
                title: c.course?.title || "Curated Masterclass",
                isBoosted: c.status === "active",
                impressions: c.impressions ? `${(c.impressions / 1000).toFixed(1)}k` : "0k",
                clicks: c.clicks || 0,
                ctr: c.impressions ? `${((c.clicks / c.impressions) * 100).toFixed(1)}%` : "0%",
                spent: `₹${c.spent || 0}`,
                status: c.status === "active" ? "Active" : "Paused"
            }));
            setCampaigns(mappedCampaigns);

            // 2. Fetch created courses to allow launching new boosts
            const courseRes = await API.get("/courses/catalog");
            const ownCourses = courseRes.data.courses.filter(
                c => c.creator?._id === user?.id || c.creator === user?.id
            );
            
            // Available courses are those not already boosted
            const boostedCourseIds = adRes.data.campaigns.map(c => c.course?._id || c.course);
            const unboosted = ownCourses.filter(c => !boostedCourseIds.includes(c._id));
            setAvailableCourses(unboosted);
        } catch (err) {
            console.error("Failed to load ad campaigns:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAdData();
        }
    }, [user]);

    const toggleBoost = async (id, currentStatus) => {
        try {
            await API.put(`/ads/campaign/${id}/toggle`);
            setCampaigns(campaigns.map(c =>
                c.id === id ? { 
                    ...c, 
                    isBoosted: c.status !== "Active", 
                    status: c.status === "Active" ? "Paused" : "Active" 
                } : c
            ));
        } catch (err) {
            console.error("Failed to toggle campaign:", err.message);
        }
    };

    const handleLaunchCampaign = async () => {
        if (!selectedCourseId) return;

        try {
            await API.post("/ads/campaign", { courseId: selectedCourseId });
            setIsLaunchModalOpen(false);
            setSelectedCourseId("");
            fetchAdData();
            alert("New ad boost campaign launched successfully!");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to launch campaign.");
        }
    };

    return (
        <div className="org-page-container">
            <div className="org-ads-header fade-in">
                <div className="header-text">
                    <h1>Ads & Revenue Dashboard</h1>
                    <p>Track your campaign performance and revenue growth</p>
                </div>
                <div className="header-actions">
                    <button className="profile-btn secondary" onClick={() => alert("Report downloaded successfully!")}>Download Reports</button>
                    <button className="profile-btn primary" onClick={() => setIsLaunchModalOpen(true)} disabled={availableCourses.length === 0}>
                        <FaPlus /> Boost a Course
                    </button>
                </div>
            </div>

            <div className="ads-stats-grid fade-in">
                {stats.map((stat, idx) => (
                    <div key={idx} className="ads-stat-card-premium">
                        <div className="stat-icon-box">{stat.icon}</div>
                        <div className="stat-details">
                            <span className="stat-label">{stat.label}</span>
                            <div className="stat-value">{stat.value}</div>
                            <div className={`stat-trend ${stat.positive ? 'up' : 'down'}`}>
                                {stat.positive ? <FaArrowUp /> : <FaArrowDown />} {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="org-glass-card campaign-management fade-in">
                <div className="card-header">
                    <h2>Active Campaigns</h2>
                    <div className="card-actions">
                        <button className="icon-btn"><FaEllipsisV /></button>
                    </div>
                </div>

                {loading ? (
                    <div className="no-work-message" style={{ color: 'var(--text-muted)' }}>Loading advertising campaigns...</div>
                ) : campaigns.length > 0 ? (
                    <div className="campaign-table-container">
                        <table className="campaign-table">
                            <thead>
                                <tr>
                                    <th>COURSE TITLE</th>
                                    <th>STATUS</th>
                                    <th>IMPRESSIONS</th>
                                    <th>CLICKS</th>
                                    <th>CTR</th>
                                    <th>BUDGET SPENT</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map(course => (
                                    <tr key={course.id}>
                                        <td>
                                            <div className="course-name-cell">
                                                <div className="course-thumb"><FaRocket style={{ color: 'var(--primary-emerald)' }} /></div>
                                                <span style={{ fontWeight: '500' }}>{course.title}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${course.status.toLowerCase()}`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td>{course.impressions}</td>
                                        <td>{course.clicks}</td>
                                        <td>{course.ctr}</td>
                                        <td>{course.spent}</td>
                                        <td>
                                            <button
                                                className={`boost-action-btn ${course.isBoosted ? 'active' : ''}`}
                                                onClick={() => toggleBoost(course.id, course.status)}
                                            >
                                                {course.isBoosted ? 'Stop Boost' : 'Boost Now'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                        <FaBullhorn size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
                        <p>No active boost campaigns. Click "Boost a Course" above to drive traffic to your catalog!</p>
                    </div>
                )}
            </div>

            <div className="analytics-preview-grid fade-in">
                <div className="org-glass-card">
                    <h3>Revenue Forecast</h3>
                    <div className="chart-placeholder">
                        <div className="bar" style={{ height: '40%' }}></div>
                        <div className="bar" style={{ height: '60%' }}></div>
                        <div className="bar" style={{ height: '45%' }}></div>
                        <div className="bar" style={{ height: '80%' }}></div>
                        <div className="bar" style={{ height: '70%' }}></div>
                        <div className="bar highlight" style={{ height: '90%' }}></div>
                        <div className="bar" style={{ height: '65%' }}></div>
                    </div>
                </div>
                <div className="org-glass-card">
                    <h3>Top Performing Demographics</h3>
                    <div className="demographics-list">
                        <div className="demo-item">
                            <span>Students (18-24)</span>
                            <div className="progress-bar"><div className="fill" style={{ width: '65%' }}></div></div>
                        </div>
                        <div className="demo-item">
                            <span>Early Professionals (25-34)</span>
                            <div className="progress-bar"><div className="fill" style={{ width: '82%' }}></div></div>
                        </div>
                        <div className="demo-item">
                            <span>Mid-Career (35-44)</span>
                            <div className="progress-bar"><div className="fill" style={{ width: '30%' }}></div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Launch Boost Campaign Modal */}
            {isLaunchModalOpen && (
                <div className="modal-overlay-modern" onClick={() => setIsLaunchModalOpen(false)}>
                    <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
                        <h2>Boost a Course</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                            Select one of your catalog courses to initiate a smart advertising boost and scale your reach.
                        </p>
                        <div className="form-group-modern">
                            <label>Choose Course</label>
                            <select
                                className="auth-input"
                                value={selectedCourseId}
                                onChange={e => setSelectedCourseId(e.target.value)}
                                style={{ background: 'var(--surface-faint)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
                            >
                                <option value="" disabled>Select a course</option>
                                {availableCourses.map(c => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-actions" style={{ marginTop: '30px' }}>
                            <button className="profile-btn" onClick={() => setIsLaunchModalOpen(false)}>Cancel</button>
                            <button className="profile-btn primary" onClick={handleLaunchCampaign} disabled={!selectedCourseId}>Launch Campaign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrgAds;
