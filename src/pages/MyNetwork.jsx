import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import PaymentModal from '../components/PaymentModal';
import ComingSoon from '../components/ComingSoon';
import './MyNetwork.css';
import Messaging from './Messaging';
import API from '../services/api';

// Tabs whose backend is fully implemented — everything else shows ComingSoon
// 'experts' tab disabled — no separate Consultant model
const ACTIVE_TABS = ['connections', /* 'experts', */ 'following', 'followers', 'messaging'];

const MyNetwork = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    // Conversations are fetched once in the Navbar (Messaging now lives in its dropdown)

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
        // sidebar is not rendered on the messaging tab
        if (sidebarRef.current) {
            tl.fromTo(sidebarRef.current,
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
        }
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
    const [connections, setConnections] = useState([]);
    const [connectionsCount, setConnectionsCount] = useState(0);
    const [experts, setExperts] = useState([]);
    const [expertsLoading, setExpertsLoading] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followingLoading, setFollowingLoading] = useState(false);
    const activeFollowingSubTab = activeTab === 'followers' ? 'followers' : 'following';

    const mapInvitation = (invite) => ({
        id: invite.id || invite._id,
        userId: invite.requester?.id || invite.requester?._id,
        name: invite.requester?.name || invite.requester?.consultant_name || "Anonymous",
        role: invite.requester?.headline || invite.requester?.industry || "Connectimi Member",
        userRole: invite.requester?.role || "professional",
        avatar: invite.requester?.profile_picture || invite.requester?.logo || "/images/default_profile_picture.png",
        accountType: invite.requester?.account_type || (invite.requester?.role === "professional" ? "personal" : "consultant"),
    });

    const mapSuggestion = (sug) => ({
        id: sug.id || sug._id,
        name: sug.name || sug.consultant_name || "Anonymous",
        role: sug.headline || sug.industry || "Connectimi Member",
        userRole: sug.role || "professional",
        avatar: sug.profile_picture || sug.logo || "/images/default_profile_picture.png",
        accountType: sug.account_type || (sug.role === "professional" ? "personal" : "consultant"),
    });

    const mapConnection = (conn) => ({
        id: conn.profile?.id || conn.profile?._id,
        name: conn.profile?.name || conn.profile?.consultant_name || "Anonymous",
        role: conn.profile?.headline || conn.profile?.industry || "Connectimi Member",
        userRole: conn.profile?.role || "professional",
        avatar: conn.profile?.profile_picture || conn.profile?.logo || "/images/default_profile_picture.png",
        accountType: conn.profile?.account_type || (conn.profile?.role === "professional" ? "personal" : "consultant"),
        connectionId: conn.connection_id,
        connectedAt: conn.connected_at
    });

    const mapExpert = (c) => ({
        id: c.id || c._id,
        name: c.consultant_name || "Consultant",
        role: c.current_position || c.industry || "Consultant",
        avatar: c.logo || c.profile_picture || `/images/default_profile_picture.png?u=${c.id || c._id}`,
        // Use the first active service price for the session fee display
        fee: c.services?.[0]?.price ?? null,
        accountType: "consultant",
    });

    // Load initial connection count on mount
    useEffect(() => {
        const loadInitialCount = async () => {
            try {
                const connRes = await API.get("/network/connections");
                setConnectionsCount(connRes.data.total || 0);
            } catch (err) {
                console.error("Failed to load initial connections count:", err.message);
            }
        };
        loadInitialCount();
    }, []);

    // Load active invitations, suggestions, and connections from API
    useEffect(() => {
        if (activeTab === 'connections') {
            const loadNetworkData = async () => {
                try {
                    const [inviteRes, sugRes, connRes] = await Promise.all([
                        API.get("/network/invitations"),
                        API.get("/network/suggestions"),
                        API.get("/network/connections")
                    ]);
                    setInvitations((inviteRes.data.invitations || []).map(mapInvitation));
                    setSuggestions((sugRes.data.suggestions || []).map(mapSuggestion));
                    setConnections((connRes.data.connections || []).map(mapConnection));
                    setConnectionsCount(connRes.data.total || 0);
                } catch (err) {
                    console.error("Failed to load network data:", err.message);
                }
            };
            loadNetworkData();
        }
    }, [activeTab]);

    // Load followers and following when tab is active
    useEffect(() => {
        if (activeTab === 'following' || activeTab === 'followers') {
            const loadFollowingData = async () => {
                setFollowingLoading(true);
                try {
                    const [followersRes, followingRes] = await Promise.all([
                        API.get("/network/followers"),
                        API.get("/network/following")
                    ]);

                    const mapFollowerOrFollowing = (item) => ({
                        id: item.id || item._id,
                        name: item.name || item.consultant_name || "Anonymous",
                        role: item.headline || item.industry || "Connectimi Member",
                        avatar: item.profile_picture || item.logo || "/images/default_profile_picture.png",
                        accountType: item._type || (item.role === "professional" ? "personal" : "consultant"),
                        userRole: item.role || "professional"
                    });

                    setFollowers((followersRes.data.followers || []).map(mapFollowerOrFollowing));
                    setFollowing((followingRes.data.following || []).map(mapFollowerOrFollowing));
                } catch (err) {
                    console.error("Failed to load following data:", err.message);
                } finally {
                    setFollowingLoading(false);
                }
            };
            loadFollowingData();
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
            // Reload connections after accepting an invitation
            const connRes = await API.get("/network/connections");
            setConnections(connRes.data.connections.map(mapConnection));
            setConnectionsCount(connRes.data.total || 0);
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

    const handleRemoveConnection = async (targetId) => {
        try {
            await API.delete(`/network/remove/${targetId}`);
            setConnections(connections.filter(c => c.id !== targetId));
            setConnectionsCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to remove connection:", err.message);
        }
    };

    const handleToggleFollow = async (targetId, targetType) => {
        try {
            await API.post(`/network/follow/${targetId}/${targetType}`);
            // Update following list locally
            if (following.some(f => f.id === targetId)) {
                setFollowing(following.filter(f => f.id !== targetId));
            } else {
                // Fetch updated following list
                const followingRes = await API.get("/network/following");
                const mapFollowerOrFollowing = (item) => ({
                    id: item.id || item._id,
                    name: item.name || item.consultant_name || "Anonymous",
                    role: item.headline || item.industry || "Connectimi Member",
                    avatar: item.profile_picture || item.logo || "/images/default_profile_picture.png",
                    accountType: item._type || (item.role === "professional" ? "personal" : "consultant"),
                    userRole: item.role || "professional"
                });
                setFollowing((followingRes.data.following || []).map(mapFollowerOrFollowing));
            }
        } catch (err) {
            console.error("Failed to toggle follow:", err.message);
        }
    };

    const handleConsultClick = (expert) => {
        setSelectedExpert(expert);
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="network-container">
            <div className="network-content">
                {activeTab !== 'messaging' && (
                <aside className="network-sidebar" ref={sidebarRef}>
                    <div className="network-sidebar-card">
                        <div className="sidebar-title">Manage Network</div>
                        {[
                            { id: 'connections', label: 'Connections', icon: 'user-friends', count: connectionsCount },
                            // Expert Consultations tab disabled — no separate Consultant model
                            // { id: 'experts', label: 'Expert Consultations', icon: 'user-tie' },
                            // Messaging moved to the navbar profile dropdown
                            { id: 'following', label: 'Following', icon: 'user-circle' },
                            { id: 'followers', label: 'Followers', icon: 'eye' }
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
                                {item.count !== undefined && item.count !== null && <span className="sidebar-count">{item.count}</span>}
                            </div>
                        ))}
                    </div>
                </aside>
                )}

                <main className="network-main" ref={mainContentRef}>
                    {!ACTIVE_TABS.includes(activeTab) ? (
                        <ComingSoon />
                    ) : activeTab === 'messaging' ? (
                        <Messaging
                            embedded={true}
                            contactId={new URLSearchParams(location.search).get('contactId')}
                            initialPartner={location.state?.partner}
                        />
                    ) : (activeTab === 'following' || activeTab === 'followers') ? (
                        <section className="suggestions-section">
                            {followingLoading ? (
                                <p style={{ color: 'var(--text-muted)', padding: '32px', textAlign: 'center' }}>Loading network details…</p>
                            ) : activeFollowingSubTab === 'following' ? (
                                following.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', padding: '32px', textAlign: 'center' }}>You are not following anyone yet.</p>
                                ) : (
                                    <div className="suggestions-grid">
                                        {following.map((person, index) => (
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
                                                    onClick={() => navigate(`/profile/${person.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <div className="suggestion-info" onClick={() => navigate(`/profile/${person.id}`)} style={{ cursor: 'pointer' }}>
                                                    <div className="suggestion-name">{person.name}</div>
                                                    <div className="suggestion-role">{person.role}</div>
                                                </div>
                                                <button className="connect-btn" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => handleToggleFollow(person.id, person.accountType)}>
                                                    <Icon name="user-times" /> Unfollow
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                followers.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', padding: '32px', textAlign: 'center' }}>No followers yet.</p>
                                ) : (
                                    <div className="suggestions-grid">
                                        {followers.map((person, index) => (
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
                                                    onClick={() => navigate(`/profile/${person.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <div className="suggestion-info" onClick={() => navigate(`/profile/${person.id}`)} style={{ cursor: 'pointer' }}>
                                                    <div className="suggestion-name">{person.name}</div>
                                                    <div className="suggestion-role">{person.role}</div>
                                                </div>
                                                <button
                                                    className="connect-btn"
                                                    onClick={() => handleToggleFollow(person.id, person.accountType)}
                                                    style={{ background: following.some(f => f.id === person.id) ? 'rgba(255, 255, 255, 0.05)' : 'var(--emerald-500)', color: 'white' }}
                                                >
                                                    <Icon name={following.some(f => f.id === person.id) ? "user-times" : "user-plus"} />
                                                    {following.some(f => f.id === person.id) ? " Unfollow" : " Follow Back"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </section>
                    ) : (
                        <>
                            {invitations.length > 0 && (
                                <section className="invitations-section" style={{ marginBottom: '30px' }}>
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
                                                onClick={() => navigate(`/profile/${invite.userId}`)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <div className="invite-info" onClick={() => navigate(`/profile/${invite.userId}`)} style={{ cursor: 'pointer' }}>
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
                            )}

                            {connections.length > 0 && (
                                <section className="connections-section" style={{ marginBottom: '40px' }}>
                                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <h2>My Connections</h2>
                                        <span className="sidebar-count" style={{ background: 'var(--emerald-500)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{connections.length}</span>
                                    </div>
                                    <div className="suggestions-grid">
                                        {connections.map((conn) => (
                                            <div key={conn.id} className="suggestion-card">
                                                <div className="suggestion-banner"></div>
                                                <Avatar
                                                    src={conn.avatar}
                                                    alt={conn.name}
                                                    role={conn.userRole}
                                                    size={110}
                                                    className="suggestion-avatar"
                                                    onClick={() => navigate(`/profile/${conn.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <div className="suggestion-info" onClick={() => navigate(`/profile/${conn.id}`)} style={{ cursor: 'pointer' }}>
                                                    <div className="suggestion-name">{conn.name}</div>
                                                    <div className="suggestion-role">{conn.role}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: 'auto', padding: '0 15px 15px' }}>
                                                    <button className="ignore-btn" style={{ flex: 1, padding: '8px 0', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => handleRemoveConnection(conn.id)}>
                                                        Disconnect
                                                    </button>
                                                    <button
                                                        className="accept-btn"
                                                        style={{ flex: 1, padding: '8px 0', background: 'var(--emerald-500)', color: 'white' }}
                                                        onClick={() => navigate(`/mynetwork?tab=messaging&contactId=${conn.id}`, { state: { partner: { id: conn.id, name: conn.name, avatar: conn.avatar, role: conn.role } } })}
                                                    >
                                                        Message
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section className="suggestions-section">
                                <div className="modern-teal-badge">NETWORK SUGGESTIONS FOR YOU</div>
                                {suggestions.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>No new suggestions for now.</p>
                                ) : (
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
                                                    onClick={() => navigate(`/profile/${person.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <div className="suggestion-info" onClick={() => navigate(`/profile/${person.id}`)} style={{ cursor: 'pointer' }}>
                                                    <div className="suggestion-name">{person.name}</div>
                                                    <div className="suggestion-role">{person.role}</div>
                                                </div>
                                                <button className="connect-btn" onClick={() => handleSendConnect(person.id, person.accountType)}>
                                                    <Icon name="user-plus" /> Connect
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
