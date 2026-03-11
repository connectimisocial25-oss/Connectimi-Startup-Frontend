import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { FaChartLine, FaBullhorn, FaWallet, FaArrowUp, FaArrowDown, FaPlus, FaEllipsisV } from 'react-icons/fa';
import './OrgPages.css';
import './OrgAds.css';

const OrgAds = () => {
    const [courses, setCourses] = useState([
        { id: 1, title: "Speak with Impact: Master Spoken English for the Modern World", isBoosted: true, impressions: "12.4k", clicks: 842, ctr: "6.8%", spent: "₹4,200", status: "Active" },
        { id: 2, title: "The Resume Lab: Transform Your Experience into a Job Magnet", isBoosted: false, impressions: "0", clicks: 0, ctr: "0%", spent: "₹0", status: "Paused" },
        { id: 3, title: "Interview Decoder: Your Blueprint to Cracking Top-Tier Companies", isBoosted: true, impressions: "8.1k", clicks: 512, ctr: "6.3%", spent: "₹2,800", status: "Active" }
    ]);

    const stats = [
        { label: "Total Revenue", value: "₹1,12,450.00", trend: "+15%", icon: <FaWallet />, positive: true },
        { label: "Active Campaigns", value: "2", trend: "Stable", icon: <FaBullhorn />, positive: true },
        { label: "Total Reach", value: "20.5k", trend: "+22%", icon: <FaChartLine />, positive: true },
        { label: "Ad Spend", value: "₹12,200.00", trend: "+5%", icon: <FaPlus />, positive: false }
    ];

    const toggleBoost = (id) => {
        setCourses(courses.map(c =>
            c.id === id ? { ...c, isBoosted: !c.isBoosted, status: !c.isBoosted ? "Active" : "Paused" } : c
        ));
    };

    return (
        <div className="org-page-container">
            <div className="org-ads-header fade-in">
                <div className="header-text">
                    <h1>Ads & Revenue Dashboard</h1>
                    <p>Track your campaign performance and revenue growth</p>
                </div>
                <div className="header-actions">
                    <button className="profile-btn secondary">Download Reports</button>
                    <button className="profile-btn primary"><FaPlus /> Create New Campaign</button>
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

                <div className="campaign-table-container">
                    <table className="campaign-table">
                        <thead>
                            <tr>
                                <th>COURSE TITLE</th>
                                <th>STATUS</th>
                                <th>IMPRESSIONS</th>
                                <th>CLICKS</th>
                                <th>CTR</th>
                                <th>SPENT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>
                                        <div className="course-name-cell">
                                            <div className="course-thumb"></div>
                                            <span>{course.title}</span>
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
                                            onClick={() => toggleBoost(course.id)}
                                        >
                                            {course.isBoosted ? 'Stop Boost' : 'Boost Now'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
        </div>
    );
};

export default OrgAds;
