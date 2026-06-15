import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Icon from '../components/Icon';
import API from '../services/api';
import ComingSoon from '../components/ComingSoon';
import './Courses.css';

const Courses = () => {
    return (
        <div className="courses-container">
            <ComingSoon
                icon="book-open"
                title="Courses — Coming Soon"
                text="Curated, expert-led courses with interactive roadmaps are on the way. We're building this feature next — check back soon!"
            />
        </div>
    );
};

// const Courses = () => {
//     const navigate = useNavigate();
//     const cardsRef = useRef([]);
//     const heroRef = useRef(null);
//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const handleSeeRoadmap = (courseId) => {
//         navigate(`/courses/${courseId}`);
//     };

//     useEffect(() => {
//         const tl = gsap.timeline();

//         tl.fromTo(heroRef.current,
//             { opacity: 0, y: -20 },
//             { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
//         );

//         const fetchCatalog = async () => {
//             setLoading(true);
//             try {
//                 const res = await API.get("/courses/catalog");
//                 const catalog = res.data.courses.map((c) => ({
//                     id: c._id,
//                     title: c.title,
//                     description: c.description || "Master industry-standard skills with our dynamic, interactive roadmap structure.",
//                     duration: `${(c.modules?.length || 4) * 2.5} Hours`,
//                     level: "All Levels",
//                     type: "Course"
//                 }));
//                 setCourses(catalog);

//                 setTimeout(() => {
//                     if (cardsRef.current.length > 0) {
//                         gsap.fromTo(cardsRef.current,
//                             { opacity: 0, y: 30 },
//                             {
//                                 opacity: 1,
//                                 y: 0,
//                                 duration: 0.6,
//                                 stagger: 0.1,
//                                 ease: 'power2.out'
//                             }
//                         );
//                     }
//                 }, 100);
//             } catch (err) {
//                 console.error("Failed to load course catalog:", err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCatalog();
//     }, []);

//     return (
//         <div className="courses-container">
//             <div className="courses-hero" ref={heroRef}>
//                 <div className="courses-hero-content">
//                     <span className="hero-badge">Curated Learning</span>
//                     <h1>Unlock Your Potential</h1>
//                     <p>Master in-demand skills with our expert-led, project-based courses. Build your future today.</p>
//                 </div>
//             </div>

//             <div className="courses-grid-wrapper">
//                 {loading ? (
//                     <div className="no-work-message" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading dynamic course catalog...</div>
//                 ) : (
//                     <div className="courses-grid">
//                         {courses.map((course, index) => (
//                             <div
//                                 key={course.id}
//                                 className="course-card glass-morphism"
//                                 ref={el => cardsRef.current[index] = el}
//                             >
//                                 <div className="course-card-inner">
//                                     <div className={`course-type-badge type-${course.type.toLowerCase()}`}>
//                                         {course.type}
//                                     </div>
//                                     <h3 className="course-title">{course.title}</h3>
//                                     <p className="course-desc">{course.description}</p>

//                                     <div className="course-meta">
//                                         <span><Icon name="clock" size={14} /> {course.duration}</span>
//                                         <span><Icon name="chart-bar" size={14} /> {course.level}</span>
//                                     </div>

//                                     <button
//                                         className="see-roadmap-btn"
//                                         onClick={() => handleSeeRoadmap(course.id)}
//                                     >
//                                         See Roadmap <Icon name="arrow-right" size={14} />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

export default Courses;
