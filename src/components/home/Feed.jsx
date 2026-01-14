import React from 'react';
import Avatar from '../Avatar';
import Icon from '../Icon';

const Feed = () => {
    const posts = [
        {
            id: 1,
            author: 'Emily Rodriguez',
            role: 'Startup Founder | YC W23',
            time: '8h ago',
            avatar: 'https://i.pravatar.cc/150?u=emily',
            content: "We just closed our Series A! 🎉 After 18 months of building, pivoting twice, and many sleepless nights, we're thrilled to announce $12M to continue building the future of async work.\n\nThank you to everyone who believed in us!",
            likes: 2479,
            comments: 234,
            shares: 89
        },
        {
            id: 2,
            author: 'Marcus Johnson',
            role: 'Engineering Manager at Notion',
            time: '5h ago',
            avatar: 'https://i.pravatar.cc/150?u=marcus',
            content: "Hot take: The best engineering cultures prioritize psychological safety over technical excellence. You can teach skills, but building trust takes intentional effort.",
            likes: 924,
            comments: 89,
            shares: 34
        },
        {
            id: 3,
            author: 'Sarah Miller',
            role: 'Product Designer at Stripe',
            time: '2h ago',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            content: "Just shipped a major redesign that increased conversion by 34%! The key insight? Removing friction beats adding features every time. Sometimes the best design is invisible.",
            likes: 156,
            comments: 24,
            shares: 5
        }
    ];

    return (
        <main className="feed-container">
            {/* Create Post Widget */}
            <div className="card create-post-card">
                <div className="create-post-top">
                    <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" size={48} />
                    <div className="create-post-input">
                        Build something meaningful...
                    </div>
                </div>
                <div className="create-post-actions">
                    <div className="media-buttons">
                        {/* Hidden file input for mechanics */}
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                            // ref={fileInputRef} // Simple direct ref not strictly needed if we use ID or state, but let's just use a ref in full implementation. 
                            // For simplicity in this replacement, we'll use a direct document.getElementById or just render logic
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    alert(`Selected file: ${e.target.files[0].name}`);
                                }
                            }}
                        />

                        <button className="action-icon-btn" title="Write Article" onClick={() => document.getElementById('file-upload').click()}>
                            <Icon name="file-alt" size={24} style={{ color: '#5735e0ff' }} />
                        </button>
                        <button className="action-icon-btn" title="Add Image" onClick={() => document.getElementById('file-upload').click()}>
                            <Icon name="image" size={24} style={{ color: '#5735e0ff' }} />
                        </button>
                        <button className="action-icon-btn" title="Add Video" onClick={() => document.getElementById('file-upload').click()}>
                            <Icon name="video" size={24} style={{ color: '#5735e0ff' }} />
                        </button>
                        <button className="action-icon-btn" title="Create Event">
                            <Icon name="calendar" size={24} style={{ color: '#5735e0ff' }} />
                        </button>
                    </div>
                    {/* Spacer */}
                    <div style={{ flex: 1 }}></div>
                    <button className="btn-post">Post</button>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="posts-list">
                {posts.map(post => (
                    <div key={post.id} className="card post-card">
                        <div className="post-header">
                            <Avatar src={post.avatar} size={48} className="post-avatar" />
                            <div className="post-meta">
                                <div className="post-author-row">
                                    <span className="post-author">{post.author}</span>
                                    {/* Optional verified badge or connection degree could go here */}
                                </div>
                                <div className="post-role">{post.role}</div>
                                <div className="post-time">{post.time}</div>
                            </div>
                            <div className="post-options">
                                <Icon name="ellipsis-h" />
                            </div>
                        </div>

                        <div className="post-content">
                            {post.content}
                        </div>

                        <div className="post-stats">
                            <div className="stats-left">
                                <span className="reaction-icons">👍❤️👏</span>
                                <span className="reaction-count">{post.likes.toLocaleString()}</span>
                            </div>
                            <div className="stats-right">
                                <span>{post.comments} comments</span> &bull; <span>{post.shares} shares</span>
                            </div>
                        </div>

                        <div className="post-actions">
                            <button className="feed-action-btn">
                                <Icon name="thumbs-up" /> Like
                            </button>
                            <button className="feed-action-btn">
                                <Icon name="comment" /> Comment
                            </button>
                            <button className="feed-action-btn">
                                <Icon name="share" /> Share
                            </button>
                            <div style={{ flex: 1 }}></div>
                            <button className="feed-action-btn bookmark-btn">
                                <Icon name="bookmark" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Feed;
