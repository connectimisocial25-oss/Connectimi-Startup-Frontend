import React from 'react';
import Avatar from '../Avatar';
import Icon from '../Icon';

const Feed = () => {
    const insights = [
        {
            id: 1,
            author: 'Salic UX Research',
            authorImg: 'https://i.pravatar.cc/150?u=salic',
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Solving User Friction in Fintech',
            takeaway: 'We found that reducing steps by 20% increased retention by 50%',
            liked: true
        },
        {
            id: 2,
            author: 'Skili UX Research',
            authorImg: 'https://i.pravatar.cc/150?u=skili',
            image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Optimize Database Queries',
            takeaway: 'We found that indexing tags dbs by 20% increased return by 54%',
            liked: false
        },
        {
            id: 3,
            author: 'John Doe',
            authorImg: 'https://i.pravatar.cc/150?u=john',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Team Collaboration at Scale',
            takeaway: 'Async communication is key for distributed teams.',
            liked: false
        },
        {
            id: 4,
            author: 'Jane Smith',
            authorImg: 'https://i.pravatar.cc/150?u=jane',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
            title: 'The Future of AI Design',
            takeaway: 'Generative UI will change how we build interfaces.',
            liked: true
        }
    ];

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
                        <div className="insight-header">
                            <Avatar src={insight.authorImg} size={24} />
                            <span className="insight-author">{insight.author}</span>
                        </div>

                        <div className="insight-image-wrapper">
                            <img src={insight.image} alt={insight.title} className="insight-image" />
                            <button className="btn-arrow-overlay"><Icon name="arrow-right" /></button>
                        </div>

                        <div className="insight-body">
                            <h3 className="insight-title">{insight.title}</h3>

                            <div className="insight-takeaway">
                                <span className="takeaway-label">KEY TAKEAWAY:</span>
                                <p>{insight.takeaway}</p>
                            </div>

                            <div className="insight-actions">
                                <button className="btn-action-outline">Applaud</button>
                                <button className="btn-action-outline">Save to Portfolio</button>
                                <button className="btn-action-text">Message for Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Feed;
