import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import Icon from '../components/Icon';
import PaymentModal from '../components/PaymentModal';
import API from '../services/api';
import './CourseRoadmap.css';

const CourseRoadmap = () => {
    const { courseId } = useParams();
    const timelineRef = useRef(null);
    const headerRef = useRef(null);
    const [courseData, setCourseData] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progressRecord, setProgressRecord] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleUnlockClick = () => {
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        try {
            const res = await API.post(`/courses/${courseId}/enroll`);
            setIsEnrolled(true);
            setProgressRecord(res.data.progress);
            alert("Enrollment successful! Premium modules have been unlocked.");
        } catch (err) {
            console.error("Failed to enroll in course:", err.message);
        }
    };

    const handleStartModule = async (moduleId, currentStatus) => {
        try {
            // Toggle module to completed or active in backend
            const nextStatus = currentStatus === 'completed' ? 'reset' : 'completed';
            const res = await API.put(`/courses/${courseId}/modules`, {
                moduleId,
                status: nextStatus
            });
            setProgressRecord(res.data.progress);
            alert(nextStatus === 'completed' ? "Module completed successfully!" : "Module progress reset.");
        } catch (err) {
            console.error("Failed to update module status:", err.message);
        }
    };

    useEffect(() => {
        const fetchCourseAndProgress = async () => {
            setLoading(true);
            try {
                // 1. Fetch course catalog details from backend list (find matching course)
                const catalogRes = await API.get("/courses/catalog");
                const foundCourse = catalogRes.data.courses.find(c => c._id === courseId);
                
                if (foundCourse) {
                    setCourseData(foundCourse);
                }

                // 2. Fetch user course progress tracking from backend
                const progressRes = await API.get(`/courses/${courseId}/progress`);
                const prog = progressRes.data.progress;
                setProgressRecord(prog);
                setIsEnrolled(prog?.is_enrolled || false);

                // GSAP Animations after data is ready
                setTimeout(() => {
                    const tl = gsap.timeline();
                    if (headerRef.current) {
                        tl.fromTo(headerRef.current,
                            { opacity: 0, y: -20 },
                            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
                        );
                    }
                    tl.fromTo('.timeline-item',
                        { opacity: 0, x: -20 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.5,
                            stagger: 0.15,
                            ease: 'power2.out'
                        },
                        "-=0.4"
                    );
                }, 100);
            } catch (err) {
                console.error("Failed to load course details:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndProgress();
    }, [courseId]);

    if (loading) {
        return <div className="roadmap-container"><h2 style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading course roadmap...</h2></div>;
    }

    if (!courseData) {
        return <div className="roadmap-container"><h1>Course not found</h1></div>;
    }

    return (
        <div className="roadmap-container">
            <header className="roadmap-header" ref={headerRef}>
                <div className="roadmap-header-content">
                    <span className="roadmap-badge">Course Roadmap</span>
                    <h1>{courseData.title}</h1>
                    <p className="roadmap-description">{courseData.description || "Master these premium modules."}</p>
                    <div className="course-meta">
                        <span><Icon name="clock" size={14} /> {(courseData.modules?.length || 4) * 2.5} Hours</span>
                        <span><Icon name="book" size={14} /> {courseData.modules?.length || 0} Modules</span>
                        <span><Icon name="user-friends" size={14} /> 1.2k Students</span>
                    </div>
                </div>
            </header>

            <div className="roadmap-timeline" ref={timelineRef}>
                {courseData.modules?.map((module, index) => {
                    const isCompleted = progressRecord?.completed_modules?.includes(module._id) || progressRecord?.completed_modules?.includes(module.id);
                    const isModuleLocked = !isEnrolled && module.locked;
                    const displayStatus = isModuleLocked ? 'Locked' : isCompleted ? 'completed' : 'active';

                    return (
                        <div key={module._id || module.id} className={`timeline-item ${isModuleLocked ? 'locked' : 'unlocked'}`}>
                            <div className="timeline-marker-container">
                                <div className="timeline-marker">
                                    {isCompleted ? <Icon name="check" size={12} /> :
                                        isModuleLocked ? <Icon name="lock" size={12} /> :
                                            <span>{index + 1}</span>}
                                </div>
                                {index < courseData.modules.length - 1 && <div className="timeline-line"></div>}
                            </div>

                            <div className={`timeline-content glass-morphism ${isModuleLocked ? 'content-locked' : ''}`}>
                                <div className="module-header">
                                    <h3>{module.title}</h3>
                                    <span className={`status-badge ${displayStatus}`}>
                                        {displayStatus}
                                    </span>
                                </div>
                                <p className="module-desc">{module.desc}</p>

                                {!isModuleLocked && (
                                    <div className="module-actions">
                                        <button className="btn-start" onClick={() => handleStartModule(module._id || module.id, isCompleted ? 'completed' : 'active')}>
                                            {isCompleted ? 'Review (Completed)' : 'Mark as Completed'} <Icon name="arrow-right" size={12} />
                                        </button>
                                    </div>
                                )}

                                {isModuleLocked && (
                                    <div className="paywall-overlay">
                                        <div className="lock-indicator">
                                            <Icon name="lock" size={24} />
                                            <span>Premium Content</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!isEnrolled && (
                <div className="unlock-cta-container glass-morphism">
                    <h2>Ready to Master this Course?</h2>
                    <p>Unlock all modules, active projects, and earn verification badges.</p>
                    <br />
                    <button className="unlock-btn" onClick={handleUnlockClick}>
                        <Icon name="lock-open" /> Unlock Full Course Access
                    </button>
                </div>
            )}

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
                courseTitle={courseData.title}
                price={courseData.price || "4,999"}
            />
        </div>
    );
};

export default CourseRoadmap;
