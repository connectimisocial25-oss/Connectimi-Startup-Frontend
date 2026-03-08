import React, { useState } from 'react';
import Icon from '../../components/Icon';
import './OrgPages.css';

const OrgAds = () => {
    const [orgData, setOrgData] = useState({
        courses: [
            { id: 1, title: "Speak with Impact: Master Spoken English for the Modern World", isBoosted: false },
            { id: 2, title: "The Resume Lab: Transform Your Experience into a Job Magnet", isBoosted: false },
            { id: 3, title: "Interview Decoder: Your Blueprint to Cracking Top-Tier Companies", isBoosted: false }
        ]
    });

    return (
        <div className="org-page-container">
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
        </div>
    );
};

export default OrgAds;
