import React from 'react';
import Icon from '../Icon';
import Avatar from '../Avatar';

const RightSidebar = () => {
    const suggestions = [
        { id: 1, name: 'Alex Rivera', role: 'Product Lead at Stripe', mutual: 12, img: 'https://i.pravatar.cc/150?u=alex' },
        { id: 2, name: 'Lisa Wang', role: 'ML Engineer at OpenAI', mutual: 8, img: 'https://i.pravatar.cc/150?u=lisa' },
        { id: 3, name: 'David Kim', role: 'Founder at Stealth', mutual: 5, img: 'https://i.pravatar.cc/150?u=david' },
    ];

    const jobs = [
        { id: 1, title: 'Senior Frontend Engineer', company: 'Vercel', type: 'Remote', salary: '$180K - $220K', new: true },
        { id: 2, title: 'Product Designer', company: 'Linear', type: 'SF / Remote', salary: '$150K - $190K', new: false },
    ];

    const trends = [
        { id: 1, tag: '#AI Ethics', posts: '2.5K' },
        { id: 2, tag: '#Remote Work', posts: '1.8K' },
        { id: 3, tag: '#Startup Life', posts: '1.2K' },
        { id: 4, tag: '#Career Growth', posts: '980' },
    ];

    return (
        <aside className="right-sidebar">
            {/* People you may know */}
            <div className="card suggestions-card">
                <h4 className="card-title">
                    <Icon name="user-plus" size={14} style={{ color: 'var(--primary-blue)' }} />
                    People you may know
                </h4>
                <div className="suggestion-list">
                    {suggestions.map(person => (
                        <div key={person.id} className="suggestion-item">
                            <Avatar src={person.img} size={40} className="suggestion-avatar" />
                            <div className="suggestion-info">
                                <div className="suggestion-name">{person.name}</div>
                                <div className="suggestion-role">{person.role}</div>
                                <div className="suggestion-mutual">{person.mutual} mutual connections</div>
                            </div>
                            <button className="btn-icon-outline">
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Jobs for you */}
            <div className="card jobs-card">
                <h4 className="card-title">
                    <Icon name="briefcase" size={14} style={{ color: 'var(--primary-blue)' }} />
                    Jobs for you
                </h4>
                <div className="jobs-list">
                    {jobs.map(job => (
                        <div key={job.id} className="job-item">
                            <div className="job-header">
                                <div className="job-title">{job.title}</div>
                                {job.new && <span className="badge-new">New</span>}
                            </div>
                            <div className="job-company">{job.company}</div>
                            <div className="job-meta">
                                {job.type} &bull; <span className="job-salary">{job.salary}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn-text-only">View all jobs</button>
            </div>

            {/* Trending */}
            <div className="card trending-card">
                <h4 className="card-title">
                    <Icon name="chart-bar" size={14} style={{ color: 'var(--primary-blue)' }} />
                    Trending on Connectimi
                </h4>
                <div className="trends-list">
                    {trends.map(trend => (
                        <div key={trend.id} className="trend-item">
                            <div className="trend-tag">{trend.tag}</div>
                            <div className="trend-posts">{trend.posts} posts</div>
                        </div>
                    ))}
                </div>
            </div>

        </aside>
    );
};

export default RightSidebar;
