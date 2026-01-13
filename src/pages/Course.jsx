import React, { useState } from 'react';
import Icon from '../components/Icon';
import './Course.css';

const coursesData = [
    {
        id: 1,
        title: "Full-Stack Web Development Bootcamp",
        author: "Tech Academy",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        videoPreview: "https://joy1.videvo.net/videvo_files/video/free/2019-09/large_watermarked/190828_27_Supermarket_push_cart_1080p_preview.mp4", // Placeholder video
        price: 99.99,
        rating: 4.8,
        reviews: 1240,
        category: "Tech",
        isVerified: true
    },
    {
        id: 2,
        title: "UI/UX Design Masterclass",
        author: "Creative Minds",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        videoPreview: "https://joy1.videvo.net/videvo_files/video/free/2019-01/large_watermarked/181015_13_Venice_Beach_Drone_001_1080p_preview.mp4",
        price: 79.99,
        rating: 4.9,
        reviews: 850,
        category: "Design",
        isVerified: true
    },
    {
        id: 3,
        title: "Digital Marketing Strategy 2026",
        author: "Growth Hackers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 59.99,
        rating: 4.7,
        reviews: 3200,
        category: "Marketing",
        isVerified: false
    },
    {
        id: 4,
        title: "Artificial Intelligence for Beginners",
        author: "AI Institute",
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        videoPreview: "https://joy1.videvo.net/videvo_files/video/free/2015-08/large_watermarked/Typing_dark_08_videvo_preview.mp4",
        price: 129.99,
        rating: 4.9,
        reviews: 5600,
        category: "Tech",
        isVerified: true
    },
    {
        id: 5,
        title: "Photography Essentials",
        author: "Lens Masters",
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 49.99,
        rating: 4.6,
        reviews: 980,
        category: "Creative",
        isVerified: false
    },
    {
        id: 6,
        title: "Business Analytics with Python",
        author: "Data Wizards",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 89.99,
        rating: 4.7,
        reviews: 2100,
        category: "Business",
        isVerified: true
    }
];

const categories = ["All", "Tech", "Design", "Business", "Marketing", "Creative"];

const Course = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hoveredCourse, setHoveredCourse] = useState(null);

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
                            <div className="course-media"
                                onMouseEnter={() => setHoveredCourse(course.id)}
                                onMouseLeave={() => setHoveredCourse(null)}
                            >
                                {hoveredCourse === course.id && course.videoPreview ? (
                                    <video
                                        src={course.videoPreview}
                                        autoPlay
                                        muted
                                        loop
                                        className="course-video-preview"
                                    />
                                ) : (
                                    <div className="course-image" style={{ backgroundImage: `url(${course.image})` }}>
                                        <span className="course-badge">{course.category}</span>
                                    </div>
                                )}
                            </div>

                            <div className="course-details">
                                <div className="course-header-row">
                                    <h3 className="course-title">{course.title}</h3>
                                    {course.isVerified && (
                                        <div className="verified-badge-tooltip">
                                            <Icon name="check-circle" className="verified-badge" color="#3B82F6" size={16} />
                                            <span className="tooltip-text">Verified by Connectimi</span>
                                        </div>
                                    )}
                                </div>
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
                        <div className="payment-header">
                            <h2>Connectimi Secure Gateway</h2>
                            <div className="secure-badge">
                                <Icon name="lock" size={12} /> Encrypted
                            </div>
                        </div>

                        <div className="order-summary">
                            <div className="summary-row">
                                <span className="item-name">{selectedCourse?.title}</span>
                                <span className="item-price">${selectedCourse?.price}</span>
                            </div>
                            <div className="summary-row fee">
                                <span className="item-name">Processing Fee</span>
                                <span className="item-price">$2.00</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${(selectedCourse?.price + 2).toFixed(2)}</span>
                            </div>
                        </div>

                        <form className="modal-form" onSubmit={handlePayment}>
                            <div className="form-group">
                                <label>Cardholder Name</label>
                                <input type="text" placeholder="John Doe" required />
                            </div>
                            <div className="form-group">
                                <label>Card Number</label>
                                <div className="input-with-icon">
                                    <Icon name="credit-card" size={16} className="input-icon" />
                                    <input type="text" placeholder="1234 5678 9123 4567" required style={{ paddingLeft: '36px' }} />
                                </div>
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

                            <div className="payment-footer">
                                <div className="powered-by">
                                    Payments powered by <strong>Connectimi</strong>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="pay-btn-primary" disabled={isProcessing}>
                                        {isProcessing ? 'Processing...' : `Pay $${(selectedCourse?.price + 2).toFixed(2)}`}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Course;
