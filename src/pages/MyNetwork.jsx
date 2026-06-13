import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import PaymentModal from '../components/PaymentModal';
import './MyNetwork.css';
import Messaging from './Messaging';
import API from '../services/api';

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
        // Reset stale refs from the previous tab before the new cards mount
        suggestionsRef.current = [];

        if (activeTab !== 'messaging') {
            // Small delay so React has time to mount the new tab's cards
            const id = setTimeout(() => {
                const validRefs = suggestionsRef.current.filter(Boolean);
                if (validRefs.length > 0) {
                    gsap.fromTo(validRefs,
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
                    );
                }
            }, 50);
            return () => clearTimeout(id);
        }
    }, [activeTab]);

    const [invitations, setInvitations] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [experts, setExperts] = useState([]);
    const [expertsLoading, setExpertsLoading] = useState(false);

    const mapInvitation = (invite) => ({
        id: invite._id,
        name: invite.requester?.full_name || "Anonymous",
        role: invite.requester?.headline || "Connectimi Member",
        userRole: invite.requester?.role || "professional",
        avatar: invite.requester?.profile_picture || "https://i.pravatar.cc/150",
        accountType: invite.requester.account_type || undefined,
    });

    const mapSuggestion = (sug) => ({
        id: sug._id,
        name: sug.full_name || "Anonymous",
        role: sug.headline || "Connectimi Member",
        userRole: sug.role || "professional",
        avatar: sug.profile_picture || "https://i.pravatar.cc/150",
        accountType: sug.account_type || undefined,
    });

    const mapExpert = (c) => ({
        id: c._id,
        name: c.consultant_name || "Consultant",
        role: c.current_position || c.industry || "Consultant",
        avatar: c.logo || `https://i.pravatar.cc/150?u=${c._id}`,
        // Use the first active service price for the session fee display
        fee: c.services?.[0]?.price ?? null,
        accountType: "consultant",
    });

    // Load active invitations and suggestions from API
    useEffect(() => {
        if (activeTab === 'connections') {
            const loadNetworkData = async () => {
                try {
                    const [inviteRes, sugRes] = await Promise.all([
                        API.get("/network/invitations"),
                        API.get("/network/suggestions")
                    ]);
                    setInvitations(inviteRes.data.invitations.map(mapInvitation));
                    setSuggestions(sugRes.data.suggestions.map(mapSuggestion));
                } catch (err) {
                    console.error("Failed to load network data:", err.message);
                }
            };
            loadNetworkData();
        }
    }, [activeTab]);

    // Load suggested consultants when the experts tab is active
    useEffect(() => {
        if (activeTab === 'experts') {
            const loadExperts = async () => {
                setExpertsLoading(true);
                try {
                    const res = await API.get("/network/suggested-consultants");
                    setExperts(res.data.suggestions.map(mapExpert));
                } catch (err) {
                    console.error("Failed to load expert consultants:", err.message);
                } finally {
                    setExpertsLoading(false);
                }
            };
            loadExperts();
        }
    }, [activeTab]);

    const handleAcceptInvite = async (connectionId) => {
        try {
            await API.put(`/network/respond/${connectionId}`, { action: "accept" });
            setInvitations(invitations.filter(i => i.id !== connectionId));
        } catch (err) {
            console.error("Failed to accept connection:", err.message);
        }
    };

    const handleDeclineInvite = async (connectionId) => {
        try {
            await API.put(`/network/respond/${connectionId}`, { action: "decline" });
            setInvitations(invitations.filter(i => i.id !== connectionId));
        } catch (err) {
            console.error("Failed to decline connection:", err.message);
        }
    };

    const handleSendConnect = async (userId, userType) => {
        try {
            await API.post(`/network/connect/${userId}/${userType}`);
            setSuggestions(suggestions.filter(s => s.id !== userId));
        } catch (err) {
            console.error("Failed to send connect request:", err.message);
        }
    };


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
                            <div className="modern-teal-badge">TOP EXPERT CONSULTANTS FOR YOU</div>
                            {expertsLoading ? (
                                <p style={{ color: 'var(--text-muted)', padding: '32px', textAlign: 'center' }}>Loading consultants…</p>
                            ) : experts.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', padding: '32px', textAlign: 'center' }}>No expert consultants found yet.</p>
                            ) : (
                                <div className="suggestions-grid">
                                    {experts.map((expert, index) => (
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
                                                {expert.fee != null && (
                                                    <div className="expert-fee">₹{expert.fee} / session</div>
                                                )}
                                            </div>
                                            <button className="consult-btn" onClick={() => handleConsultClick(expert)}>
                                                <Icon name="comment" /> Consult Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ) : (
                        <>
                            <section className="invitations-section">
                                <div className="section-header">
                                    <h2>Invitations</h2>
                                    <button className="see-all-btn">See all {invitations.length}</button>
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
                                            <button className="ignore-btn" onClick={() => handleDeclineInvite(invite.id)}>Ignore</button>
                                            <button className="accept-btn" onClick={() => handleAcceptInvite(invite.id)}>Accept</button>
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
                                            <button className="connect-btn" onClick={() => handleSendConnect(person.id, person.accountType)}>
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
