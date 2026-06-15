import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import gsap from 'gsap';
import API from '../services/api';
import './Work.css';
import ComingSoon from '../components/ComingSoon';

const Work = () => {
    return (
        <div className="work-container">
            <ComingSoon
                icon="briefcase"
                title="Work & Jobs — Coming Soon"
                text="Full-time roles, internships, and freelance projects are on the way. We're building this feature next — check back soon!"
            />
        </div>
    );
};

// const Work = () => {
//     const navigate = useNavigate();
//     const { theme } = useTheme();
//     const [activeTab, setActiveTab] = useState('Full-time'); // Backend enum values: 'Full-time', 'Internship', 'Freelance'
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filters, setFilters] = useState({
//         location: 'all',
//         experienceLevel: 'all'
//     });
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const sidebarRef = useRef(null);
//     const mainRef = useRef(null);
//     const listRef = useRef(null);

//     useEffect(() => {
//         const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

//         tl.fromTo(sidebarRef.current,
//             { x: -50, opacity: 0 },
//             { x: 0, opacity: 1 }
//         )
//         .fromTo(mainRef.current,
//             { y: 30, opacity: 0 },
//             { y: 0, opacity: 1 },
//             "-=0.6"
//         );
//     }, []);

//     // Load active jobs from API with filters
//     useEffect(() => {
//         const fetchJobs = async () => {
//             setLoading(true);
//             try {
//                 let url = `/jobs?type=${activeTab}`;
//                 if (searchQuery.trim()) {
//                     url += `&search=${encodeURIComponent(searchQuery)}`;
//                 }
//                 if (filters.location !== 'all') {
//                     url += `&location=${encodeURIComponent(filters.location)}`;
//                 }
//                 const res = await API.get(url);
//                 const mappedJobs = res.data.jobs.map((job) => ({
//                     id: job._id,
//                     title: job.title,
//                     company: job.company,
//                     location: job.location,
//                     locationType: job.location.toLowerCase().includes("remote") ? "remote" : "on-site",
//                     salaryRange: job.salary || "Not Specified",
//                     requiredExperience: job.requirements?.join(", ") || "Details in description",
//                     jobType: job.type,
//                     logo: `https://loremflickr.com/56/56/technology,code?lock=${job._id.charCodeAt(job._id.length - 1) || 1}`,
//                     posted: new Date(job.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//                     applicants: job.applicants?.length || 0,
//                     description: job.description
//                 }));
//                 setJobs(mappedJobs);

//                 setTimeout(() => {
//                     if (listRef.current) {
//                         gsap.fromTo(listRef.current.children,
//                             { y: 20, opacity: 0 },
//                             { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
//                         );
//                     }
//                 }, 100);
//             } catch (err) {
//                 console.error("Failed to load jobs:", err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchJobs();
//     }, [activeTab, searchQuery, filters]);

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleApply = async (jobId) => {
//         try {
//             const res = await API.post(`/jobs/${jobId}/apply`);
//             alert(res.data.message || "Application submitted successfully!");

//             // Increment applicants count locally
//             setJobs(jobs.map(j => j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j));
//         } catch (err) {
//             alert(err.response?.data?.error || "Failed to submit application. You may have already applied.");
//         }
//     };

//     const renderWorkCard = (workItem) => (
//         <div key={workItem.id} className="work-card">
//             <img src={workItem.logo} alt={workItem.company} className="work-logo" />
//             <div className="work-details">
//                 <div className="work-title">
//                     {workItem.title}
//                     <span className="time-posted">{workItem.posted}</span>
//                 </div>
//                 <div className="work-company">{workItem.company}</div>
//                 <div className="work-meta">
//                     <span><Icon name="briefcase" size={14} style={{marginRight: '6px'}} /> {workItem.requiredExperience}</span>
//                     <span><Icon name="map-pin" size={14} style={{marginRight: '6px'}} /> {workItem.location} ({workItem.locationType})</span>
//                     <span><Icon name="clock" size={14} style={{marginRight: '6px'}} /> {workItem.jobType}</span>
//                     <span><Icon name="users" size={14} style={{marginRight: '6px'}} /> {workItem.applicants} Applicants</span>
//                     {workItem.salaryRange && <span className="badge badge-paid">₹{workItem.salaryRange}</span>}
//                 </div>
//                 {workItem.description && (
//                     <div className="work-description" style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.6' }}>
//                         {workItem.description}
//                     </div>
//                 )}
//             </div>
//             <button className="apply-btn" onClick={() => handleApply(workItem.id)}>Apply Now</button>
//         </div>
//     );

//     return (
//         <div className="work-container">
//             <div className="work-content">
//                 <aside className="work-sidebar" ref={sidebarRef}>
//                     <div className="filter-card">
//                         <div className="filter-group">
//                             <label>Search Opportunities</label>
//                             <div className="search-wrapper" style={{ position: 'relative' }}>
//                                 <input
//                                     type="text"
//                                     placeholder="Keywords, companies..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                 />
//                             </div>
//                         </div>

//                         <h3 className="filter-title">Refine Search</h3>

//                         <div className="filter-group">
//                             <label>Location Preference</label>
//                             <select name="location" value={filters.location} onChange={handleFilterChange}>
//                                 <option value="all">Anywhere</option>
//                                 <option value="Remote">Remote</option>
//                                 <option value="On-site">On-site</option>
//                                 <option value="Hybrid">Hybrid</option>
//                             </select>
//                         </div>

//                         <button
//                             className="reset-filters-btn"
//                             onClick={() => {
//                                 setSearchQuery('');
//                                 setFilters({
//                                     location: 'all',
//                                     experienceLevel: 'all'
//                                 });
//                             }}
//                         >
//                             Clear All Filters
//                         </button>
//                     </div>
//                 </aside>

//                 <div className="work-main" ref={mainRef}>
//                     <div className="work-tabs">
//                         <button
//                             className={`work-tab ${activeTab === 'Full-time' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('Full-time')}
//                         >
//                             Full-time Roles
//                         </button>
//                         <button
//                             className={`work-tab ${activeTab === 'Internship' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('Internship')}
//                         >
//                             Internships
//                         </button>
//                         <button
//                             className={`work-tab ${activeTab === 'Freelance' ? 'active' : ''}`}
//                             onClick={() => setActiveTab('Freelance')}
//                         >
//                             Freelance Projects
//                         </button>
//                     </div>

//                     <div className="work-list" ref={listRef}>
//                         {loading ? (
//                             <div className="no-work-message">Loading active opportunities...</div>
//                         ) : jobs.length > 0 ? (
//                             jobs.map(renderWorkCard)
//                         ) : (
//                             <div className="no-work-message">No opportunities found matching your criteria.</div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

export default Work;
