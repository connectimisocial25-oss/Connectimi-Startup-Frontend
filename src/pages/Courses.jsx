import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import './Courses.css';

const Courses = () => {
    const navigate = useNavigate();

    // Mock Data representing available courses
    const courses = [
        {
            id: 'web-basics',
            title: "HTML/CSS Builder",
            type: "Foundation",
            desc: "Build a static landing page component. Perfect for beginners starting their journey.",
            duration: "2 Weeks",
            level: "Beginner"
        },
        {
            id: 'js-logic',
            title: "JS Logic Calculator",
            type: "Foundation",
            desc: "Create a functional calculator with JS. Understand DOM manipulation and logic.",
            duration: "3 Weeks",
            level: "Beginner"
        },
        {
            id: 'react-intro',
            title: "React To-Do List",
            type: "Foundation",
            desc: "Simple state management app. Learn components, props, and state.",
            duration: "3 Weeks",
            level: "Intermediate"
        },
        {
            id: 'weather-app',
            title: "Weather Dashboard",
            type: "Integration",
            desc: "Fetch API data and visualize it. Master asynchronous JavaScript and APIs.",
            duration: "4 Weeks",
            level: "Intermediate"
        },
        {
            id: 'e-commerce-ui',
            title: "E-Commerce UI",
            type: "Integration",
            desc: "Product grid with cart functionality. Complex state management and routing.",
            duration: "5 Weeks",
            level: "Advanced"
        },
        {
            id: 'full-stack-social',
            title: "Social Network Platform",
            type: "Capstone",
            desc: "Full MERN stack application with auth. The ultimate portfolio project.",
            duration: "12 Weeks",
            level: "Expert"
        }
    ];

    const handleSeeRoadmap = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <div className="courses-container">
            <div className="courses-hero">
                <div className="courses-hero-content">
                    <h1>Unlock Your Potential</h1>
                    <p>Master in-demand skills with our expert-led, project-based courses future today.</p>
                </div>
            </div>

            <div className="courses-grid-wrapper">
                <div className="courses-header" style={{ display: 'none' }}>
                    {/* Kept for compatibility but hidden */}
                </div>

                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className={`course-type-badge type-${course.type.toLowerCase()}`}>
                                {course.type}
                            </div>
                            <h3 className="course-title">{course.title}</h3>
                            <p className="course-desc">{course.desc}</p>

                            <div className="course-meta">
                                <span><Icon name="clock" size={14} /> {course.duration}</span>
                                <span><Icon name="chart-bar" size={14} /> {course.level}</span>
                            </div>

                            <button
                                className="see-roadmap-btn"
                                onClick={() => handleSeeRoadmap(course.id)}
                            >
                                See Roadmap
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;
