import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../pages/OrgPages.css';

const OrgCourses = () => {
    const { user } = useAuth();
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', price: '', videoUrl: '', requestVerification: false });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load organization-specific courses from catalog
    const fetchOrgCourses = async () => {
        setLoading(true);
        try {
            const res = await API.get("/courses/catalog");
            // Filter by currently logged in organization user
            const orgSpecific = res.data.courses
                .filter(c => c.creator?._id === user?.id || c.creator === user?.id)
                .map((c) => ({
                    id: c._id,
                    title: c.title,
                    students: Math.floor(Math.random() * 500) + 120,
                    rating: parseFloat((Math.random() * 0.4 + 4.5).toFixed(1)),
                    revenue: `₹${c.price || "4,999"}`,
                    isVerified: true,
                    isBoosted: false
                }));
            setCourses(orgSpecific);
        } catch (err) {
            console.error("Failed to load organization courses:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrgCourses();
        }
    }, [user]);

    const handleAddCourseSubmit = async () => {
        if (!newCourse.title.trim()) return;

        try {
            const payload = {
                title: newCourse.title,
                price: newCourse.price || "4,999",
                description: `Complete dynamic learning course designed by ${user?.name || "our organization"}.`,
                modules: [
                    { title: "Introduction & Setup", desc: "Setting up tools and covering core concepts.", locked: false },
                    { title: "Foundations & Deep Dive", desc: "Understanding syntax, models, and paradigms.", locked: true },
                    { title: "Hands-on Project Development", desc: "Building a production-ready application.", locked: true },
                    { title: "Testing & Advanced Deployment", desc: "Optimizing codes and scaling to cloud platforms.", locked: true }
                ]
            };

            await API.post("/courses/catalog", payload);
            setIsAddCourseModalOpen(false);
            setNewCourse({ title: '', price: '', videoUrl: '', requestVerification: false });
            
            // Reload course list
            fetchOrgCourses();
            alert("Course launched in public catalog successfully!");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to create course. Please try again.");
        }
    };

    return (
        <div className="org-page-container">
            <div className="org-glass-card fade-in">
                <div className="section-header-flex">
                    <h2>Course Catalog Management</h2>
                    <button className="new-course-apply-btn" onClick={() => setIsAddCourseModalOpen(true)}>
                        <Icon name="plus" /> New Course
                    </button>
                </div>
                {loading ? (
                    <div className="no-work-message" style={{ color: 'var(--text-muted)' }}>Loading organization courses...</div>
                ) : courses.length > 0 ? (
                    <div className="course-grid-modern">
                        {courses.map(course => (
                            <div key={course.id} className="course-item-glass">
                                <div className="course-icon-box"><Icon name="book" size={24} /></div>
                                <div className="course-details">
                                    <h4>{course.title} {course.isVerified && <Icon name="check-circle" size={14} color="var(--primary-emerald)" />}</h4>
                                    <div className="course-stats-row">
                                        <span><Icon name="users" size={12} /> {course.students}</span>
                                        <span><Icon name="star" size={12} /> {course.rating}</span>
                                        <span className="revenue-tag">{course.revenue}</span>
                                    </div>
                                </div>
                                <button className="course-action-btn" onClick={() => alert("Detailed course dashboard coming soon!")}>Manage</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                        <Icon name="book" size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
                        <p>No courses published yet. Launch your first course to start earning!</p>
                    </div>
                )}
            </div>

            {isAddCourseModalOpen && (
                <div className="modal-overlay-modern" onClick={() => setIsAddCourseModalOpen(false)}>
                    <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
                        <h2>Add New Course</h2>
                        <div className="form-group-modern">
                            <label>Course Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Master React in 30 Days"
                                value={newCourse.title}
                                onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                            />
                        </div>
                        <div className="form-group-modern">
                            <label>Price (₹)</label>
                            <input
                                type="text"
                                placeholder="e.g. 4,999"
                                value={newCourse.price}
                                onChange={e => setNewCourse({ ...newCourse, price: e.target.value })}
                            />
                        </div>
                        <div className="form-group-modern">
                            <label>Intro Video URL</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newCourse.videoUrl}
                                onChange={e => setNewCourse({ ...newCourse, videoUrl: e.target.value })}
                            />
                        </div>
                        <div className="form-group-modern checkbox-group">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={newCourse.requestVerification}
                                    onChange={e => setNewCourse({ ...newCourse, requestVerification: e.target.checked })}
                                />
                                <span className="checkmark"></span>
                                Request Connectimi Verification
                            </label>
                        </div>
                        <div className="modal-actions">
                            <button className="profile-btn" onClick={() => setIsAddCourseModalOpen(false)}>Cancel</button>
                            <button className="profile-btn primary" onClick={handleAddCourseSubmit}>Create Course</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrgCourses;
