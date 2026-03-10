import React, { useState } from 'react';
import Icon from '../../components/Icon';
import './OrgPages.css';

const OrgCourses = () => {
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', price: '', videoUrl: '', requestVerification: false });
    const [orgData, setOrgData] = useState({
        courses: [
            { id: 1, title: "Speak with Impact: Master Spoken English for the Modern World", students: 1240, rating: 4.8, revenue: "₹49,999", isVerified: true, isBoosted: false },
            { id: 2, title: "The Resume Lab: Transform Your Experience into a Job Magnet", students: 850, rating: 4.9, revenue: "₹14,999", isVerified: true, isBoosted: false },
            { id: 3, title: "Interview Decoder: Your Blueprint to Cracking Top-Tier Companies", students: 1100, rating: 4.7, revenue: "₹34,999", isVerified: true, isBoosted: false }
        ]
    });

    const handleAddCourseSubmit = () => {
        const course = {
            id: orgData.courses.length + 1,
            title: newCourse.title,
            students: 0,
            rating: 0,
            revenue: "₹0",
            isVerified: newCourse.requestVerification,
            isBoosted: false
        };
        setOrgData({ ...orgData, courses: [...orgData.courses, course] });
        setIsAddCourseModalOpen(false);
        setNewCourse({ title: '', price: '', videoUrl: '', requestVerification: false });
    };

    return (
        <div className="org-page-container">
            <div className="org-glass-card fade-in">
                <div className="section-header-flex">
                    <h2>Course Catalog</h2>
                    <button className="new-course-apply-btn" onClick={() => setIsAddCourseModalOpen(true)}>
                        <Icon name="plus" /> New Course
                    </button>
                </div>
                <div className="course-grid-modern">
                    {orgData.courses.map(course => (
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
                            <button className="course-action-btn">Manage</button>
                        </div>
                    ))}
                </div>
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
