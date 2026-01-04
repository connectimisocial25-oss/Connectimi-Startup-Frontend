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
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        salaryRange: 'all',
        location: 'all',
        jobType: 'all',
        experienceLevel: 'all'
    });

    // Mock Data
    const fullTimeJobs = [
        {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'Tech Innovations Ltd',
            location: 'Bangalore, India',
            locationType: 'on-site',
            salaryRange: '100k-200k',
            experienceLevel: 'senior',
            jobType: 'full-time',
            logo: 'https://loremflickr.com/56/56/technology,code?lock=1',
            posted: '2 hours ago',
            applicants: 48
        },
        {
            id: 2,
            title: 'React Native Engineer',
            company: 'Mobile First Solutions',
            location: 'Remote',
            locationType: 'remote',
            salaryRange: '50k-100k',
            experienceLevel: 'mid',
            jobType: 'full-time',
            logo: 'https://loremflickr.com/56/56/mobile,app?lock=2',
            posted: '5 hours ago',
            applicants: 12
        },
        {
            id: 3,
            title: 'Full Stack Engineer (MERN)',
            company: 'Startup Hub',
            location: 'Hyderabad, India',
            locationType: 'hybrid',
            salaryRange: '200k+',
            experienceLevel: 'expert',
            jobType: 'full-time',
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
            location: 'Mumbai, India',
            locationType: 'remote',
            salaryRange: '<50k',
            experienceLevel: 'entry',
            jobType: 'internship',
            logo: 'https://loremflickr.com/56/56/creative,design?lock=4',
            posted: '1 hour ago',
            type: 'Paid',
            duration: '6 months'
        },
        {
            id: 102,
            title: 'Marketing Intern',
            company: 'Growth Hackers',
            location: 'Delhi, India',
            locationType: 'on-site',
            salaryRange: '<50k',
            experienceLevel: 'entry',
            jobType: 'internship',
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
            locationType: 'remote',
            salaryRange: '<50k',
            experienceLevel: 'entry',
            jobType: 'internship',
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
            locationType: 'remote',
            salaryRange: '50k-100k',
            experienceLevel: 'junior',
            jobType: 'freelance',
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
            locationType: 'remote',
            salaryRange: '<50k',
            experienceLevel: 'entry',
            jobType: 'freelance',
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
            locationType: 'remote',
            salaryRange: '100k-200k',
            experienceLevel: 'mid',
            jobType: 'freelance',
            logo: 'https://loremflickr.com/56/56/react,code?lock=9',
            posted: '1 day ago',
            type: 'Freelance',
            budget: '$50/hr',
            duration: 'Ongoing',
            description: 'Optimize existing React components for performance.'
        }
    ];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getFilteredJobs = (jobs) => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesSalary = filters.salaryRange === 'all' || job.salaryRange === filters.salaryRange;
            const matchesLocation = filters.location === 'all' || job.locationType === filters.location;
            const matchesType = filters.jobType === 'all' || job.jobType === filters.jobType;
            const matchesExperience = filters.experienceLevel === 'all' || job.experienceLevel === filters.experienceLevel;

            return matchesSearch && matchesSalary && matchesLocation && matchesType && matchesExperience;
        });
    };

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="navbar-center">
                <div className="nav-item" onClick={() => navigate('/home')}>
                    <div className="nav-icon"><FaHome /></div>
                    <span className="nav-label">Home</span>
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
                <aside className="jobs-sidebar">
                    <div className="filter-card">
                        <h3 className="filter-title">Filters</h3>

                        <div className="filter-group">
                            <label>Salary Range</label>
                            <select name="salaryRange" value={filters.salaryRange} onChange={handleFilterChange}>
                                <option value="all">All Salaries</option>
                                <option value="<50k">&lt; $50k</option>
                                <option value="50k-100k">$50k - $100k</option>
                                <option value="100k-200k">$100k - $200k</option>
                                <option value="200k+">$200k+</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Location</label>
                            <select name="location" value={filters.location} onChange={handleFilterChange}>
                                <option value="all">Any Location</option>
                                <option value="remote">Remote</option>
                                <option value="on-site">On-site</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Job Type</label>
                            <select name="jobType" value={filters.jobType} onChange={handleFilterChange}>
                                <option value="all">Any Type</option>
                                <option value="full-time">Full-time</option>
                                <option value="internship">Internship</option>
                                <option value="freelance">Freelance</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Experience Level</label>
                            <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange}>
                                <option value="all">Any Level</option>
                                <option value="entry">Entry Level</option>
                                <option value="junior">Junior</option>
                                <option value="mid">Mid Level</option>
                                <option value="senior">Senior</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>

                        <button
                            className="reset-filters-btn"
                            onClick={() => setFilters({
                                salaryRange: 'all',
                                location: 'all',
                                jobType: 'all',
                                experienceLevel: 'all'
                            })}
                        >
                            Reset Filters
                        </button>
                    </div>
                </aside>

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
                            getFilteredJobs(fullTimeJobs).length > 0 ? (
                                getFilteredJobs(fullTimeJobs).map(job => (
                                    <div key={job.id} className="job-card">
                                        <img src={job.logo} alt={job.company} className="job-logo" />
                                        <div className="job-details">
                                            <div className="job-title">{job.title}</div>
                                            <div className="job-company">{job.company}</div>
                                            <div className="job-location">{job.location} ({job.locationType})</div>
                                            <div className="job-meta">
                                                <span className="time-posted">{job.posted}</span>
                                                <span>• {job.applicants} applicants</span>
                                                <span className="salary-badge">• {job.salaryRange}</span>
                                            </div>
                                        </div>
                                        <button className="apply-btn">Apply</button>
                                    </div>
                                ))
                            ) : (
                                <div className="no-jobs-message">No full-time jobs match your filters.</div>
                            )
                        )}

                        {activeTab === 'internship' && (
                            // Internships List
                            getFilteredJobs(internships).length > 0 ? (
                                getFilteredJobs(internships).map(job => (
                                    <div key={job.id} className="job-card">
                                        <img src={job.logo} alt={job.company} className="job-logo" />
                                        <div className="job-details">
                                            <div className="job-title">{job.title}</div>
                                            <div className="job-company">{job.company}</div>
                                            <div className="job-location">{job.location} ({job.locationType})</div>

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
                            ) : (
                                <div className="no-jobs-message">No internships match your filters.</div>
                            )
                        )}

                        {activeTab === 'freelancing' && (
                            // Freelancing List
                            getFilteredJobs(freelancingJobs).length > 0 ? (
                                getFilteredJobs(freelancingJobs).map(job => (
                                    <div key={job.id} className="job-card">
                                        <img src={job.logo} alt={job.company} className="job-logo" />
                                        <div className="job-details">
                                            <div className="job-title">{job.title}</div>
                                            <div className="job-company">{job.company}</div>
                                            <div className="job-location">{job.location} ({job.locationType})</div>
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
                            ) : (
                                <div className="no-jobs-message">No freelancing jobs match your filters.</div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
