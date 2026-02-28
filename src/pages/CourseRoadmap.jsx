import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import Icon from '../components/Icon';
import PaymentModal from '../components/PaymentModal';
import './CourseRoadmap.css';

const CourseRoadmap = () => {
    const { courseId } = useParams();
    const timelineRef = useRef(null);
    const headerRef = useRef(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Mock specific course data for demo
    // In a real app, fetch based on courseId
    const courseData = {
        title: "Building a Full-Stack Social Network",
        description: "Zero to Mastery: Create a complete platform with React, Node.js, and MongoDB.",
        duration: "12 Weeks",
        modules: [
            { id: 1, title: "Part 1: Backend Architecture & API Design", desc: "Setup Node.js server, Express routes, and MongoDB schemas.", status: "completed", locked: false },
            { id: 2, title: "Part 2: Frontend Fundamentals & Auth", desc: "React setup, Redux for state, and JWT Authentication flows.", status: "inprogress", locked: false },
            { id: 3, title: "Part 3: Advanced UI Components", desc: "Building the Feed, Profile, and dynamic interactions.", status: "upcoming", locked: false },
            { id: 4, title: "Part 4: Real-time Features (WebSocket)", desc: "Implementing chat and notifications with Socket.io.", status: "upcoming", locked: true },
            { id: 5, title: "Part 5: Deployment & CD/CI", desc: "Deploying to cloud (AWS/Heroku) and setting up pipelines.", status: "upcoming", locked: true }
        ]
    };

    const handleUnlockClick = () => {
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsEnrolled(true);
        // You might want to show a success toast here
    };

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(headerRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

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
    }, []);

    return (
        <div className="roadmap-container">
            <header className="roadmap-header" ref={headerRef}>
                <div className="roadmap-header-content">
                    <span className="roadmap-badge">Course Roadmap</span>
                    <h1>{courseData.title}</h1>
                    <div className="course-meta">
                        <span><Icon name="clock" size={14} /> {courseData.duration}</span>
                        <span><Icon name="book" size={14} /> 5 Modules</span>
                        <span><Icon name="user-friends" size={14} /> 1.2k Students</span>
                    </div>
                </div>
            </header>

            <div className="roadmap-timeline" ref={timelineRef}>
                {courseData.modules.map((module, index) => {
                    const isLocked = !isEnrolled && module.locked;

                    return (
                        <div key={module.id} className={`timeline-item ${isLocked ? 'locked' : 'unlocked'}`}>
                            <div className="timeline-marker-container">
                                <div className="timeline-marker">
                                    {module.status === 'completed' ? <Icon name="check" size={12} /> :
                                        isLocked ? <Icon name="lock" size={12} /> :
                                            <span>{index + 1}</span>}
                                </div>
                                {index < courseData.modules.length - 1 && <div className="timeline-line"></div>}
                            </div>

                            <div className={`timeline-content glass-morphism ${isLocked ? 'content-locked' : ''}`}>
                                <div className="module-header">
                                    <h3>{module.title}</h3>
                                    <span className={`status-badge ${module.status}`}>
                                        {isLocked ? 'Locked' : module.status}
                                    </span>
                                </div>
                                <p className="module-desc">{module.desc}</p>

                                {!isLocked && (
                                    <div className="module-actions">
                                        <button className="btn-start">
                                            {module.status === 'completed' ? 'Review' : 'Start Learning'} <Icon name="arrow-right" size={12} />
                                        </button>
                                    </div>
                                )}

                                {isLocked && (
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
                    <h2>Ready to Master the Full Stack?</h2>
                    <p>Unlock the remaining modules, including Real-time features and Deployment.</p>
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
                price="49.99"
            />
        </div>
    );
};

export default CourseRoadmap;
