import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Connectimi_logo from '../components/Connectimi_logo';
import './Work.css';
import './Profile.css'; // Utilizing Navbar styles from Profile

const Work = () => {
    const navigate = useNavigate();
    const { theme } = useTheme(); // toggleTheme only used in Navbar
    const [activeTab, setActiveTab] = useState('fulltime');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: 'all',
        jobType: 'all',
        experienceLevel: 'all'
    });

    const fullTimeWork = [
        {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'Tech Innovations Ltd',
            location: 'Bangalore, India',
            locationType: 'on-site',
            salaryRange: '100k-200k',
            experienceLevel: '5_plus_years',
            requiredExperience: '5+ Years Experience',
            jobType: 'Full-time',
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
            experienceLevel: '2_5_years',
            requiredExperience: '3+ Years Experience',
            jobType: 'Full-time',
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
            experienceLevel: '5_plus_years',
            requiredExperience: '7+ Years Experience',
            jobType: 'Full-time',
            logo: 'https://loremflickr.com/56/56/startup,office?lock=3',
            posted: '1 day ago',
            applicants: 128
        },
        {
            id: 4,
            title: 'Principal Software Architect',
            company: 'Global Tech Corp',
            location: 'Remote',
            locationType: 'remote',
            salaryRange: '300k+',
            experienceLevel: '10_plus_years',
            requiredExperience: '10+ Years Experience',
            jobType: 'Full-time',
            logo: 'https://loremflickr.com/56/56/architecture,server?lock=10',
            posted: '1 day ago',
            applicants: 25
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
            experienceLevel: 'freshers',
            requiredExperience: 'No Experience Required',
            jobType: 'Internship',
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
            experienceLevel: 'freshers',
            requiredExperience: 'No Experience Required',
            jobType: 'Internship',
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
            experienceLevel: 'freshers',
            requiredExperience: 'No Experience Required',
            jobType: 'Internship',
            logo: 'https://loremflickr.com/56/56/ui,ux?lock=6',
            posted: '4 hours ago',
            type: 'Paid',
            duration: '4 months'
        }
    ];

    const freelancingWork = [
        {
            id: 201,
            title: 'WordPress Theme Customization',
            company: 'Digital Agency',
            location: 'Remote',
            locationType: 'remote',
            salaryRange: '50k-100k',
            experienceLevel: '1_year',
            requiredExperience: '1+ Years Experience',
            jobType: 'Freelance',
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
            experienceLevel: 'freshers',
            requiredExperience: 'No Experience Required',
            jobType: 'Freelance',
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
            experienceLevel: '2_5_years',
            requiredExperience: '3+ Years Experience',
            jobType: 'Freelance',
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

    const getFilteredWork = (workItems) => {
        return workItems.filter(workItem => {
            const matchesSearch = workItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                workItem.company.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesLocation = filters.location === 'all' || workItem.locationType === filters.location;
            const matchesType = filters.jobType === 'all' || workItem.jobType === filters.jobType;
            const matchesExperience = filters.experienceLevel === 'all' || workItem.experienceLevel === filters.experienceLevel;

            return matchesSearch && matchesLocation && matchesType && matchesExperience;
        });
    };



    return (
        <div className="work-container">

            <div className="work-content">
                <aside className="work-sidebar">
                    <div className="filter-card">
                        <div className="search-container" style={{ marginBottom: '16px' }}>
                            <div className="search-bar" style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                                <Icon name="search" className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search work"
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        <h3 className="filter-title">Filters</h3>


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
                            <label>Work Type</label>
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
                                <option value="freshers">Entry Level (Freshers)</option>
                                <option value="1_year">1+ Year</option>
                                <option value="2_5_years">2–5 Years</option>
                                <option value="5_plus_years">5+ Years</option>
                                <option value="10_plus_years">10+ Years</option>
                            </select>
                        </div>

                        <button
                            className="reset-filters-btn"
                            onClick={() => setFilters({
                                location: 'all',
                                jobType: 'all',
                                experienceLevel: 'all'
                            })}
                        >
                            Reset Filters
                        </button>
                    </div>
                </aside>

                <div className="work-main">
                    <div className="work-tabs">
                        <button
                            className={`work-tab ${activeTab === 'fulltime' ? 'active' : ''}`}
                            onClick={() => setActiveTab('fulltime')}
                        >
                            Full Time Work
                        </button>
                        <button
                            className={`work-tab ${activeTab === 'internship' ? 'active' : ''}`}
                            onClick={() => setActiveTab('internship')}
                        >
                            Internships / Part Time
                        </button>
                        <button
                            className={`work-tab ${activeTab === 'freelancing' ? 'active' : ''}`}
                            onClick={() => setActiveTab('freelancing')}
                        >
                            Freelancing
                        </button>
                    </div>

                    <div className="work-list">
                        {activeTab === 'fulltime' && (
                            // Full Time Work List
                            getFilteredWork(fullTimeWork).length > 0 ? (
                                getFilteredWork(fullTimeWork).map(workItem => (
                                    <div key={workItem.id} className="work-card">
                                        <img src={workItem.logo} alt={workItem.company} className="work-logo" />
                                        <div className="work-details">
                                            <div className="work-title">
                                                {workItem.title} <span className="time-posted">• {workItem.posted}</span>
                                            </div>
                                            <div className="work-company">{workItem.company}</div>
                                            <div className="work-meta">
                                                <span>{workItem.requiredExperience}</span>
                                                <span>• {workItem.location} ({workItem.locationType})</span>
                                                <span>• {workItem.jobType}</span>
                                            </div>
                                        </div>
                                        <button className="apply-btn">Apply</button>
                                    </div>
                                ))
                            ) : (
                                <div className="no-work-message">No full-time work matches your filters.</div>
                            )
                        )}

                        {activeTab === 'internship' && (
                            // Internships List
                            getFilteredWork(internships).length > 0 ? (
                                getFilteredWork(internships).map(workItem => (
                                    <div key={workItem.id} className="work-card">
                                        <img src={workItem.logo} alt={workItem.company} className="work-logo" />
                                        <div className="work-details">
                                            <div className="work-title">
                                                {workItem.title} <span className="time-posted">• {workItem.posted}</span>
                                            </div>
                                            <div className="work-company">{workItem.company}</div>
                                            <div className="work-meta">
                                                <span>{workItem.requiredExperience}</span>
                                                <span>• {workItem.location} ({workItem.locationType})</span>
                                                <span>• {workItem.jobType}</span>
                                                <span className={`badge ${workItem.type === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                                                    • {workItem.type}
                                                </span>
                                                <span>• {workItem.duration}</span>
                                            </div>
                                        </div>
                                        <button className="apply-btn">Easy Apply</button>
                                    </div>
                                ))
                            ) : (
                                <div className="no-work-message">No internships match your filters.</div>
                            )
                        )}

                        {activeTab === 'freelancing' && (
                            // Freelancing List
                            getFilteredWork(freelancingWork).length > 0 ? (
                                getFilteredWork(freelancingWork).map(workItem => (
                                    <div key={workItem.id} className="work-card">
                                        <img src={workItem.logo} alt={workItem.company} className="work-logo" />
                                        <div className="work-details">
                                            <div className="work-title">
                                                {workItem.title} <span className="time-posted">• {workItem.posted}</span>
                                            </div>
                                            <div className="work-company">{workItem.company}</div>
                                            <div className="work-meta">
                                                <span>{workItem.requiredExperience}</span>
                                                <span>• {workItem.location} ({workItem.locationType})</span>
                                                <span>• {workItem.jobType}</span>
                                                <span className="badge badge-paid">• {workItem.budget}</span>
                                                <span>• {workItem.duration}</span>
                                            </div>
                                            <div className="work-description" style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                                                {workItem.description}
                                            </div>
                                        </div>
                                        <button className="apply-btn">Apply</button>
                                    </div>
                                ))
                            ) : (
                                <div className="no-work-message">No freelancing work matches your filters.</div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Work;
