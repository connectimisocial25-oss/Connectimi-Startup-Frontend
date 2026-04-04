import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import PaymentModal from '../components/PaymentModal';
import './MyNetwork.css';
import Messaging from './Messaging';

const MyNetwork = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();

    const initialTab = location.state?.tab || new URLSearchParams(location.search).get('tab') || 'connections';
    const [activeTab, setActiveTab] = useState(initialTab);
    
    // Payment Modal State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(null);

    useEffect(() => {
        const tab = location.state?.tab || new URLSearchParams(location.search).get('tab') || 'connections';
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [location.search, location.state]);

    const mainContentRef = useRef(null);
    const sidebarRef = useRef(null);
    const suggestionsRef = useRef([]);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(sidebarRef.current,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
        tl.fromTo(mainContentRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            "-=0.6"
        );
    }, []);

    useEffect(() => {
        if (activeTab !== 'messaging' && suggestionsRef.current.length > 0) {
            gsap.fromTo(suggestionsRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
            );
        }
    }, [activeTab]);

    const invitations = [
        {
            id: 2,
            name: "Michael Chen",
            role: "Product Manager at InnovateSoft",
            userRole: "company",
            avatar: "https://i.pravatar.cc/150?u=michael"
        },
        {
            id: 1,
            name: "Sarah Miller",
            role: "Software Engineer at TechCorp",
            userRole: "professional",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        }
    ];

    const suggestions = [
        {
            id: 101,
            name: "David Wilson",
            role: "Full Stack Developer | React & Node.js",
            userRole: "professional",
            avatar: "https://i.pravatar.cc/150?u=david"
        },
        {
            id: 102,
            name: "Emily Blunt",
            role: "UI/UX Designer at Creative Studio",
            userRole: "company",
            avatar: "https://i.pravatar.cc/150?u=emily"
        },
        {
            id: 103,
            name: "James Bond",
            role: "Security Analyst",
            userRole: "professor",
            avatar: "https://i.pravatar.cc/150?u=james"
        },
        {
            id: 104,
            name: "Jessica Alba",
            role: "Marketing Manager",
            userRole: "professional",
            avatar: "https://i.pravatar.cc/150?u=jessica"
        },
        {
            id: 105,
            name: "Iron Man",
            role: "Genius, Billionaire, Philanthropist",
            userRole: "company",
            avatar: "https://i.pravatar.cc/150?u=ironman"
        },
        {
            id: 106,
            name: "Black Widow",
            role: "Special Agent",
            userRole: "professor",
            avatar: "https://i.pravatar.cc/150?u=natasha"
        }
    ];

    const expertsData = [
        {
            id: 201,
            name: "Sarah Jenkins",
            role: "Senior UI/UX Designer at Figma",
            userRole: "expert",
            avatar: "https://i.pravatar.cc/150?u=sarahj",
            fee: 899
        },
        {
            id: 202,
            name: "Alex Rivera",
            role: "Full-Stack Web Developer",
            userRole: "expert",
            avatar: "https://i.pravatar.cc/150?u=alexr",
            fee: 799
        },
        {
            id: 203,
            name: "Dr. Elena Rostova",
            role: "AI Research Scientist",
            userRole: "expert",
            avatar: "https://i.pravatar.cc/150?u=elena",
            fee: 1499
        },
        {
            id: 204,
            name: "Marcus Chen",
            role: "Backend Architect & Scalability Expert",
            userRole: "expert",
            avatar: "https://i.pravatar.cc/150?u=marcus",
            fee: 1199
        },
        {
            id: 205,
            name: "Chloe Vang",
            role: "Professional Photographer & Retoucher",
            userRole: "expert",
            avatar: "https://i.pravatar.cc/150?u=chloe",
            fee: 599
        },
        {
            id: 206,
            name: "David O'Connor",
            role: "Business Development & Growth Consultant",
            userRole: "expert",
            avatar: "https://i.pravatar.cc/150?u=davidoc",
            fee: 1299
        }
    ];

    const handleConsultClick = (expert) => {
        setSelectedExpert(expert);
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="network-container">
            <div className="network-content">
                <aside className="network-sidebar" ref={sidebarRef}>
                    <div className="network-sidebar-card">
                        <div className="sidebar-title">Manage Network</div>
                        {[
                            { id: 'connections', label: 'Connections', icon: 'users', count: 482 },
                            { id: 'experts', label: 'Expert Consultations', icon: 'user-tie' },
                            { id: 'messaging', label: 'Messaging', icon: 'comment-dots' },
                            { id: 'following', label: 'Following & Followers', icon: 'user-circle' },
                            { id: 'groups', label: 'Groups', icon: 'users', count: 12 },
                            { id: 'events', label: 'Events', icon: 'calendar-alt', count: 2 },
                            { id: 'newsletter', label: 'Newsletter', icon: 'newspaper', count: 5 },
                            { id: 'hashtags', label: 'Hashtags', icon: 'hashtag', count: 24 }
                        ].map(item => (
                            <div
                                key={item.id}
                                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => {
                                    if (item.id === 'connections') {
                                        navigate('/mynetwork');
                                    } else {
                                        navigate(`/mynetwork?tab=${item.id}`);
                                    }
                                }}
                            >
                                <Icon name={item.icon} />
                                <span>{item.label}</span>
                                {item.count && <span className="sidebar-count">{item.count}</span>}
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="network-main" ref={mainContentRef}>
                    {activeTab === 'messaging' ? (
                        <Messaging embedded={true} />
                    ) : activeTab === 'experts' ? (
                        <section className="suggestions-section">
                            <div className="modern-teal-badge">TOP EXPERTS FOR YOU</div>
                            <div className="suggestions-grid">
                                {expertsData.map((expert, index) => (
                                    <div
                                        key={expert.id}
                                        className="suggestion-card"
                                        ref={el => suggestionsRef.current[index] = el}
                                    >
                                        <div className="expert-banner"></div>
                                        <Avatar
                                            src={expert.avatar}
                                            alt={expert.name}
                                            role={expert.userRole}
                                            size={110}
                                            className="suggestion-avatar"
                                        />
                                        <div className="suggestion-info">
                                            <div className="suggestion-name">{expert.name}</div>
                                            <div className="suggestion-role">{expert.role}</div>
                                            <div className="expert-fee">₹{expert.fee} / session</div>
                                        </div>
                                        <button className="consult-btn" onClick={() => handleConsultClick(expert)}>
                                            <Icon name="comment" /> Consult Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <>
                            <section className="invitations-section">
                                <div className="section-header">
                                    <h2>Invitations</h2>
                                    <button className="see-all-btn">See all 2</button>
                                </div>
                                {invitations.map(invite => (
                                    <div key={invite.id} className="invitation-card">
                                        <Avatar
                                            src={invite.avatar}
                                            alt={invite.name}
                                            role={invite.userRole}
                                            size={56}
                                            className="invite-avatar"
                                        />
                                        <div className="invite-info">
                                            <div className="invite-name">{invite.name}</div>
                                            <div className="invite-role">{invite.role}</div>
                                        </div>
                                        <div className="invite-actions" style={{ display: 'flex', gap: '12px' }}>
                                            <button className="ignore-btn">Ignore</button>
                                            <button className="accept-btn">Accept</button>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            <section className="suggestions-section">
                                <div className="modern-teal-badge">NETWORK SUGGESTIONS FOR YOU</div>
                                <div className="suggestions-grid">
                                    {suggestions.map((person, index) => (
                                        <div
                                            key={person.id}
                                            className="suggestion-card"
                                            ref={el => suggestionsRef.current[index] = el}
                                        >
                                            <div className="suggestion-banner"></div>
                                            <Avatar
                                                src={person.avatar}
                                                alt={person.name}
                                                role={person.userRole}
                                                size={110}
                                                className="suggestion-avatar"
                                            />
                                            <div className="suggestion-info">
                                                <div className="suggestion-name">{person.name}</div>
                                                <div className="suggestion-role">{person.role}</div>
                                            </div>
                                            <button className="connect-btn">
                                                <Icon name="user-plus" /> Connect
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>

            {selectedExpert && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentSuccess={() => {
                        console.log("Consultation booked with", selectedExpert.name);
                        // Redirect to messaging or confirmation page logic here
                    }}
                    courseTitle={`Consultation with ${selectedExpert.name}`}
                    price={selectedExpert.fee}
                    itemType="Consultation"
                />
            )}
        </div>
    );
};

export default MyNetwork;
