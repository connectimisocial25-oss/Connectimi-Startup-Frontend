import React, { useState } from 'react';
import Avatar from '../Avatar';
import Icon from '../Icon';

const Feed = () => {
    // State for managing "See More" modal
    const [selectedInsight, setSelectedInsight] = useState(null);
    const [commentInput, setCommentInput] = useState('');

    // Initial data with 'likes' count
    const [insights, setInsights] = useState([
        {
            id: 1,
            author: 'Salic UX Research',
            authorImg: 'https://i.pravatar.cc/150?u=salic',
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Solving User Friction in Fintech',
            takeaway: 'We found that reducing steps by 20% increased retention by 50%. This was a significant finding in our recent study involving over 500 participants across various demographics. The key was to streamline the onboarding process without compromising security. We implemented a progressive profiling approach that allowed users to get value before committing to a full signup.',
            liked: true,
            likes: 42,
            comments: 5
        },
        {
            id: 2,
            author: 'Skili UX Research',
            authorImg: 'https://i.pravatar.cc/150?u=skili',
            image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Optimize Database Queries',
            takeaway: 'We found that indexing tags dbs by 20% increased return by 54%. Database optimization is often overlooked in early stages but becomes critical at scale. By analyzing query execution plans, we identified bottlenecks that were slowing down the entire application.',
            liked: false,
            likes: 18,
            comments: 2
        },
        {
            id: 3,
            author: 'John Doe',
            authorImg: 'https://i.pravatar.cc/150?u=john',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Team Collaboration at Scale',
            takeaway: 'Async communication is key for distributed teams. It allows deep work and reduces meeting fatigue. We recommend documentation-first culture.',
            liked: false,
            likes: 125,
            comments: 34
        },
        {
            id: 4,
            author: 'Jane Smith',
            authorImg: 'https://i.pravatar.cc/150?u=jane',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
            title: 'The Future of AI Design',
            takeaway: 'Generative UI will change how we build interfaces. Instead of static screens, we will design systems that adapt to user intent in real-time.',
            liked: true,
            likes: 89,
            comments: 12
        }
    ]);

    const handleLike = (id) => {
        setInsights(insights.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    liked: !item.liked,
                    likes: item.liked ? item.likes - 1 : item.likes + 1
                };
            }
            return item;
        }));
    };

    const openProjectModal = (insight) => {
        setSelectedInsight(insight);
    };

    const closeProjectModal = () => {
        setSelectedInsight(null);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <main className="feed-container">
            {/* Create Post Area */}
            <div className="share-insight-card">
                <div className="share-header">
                    <Avatar className="user-avatar-ring" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" size={48} />
                    <div className="share-input-wrapper">
                        <span className="share-placeholder">Build Something meaningful....</span>
                        <div className="share-actions-inline">
                            <button className="btn-miing">Post</button>
                        </div>
                    </div>
                </div>
                <div className="share-footer-actions">
                    <button className="btn-icon-text"><Icon name="project" /> Project</button>
                    <button className="btn-icon-text"><Icon name="image" /> Photo</button>
                    <button className="btn-icon-text"><Icon name="video" /> Video</button>
                    <button className="btn-icon-text"><Icon name="calendar" /> Event</button>
                    <div style={{ flex: 1 }}></div>
                </div>
            </div>

            {/* Insights Grid */}
            <div className="insights-grid">
                {insights.map(insight => (
                    <div key={insight.id} className="insight-card">
                        <div className="insight-image-wrapper" onClick={() => openProjectModal(insight)} style={{ cursor: 'pointer' }}>
                            <img src={insight.image} alt={insight.title} className="insight-image" />
                            <button className="btn-arrow-overlay"><Icon name="arrow-right" /></button>
                        </div>

                        <div className="insight-body">
                            <h3 className="insight-title" style={{ cursor: 'pointer' }} onClick={() => openProjectModal(insight)}>{insight.title}</h3>

                            <div className="insight-takeaway">
                                <span className="takeaway-label">KEY TAKEAWAY:</span>
                                <p>
                                    {truncateText(insight.takeaway, 100)}
                                    <span
                                        style={{ color: '#22c55e', cursor: 'pointer', fontWeight: '500', marginLeft: '4px' }}
                                        onClick={() => openProjectModal(insight)}
                                    >
                                        See More...
                                    </span>
                                </p>
                            </div>

                            <div className="insight-actions-new">
                                <div className="action-main-row">
                                    <button
                                        className={`btn-like-text ${insight.liked ? 'active' : ''}`}
                                        onClick={() => handleLike(insight.id)}
                                    >
                                        <Icon name={insight.liked ? "thumbs-up" : "thumbs-up"} /> Like
                                    </button>
                                    <button className="btn-comment-box">
                                        <Icon name="comment" /> Comment
                                    </button>
                                </div>
                                <button className="btn-share-center">
                                    <Icon name="share" /> Share
                                </button>
                            </div>
                        </div>

                        <div className="insight-footer-author">
                            <Avatar src={insight.authorImg} size={32} />
                            <span className="insight-author-name">{insight.author}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Details Modal */}
            {selectedInsight && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 2000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px'
                }} onClick={closeProjectModal}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>

                        {/* 1. Modal Header Title */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333', margin: 0 }}>{selectedInsight.title}</h2>
                            <button onClick={closeProjectModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>
                                <Icon name="close" />
                            </button>
                        </div>

                        {/* 2. Full Width Image Banner */}
                        <div style={{ width: '100%', height: '280px', backgroundColor: '#f0f0f0', position: 'relative' }}>
                            <img
                                src={selectedInsight.image}
                                alt={selectedInsight.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* 3. Content Body (Two Columns) */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 300px',
                            gap: '40px',
                            padding: '30px',
                            alignItems: 'start'
                        }}>

                            {/* Left Column: Details */}
                            <div style={{ minWidth: 0 }}>
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#555', marginBottom: '8px', textTransform: 'uppercase' }}>Project Overview</h3>
                                    <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666' }}>
                                        A deep dive into fintech user flows using mixed-methods research to uncover pain points and optimization opportunities.
                                    </p>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#555', marginBottom: '8px', textTransform: 'uppercase' }}>Key Takeaway</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase' }}>KEY RESULT:</span>
                                        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666' }}>
                                            {selectedInsight.takeaway}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Author & Actions */}
                            <div style={{ paddingLeft: '20px', borderLeft: '1px solid #f0f0f0' }}>
                                {/* Author Row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <Avatar src={selectedInsight.authorImg} size={40} />
                                    <div>
                                        <h4 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#333' }}>{selectedInsight.author}</h4>
                                        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Project Lead</p>
                                    </div>
                                </div>

                                {/* Message Button */}
                                <button style={{
                                    backgroundColor: '#22c55e', /* Green color */
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '24px',
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    marginBottom: '24px',
                                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                                }}>
                                    <Icon name="comment-dots" /> Message Owner
                                </button>

                                {/* Stats Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontSize: '16px', fontWeight: '700', color: '#333' }}>{selectedInsight.likes}</span>
                                        <span style={{ fontSize: '12px', color: '#888' }}>Likes</span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontSize: '16px', fontWeight: '700', color: '#333' }}>{selectedInsight.comments}</span>
                                        <span style={{ fontSize: '12px', color: '#888' }}>Comments</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Feed;
