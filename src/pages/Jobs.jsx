import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaSearch, FaHome, FaUserFriends, FaBriefcase,
    FaCommentDots, FaBell, FaUserCircle, FaCaretDown
} from 'react-icons/fa';
import Connectimi_logo from '../components/Connectimi_logo';
import './Jobs.css';
import './Profile.css'; // Utilizing Navbar styles from Profile

const Jobs = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('fulltime');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Mock Data
    const fullTimeJobs = [
        {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'Tech Innovations Ltd',
            location: 'Bangalore, India (On-site)',
            logo: 'https://loremflickr.com/56/56/technology,code?lock=1',
            posted: '2 hours ago',
            applicants: 48
        },
        {
            id: 2,
            title: 'React Native Engineer',
            company: 'Mobile First Solutions',
            location: 'Remote',
            logo: 'https://loremflickr.com/56/56/mobile,app?lock=2',
            posted: '5 hours ago',
            applicants: 12
        },
        {
            id: 3,
            title: 'Full Stack Engineer (MERN)',
            company: 'Startup Hub',
            location: 'Hyderabad, India (Hybrid)',
            logo: 'https://loremflickr.com/56/56/startup,office?lock=3',
            posted: '1 day ago',
            applicants: 128
        }
    ];

    const internships = [
        {
            id: 101,
            title: 'Web Development Intern',
            company: 'Creative Studio',
            location: 'Mumbai, India (Remote)',
            logo: 'https://loremflickr.com/56/56/creative,design?lock=4',
            posted: '1 hour ago',
            type: 'Paid',
            duration: '6 months'
        },
        {
            id: 102,
            title: 'Marketing Intern',
            company: 'Growth Hackers',
            location: 'Delhi, India (On-site)',
            logo: 'https://loremflickr.com/56/56/marketing,growth?lock=5',
            posted: '3 hours ago',
            type: 'Unpaid',
            duration: '3 months'
        },
        {
            id: 103,
            title: 'UI/UX Design Intern',
            company: 'Designify',
            location: 'Remote',
            logo: 'https://loremflickr.com/56/56/ui,ux?lock=6',
            posted: '4 hours ago',
            type: 'Paid',
            duration: '4 months'
        }
    ];

    const freelancingJobs = [
        {
            id: 201,
            title: 'WordPress Theme Customization',
            company: 'Digital Agency',
            location: 'Remote',
            logo: 'https://loremflickr.com/56/56/wordpress?lock=7',
            posted: '30 mins ago',
            type: 'Freelance',
            budget: '$500',
            duration: '1 week',
            description: 'Need expertise in customizing a premium WP theme.'
        },
        {
            id: 202,
            title: 'Logo Design Project',
            company: 'StartUp Inc',
            location: 'Remote',
            logo: 'https://loremflickr.com/56/56/design,logo?lock=8',
            posted: '4 hours ago',
            type: 'Freelance',
            budget: '$200',
            duration: '3 days',
            description: 'Modern minimalist logo design for a tech startup.'
        },
        {
            id: 203,
            title: 'React Component Optimization',
            company: 'SaaS Corp',
            location: 'Remote',
            logo: 'https://loremflickr.com/56/56/react,code?lock=9',
            posted: '1 day ago',
            type: 'Freelance',
            budget: '$50/hr',
            duration: 'Ongoing',
            description: 'Optimize existing React components for performance.'
        }
    ];

    const Navbar = () => (
        <nav className="navbar">
            <div className="navbar-left">
                <Connectimi_logo />
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search jobs"
                        className="search-input"
                    />
                </div>
            </div>

            <div className="navbar-center">
                <div className="nav-item" onClick={() => navigate('/home')}>
                    <div className="nav-icon"><FaHome /></div>
                    <span className="nav-label">Home</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/mynetwork')}>
                    <div className="nav-icon"><FaUserFriends /></div>
                    <span className="nav-label">My Network</span>
                </div>
                <div className="nav-item active" onClick={() => navigate('/jobs')}>
                    <div className="nav-icon"><FaBriefcase /></div>
                    <span className="nav-label">Jobs</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/messaging')}>
                    <div className="nav-icon"><FaCommentDots /></div>
                    <span className="nav-label">Messaging</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/notifications')}>
                    <div className="nav-icon"><FaBell /></div>
                    <span className="nav-label">Notifications</span>
                </div>

                <div className="nav-item me-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="nav-icon">
                        <img src="https://via.placeholder.com/24" alt="Me" className="nav-profile-img" />
                        <FaCaretDown size={12} />
                    </div>
                    <span className="nav-label">Me</span>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                View Profile
                            </div>
                            <div className="dropdown-item signout-item" onClick={() => navigate('/')}>
                                Sign Out
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );

    return (
        <div className="jobs-container">
            <Navbar />

            <div className="jobs-content">
                <div className="jobs-main">
                    <div className="jobs-tabs">
                        <button
                            className={`jobs-tab ${activeTab === 'fulltime' ? 'active' : ''}`}
                            onClick={() => setActiveTab('fulltime')}
                        >
                            Full Time Jobs
                        </button>
                        <button
                            className={`jobs-tab ${activeTab === 'internship' ? 'active' : ''}`}
                            onClick={() => setActiveTab('internship')}
                        >
                            Internships / Part Time
                        </button>
                        <button
                            className={`jobs-tab ${activeTab === 'freelancing' ? 'active' : ''}`}
                            onClick={() => setActiveTab('freelancing')}
                        >
                            Freelancing
                        </button>
                    </div>

                    <div className="jobs-list">
                        {activeTab === 'fulltime' && (
                            // Full Time Jobs List
                            fullTimeJobs.map(job => (
                                <div key={job.id} className="job-card">
                                    <img src={job.logo} alt={job.company} className="job-logo" />
                                    <div className="job-details">
                                        <div className="job-title">{job.title}</div>
                                        <div className="job-company">{job.company}</div>
                                        <div className="job-location">{job.location}</div>
                                        <div className="job-meta">
                                            <span className="time-posted">{job.posted}</span>
                                            <span>• {job.applicants} applicants</span>
                                        </div>
                                    </div>
                                    <button className="apply-btn">Apply</button>
                                </div>
                            ))
                        )}

                        {activeTab === 'internship' && (
                            // Internships List
                            internships.map(job => (
                                <div key={job.id} className="job-card">
                                    <img src={job.logo} alt={job.company} className="job-logo" />
                                    <div className="job-details">
                                        <div className="job-title">{job.title}</div>
                                        <div className="job-company">{job.company}</div>
                                        <div className="job-location">{job.location}</div>

                                        <div className="job-meta">
                                            <span className={`badge ${job.type === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                                                {job.type}
                                            </span>
                                            <span>• {job.duration}</span>
                                            <span className="time-posted">• {job.posted}</span>
                                        </div>
                                    </div>
                                    <button className="apply-btn">Easy Apply</button>
                                </div>
                            ))
                        )}

                        {activeTab === 'freelancing' && (
                            // Freelancing List
                            freelancingJobs.map(job => (
                                <div key={job.id} className="job-card">
                                    <img src={job.logo} alt={job.company} className="job-logo" />
                                    <div className="job-details">
                                        <div className="job-title">{job.title}</div>
                                        <div className="job-company">{job.company}</div>
                                        <div className="job-location">{job.location}</div>
                                        <div className="job-meta">
                                            <span className="badge badge-paid">{job.budget}</span>
                                            <span>• {job.duration}</span>
                                            <span className="time-posted">• {job.posted}</span>
                                        </div>
                                        <div className="job-description" style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                                            {job.description}
                                        </div>
                                    </div>
                                    <button className="apply-btn">Apply</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
