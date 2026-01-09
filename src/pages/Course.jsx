import React, { useState } from 'react';
import Icon from '../components/Icon';
import './Course.css';

const coursesData = [
    {
        id: 1,
        title: "Full-Stack Web Development Bootcamp",
        author: "Tech Academy",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 99.99,
        rating: 4.8,
        reviews: 1240,
        category: "Tech"
    },
    {
        id: 2,
        title: "UI/UX Design Masterclass",
        author: "Creative Minds",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 79.99,
        rating: 4.9,
        reviews: 850,
        category: "Design"
    },
    {
        id: 3,
        title: "Digital Marketing Strategy 2026",
        author: "Growth Hackers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 59.99,
        rating: 4.7,
        reviews: 3200,
        category: "Marketing"
    },
    {
        id: 4,
        title: "Artificial Intelligence for Beginners",
        author: "AI Institute",
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 129.99,
        rating: 4.9,
        reviews: 5600,
        category: "Tech"
    },
    {
        id: 5,
        title: "Photography Essentials",
        author: "Lens Masters",
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 49.99,
        rating: 4.6,
        reviews: 980,
        category: "Creative"
    },
    {
        id: 6,
        title: "Business Analytics with Python",
        author: "Data Wizards",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 89.99,
        rating: 4.7,
        reviews: 2100,
        category: "Business"
    }
];

const categories = ["All", "Tech", "Design", "Business", "Marketing", "Creative"];

const Course = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const filteredCourses = activeCategory === "All"
        ? coursesData
        : coursesData.filter(course => course.category === activeCategory);

    const handleEnroll = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment delay
        setTimeout(() => {
            setIsProcessing(false);
            setIsModalOpen(false);
            alert(`Successfully enrolled in ${selectedCourse.title}!`);
            setSelectedCourse(null);
        }, 1500);
    };

    return (
        <div className="course-container">
            <div className="course-content">
                {/* Hero Section */}
                <header className="course-hero">
                    <h1>Expand Your Skills with Expert-Led Courses</h1>
                    <p>Choose from over 100,000 online video courses with new additions published every month</p>
                </header>

                {/* Filters */}
                <div className="course-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="course-grid">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-image" style={{ backgroundImage: `url(${course.image})` }}>
                                <span className="course-badge">{course.category}</span>
                            </div>
                            <div className="course-details">
                                <h3 className="course-title">{course.title}</h3>
                                <div className="course-author">{course.author}</div>
                                <div className="course-meta">
                                    <div className="course-rating">
                                        <span style={{ fontSize: '12px' }}>{course.rating}</span>
                                        <Icon name="star" size={14} />
                                    </div>
                                    <span style={{ color: '#ccc' }}>|</span>
                                    <span>({course.reviews.toLocaleString()})</span>
                                </div>
                                <div className="course-price-row">
                                    <span className="course-price">${course.price}</span>
                                    <button className="enroll-btn" onClick={() => handleEnroll(course)}>
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="payment-modal" onClick={e => e.stopPropagation()}>
                        <h2>Enroll in Course</h2>
                        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                            <strong>{selectedCourse?.title}</strong>
                            <div style={{ float: 'right', fontWeight: 'bold' }}>${selectedCourse?.price}</div>
                        </div>

                        <form className="modal-form" onSubmit={handlePayment}>
                            <div className="form-group">
                                <label>Card Number</label>
                                <input type="text" placeholder="1234 5678 9123 4567" required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>CVC</label>
                                    <input type="text" placeholder="123" required />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="pay-btn-primary" disabled={isProcessing}>
                                    {isProcessing ? 'Processing...' : `Pay $${selectedCourse?.price}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Course;
