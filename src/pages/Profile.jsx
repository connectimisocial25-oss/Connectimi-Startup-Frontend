import React, { useState, useEffect, useRef, useCallback } from "react";
import Icon from "../components/Icon";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./Profile.css";
import CVModal from "../components/CVModal";
import EditForm from "../components/editProfile";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { transformProfileToFrontend } from "../utils/adapters";

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80";
const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const { user: authUser, setUser } = useAuth();
  const isOwnProfile = !userId || userId === authUser?.id;
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [connectionId, setConnectionId] = useState(null);
  const containerRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  // State for user profile data
  const [profileData, setProfileData] = useState({
    role: "professional",
    name: "Alex Johnson",
    headline: "Senior Software Engineer at TechCorp",
    location: "San Francisco, California",
    connections: 543,
    profileViews: 1287,
    postImpressions: 3256,
    about: "Passionate software engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.",
    experience: [],
    projects: [],
    education: [],
    skills: [],
    website: "https://alexjohnson.dev",
    profileImage: DEFAULT_PROFILE_IMG,
    bannerImage: DEFAULT_BANNER,
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
  });

  const isFollowing = authUser?.following?.includes(profileData.id);

  const [isEditing, setIsEditing] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [showCV, setShowCV] = useState(false);

  // Posts Feed State
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState("");

  // Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [profileSummary, setProfileSummary] = useState("");
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const [editData, setEditData] = useState({
    name: "",
    headline: "",
    location: "",
    connections: 0,
    profileViews: 0,
    postImpressions: 0,
    about: "",
    experience: [],
    projects: [],
    education: [],
    skills: [],
    website: "",
    profileImage: "",
    bannerImage: "",
    email: "",
    phone: "",
    newSkill: "",
    newExperience: { title: "", company: "", startDate: "", endDate: "", location: "", description: "", current: false },
    newProject: { title: "", description: "", link: "" },
    newEducation: { school: "", degree: "", field: "", startYear: "", endYear: "", description: "" },
  });

  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current && isSpeechSupported) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [isSpeechSupported]);

  const cleanupPreviewURLs = useCallback(() => {
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    if (bannerPreview && bannerPreview.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
  }, [imagePreview, bannerPreview]);

  useEffect(() => {
    isMountedRef.current = true;
    initializeSpeechSynthesis();

    return () => {
      isMountedRef.current = false;
      stopSpeaking();
      cleanupPreviewURLs();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (speechSynthesisRef.current) speechSynthesisRef.current.onvoiceschanged = null;
    };
  }, []);

  // GSAP animation triggered when loading finishes
  useEffect(() => {
    if (!profileLoading && !profileError) {
      const ctx = gsap.context(() => {
        gsap.from(".profile-header-card", { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
        gsap.fromTo(".gsap-reveal",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "transform, y"
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [profileLoading, profileError]);

  // Trigger fetchProfileData when userId or authUser changes
  useEffect(() => {
    fetchProfileData();
  }, [userId, authUser]);

  // Sync profileData whenever authUser is updated in context (only if own profile)
  useEffect(() => {
    if (authUser && isOwnProfile) {
      setProfileData((prev) => ({
        ...prev,
        ...authUser,
        name: authUser.name || `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim(),
        profileImage: authUser.profileImage || DEFAULT_PROFILE_IMG,
        bannerImage: authUser.bannerImage || DEFAULT_BANNER,
        experience: authUser.experience || prev.experience,
        projects: authUser.projects || prev.projects,
        education: authUser.education || prev.education,
        skills: authUser.skills || prev.skills,
      }));
    }
  }, [authUser, isOwnProfile]);

  const fetchUserPosts = async (targetId) => {
    if (!targetId) return;
    setPostsLoading(true);
    setPostsError("");
    try {
      const res = await API.get(`/posts/user/${targetId}`);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
      setPostsError("Failed to load posts.");
    } finally {
      setPostsLoading(false);
    }
  };

  const isLikedByMe = (likesArray) => {
    if (!authUser?.id || !likesArray) return false;
    return likesArray.some(like => (like._id || like).toString() === authUser.id.toString());
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await API.post(`/posts/${postId}/like`);
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          const isLiked = res.data.liked;
          const currentUserId = authUser?.id;
          let newLikes = [...(post.likes || [])];
          if (isLiked) {
            if (currentUserId && !newLikes.some(id => (id._id || id).toString() === currentUserId.toString())) {
              newLikes.push(currentUserId);
            }
          } else {
            if (currentUserId) {
              newLikes = newLikes.filter(id => (id._id || id).toString() !== currentUserId.toString());
            }
          }
          return {
            ...post,
            likes: newLikes
          };
        }
        return post;
      }));
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert(err.response?.data?.error || "Failed to delete post.");
    }
  };

  const fetchProfileData = async () => {
    if (isOwnProfile) {
      if (authUser) {
        setProfileData({
          ...authUser,
          name: authUser.name || `${authUser.firstName} ${authUser.lastName}`,
          profileImage: authUser.profileImage || DEFAULT_PROFILE_IMG,
          bannerImage: authUser.bannerImage || DEFAULT_BANNER,
          experience: authUser.experience || [],
          projects: authUser.projects || [],
          education: authUser.education || [],
          skills: authUser.skills || [],
          connections: authUser.connections || 543,
          profileViews: authUser.profileViews || 1287,
          postImpressions: authUser.postImpressions || 3256,
        });
        fetchUserPosts(authUser.id);
      }
      return;
    }

    setProfileLoading(true);
    setProfileError("");
    try {
      let publicUser;
      let connStatus = "none";
      let connId = null;
      try {
        const res = await API.get(`/profile/${userId}`);
        publicUser = res.data.user;
        connStatus = res.data.connectionStatus || "none";
        connId = res.data.connectionId || null;
      } catch (err) {
        if (err.response?.status === 404) {
          const res = await API.get(`/consultant/profile/${userId}`);
          publicUser = res.data.consultant;
          connStatus = res.data.connectionStatus || "none";
          connId = res.data.connectionId || null;
        } else {
          throw err;
        }
      }

      if (!publicUser) {
        throw new Error("User profile not found");
      }

      const adapted = transformProfileToFrontend(publicUser);
      setProfileData({
        ...adapted,
        connections: publicUser.connections || 0,
        profileViews: publicUser.profile_views || 0,
        postImpressions: publicUser.post_impressions || 0,
      });
      setConnectionStatus(connStatus);
      setConnectionId(connId);
      fetchUserPosts(publicUser._id || publicUser.id);
    } catch (err) {
      console.error("Failed to load public profile:", err);
      setProfileError("Profile not found or error loading profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const initializeSpeechSynthesis = () => {
    if ("speechSynthesis" in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      setIsSpeechSupported(true);
      const loadVoices = () => {
        if (!isMountedRef.current) return;
        const voices = speechSynthesisRef.current.getVoices();
        setAvailableVoices(voices);
        const preferredVoice = voices.find(v => v.lang.includes("en") && (v.name.includes("Google") || v.name.includes("Samantha"))) || voices[0];
        if (preferredVoice) setSelectedVoice(preferredVoice);
      };
      loadVoices();
      speechSynthesisRef.current.onvoiceschanged = loadVoices;
    } else {
      setIsSpeechSupported(false);
    }
  };

  const generateProfileSummary = async () => {
    if (!isMountedRef.current) return;
    setIsSummarizing(true);
    try {
      const summary = `Meet ${profileData.name}, ${profileData.headline}. Based in ${profileData.location}, ${profileData.name.split(" ")[0]} has extensive experience in ${profileData.skills.slice(0, 3).join(", ")}. ${profileData.about}`;
      setProfileSummary(summary);
      if (isSpeechSupported) speakText(summary);
    } finally {
      setIsSummarizing(false);
    }
  };

  const speakText = (text) => {
    if (!speechSynthesisRef.current || !isSpeechSupported) return;
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = voiceSpeed;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      let startTime = Date.now();
      const estimatedDuration = (text.length / 150) * 60 * 1000;
      progressIntervalRef.current = setInterval(() => {
        if (isSpeaking && !isPaused) {
          const elapsed = Date.now() - startTime;
          setSpeechProgress(Math.min((elapsed / estimatedDuration) * 100, 100));
        }
      }, 100);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    speechSynthesisRef.current.speak(utterance);
  };

  const pauseSpeaking = () => {
    if (speechSynthesisRef.current && isSpeaking) {
      speechSynthesisRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if (speechSynthesisRef.current && isPaused) {
      speechSynthesisRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleInputChange = (field, value) => setEditData(prev => ({ ...prev, [field]: value }));

  const handleExperienceChange = (index, field, value) => {
    const updated = [...editData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setEditData(prev => ({ ...prev, experience: updated }));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...editData.education];
    updated[index] = { ...updated[index], [field]: value };
    setEditData(prev => ({ ...prev, education: updated }));
  };

  const handleProjectChange = (index, field, value) => {
    const updated = [...editData.projects];
    updated[index] = { ...updated[index], [field]: value };
    setEditData(prev => ({ ...prev, projects: updated }));
  };

  const addExperience = () => {
    if (editData.newExperience.title && editData.newExperience.company) {
      setEditData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...prev.newExperience, id: Date.now() }],
        newExperience: { title: "", company: "", startDate: "", endDate: "", location: "", description: "", current: false }
      }));
    }
  };

  const addEducation = () => {
    if (editData.newEducation.school && editData.newEducation.degree) {
      setEditData(prev => ({
        ...prev,
        education: [...prev.education, { ...prev.newEducation, id: Date.now() }],
        newEducation: { school: "", degree: "", field: "", startYear: "", endYear: "", description: "" }
      }));
    }
  };

  const addProject = () => {
    if (editData.newProject.title) {
      setEditData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...prev.newProject, id: Date.now() }],
        newProject: { title: "", description: "", link: "" }
      }));
    }
  };

  const addSkill = () => {
    if (editData.newSkill.trim()) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ""
      }));
    }
  };

  const removeExperience = (index) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const removeEducation = (index) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeProject = (index) => {
    setEditData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const removeSkill = (index) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsUploading(true);
    const {
      newSkill, newExperience, newProject, newEducation,
      ...cleanData
    } = editData;
    try {
      await updateAuthUser(cleanData);
      setIsEditing(false);
      cleanupPreviewURLs();
      setImagePreview("");
      setBannerPreview("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Profile Sections Renderers
  const renderExperience = () => (
    <div className="glass-panel gsap-reveal">
      <h3 className="panel-title"><Icon name="building" /> Experience</h3>
      {profileData.experience.length > 0 ? (
        profileData.experience.map((exp, i) => (
          <div key={i} className="exp-item">
            <div className="exp-role">{exp.title}</div>
            <div className="exp-org">{exp.company}</div>
            <div className="exp-meta">{exp.startDate} - {exp.endDate} · {exp.location}</div>
            {exp.description && <div className="exp-desc">{exp.description}</div>}
          </div>
        ))
      ) : (
        <p className="empty-msg">No experience listed</p>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="glass-panel gsap-reveal">
      <h3 className="panel-title"><Icon name="folder" /> Projects</h3>
      {profileData.projects.length > 0 ? (
        profileData.projects.map((proj, i) => (
          <div key={i} className="exp-item">
            <div className="exp-role">{proj.title}</div>
            {proj.link && <a href={proj.link} className="exp-org" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
            {proj.description && <div className="exp-desc">{proj.description}</div>}
          </div>
        ))
      ) : (
        <p className="empty-msg">No projects listed</p>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="glass-panel gsap-reveal">
      <h3 className="panel-title"><Icon name="graduation-cap" /> Education</h3>
      {profileData.education.length > 0 ? (
        profileData.education.map((edu, i) => (
          <div key={i} className="exp-item">
            <div className="exp-role">{edu.school}</div>
            <div className="exp-org">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</div>
            <div className="exp-meta">{edu.startYear} - {edu.endYear}</div>
            {edu.description && <div className="exp-desc">{edu.description}</div>}
          </div>
        ))
      ) : (
        <p className="empty-msg">No education listed</p>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="glass-panel gsap-reveal">
      <h3 className="panel-title"><Icon name="star" /> Skills</h3>
      <div className="skills-flex">
        {profileData.skills.map((skill, i) => (
          <span key={i} className="skill-chip">{skill}</span>
        ))}
      </div>
    </div>
  );

  const renderPosts = () => {
    if (postsLoading) {
      return (
        <div className="glass-panel posts-section gsap-reveal">
          <h3 className="panel-title"><Icon name="newspaper" /> Latest Posts</h3>
          <div className="posts-loading-container" style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
            <div className="loading-spinner" style={{ border: '3px solid rgba(255, 255, 255, 0.1)', borderLeftColor: 'var(--primary-emerald)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
          </div>
        </div>
      );
    }

    if (postsError) {
      return (
        <div className="glass-panel posts-section gsap-reveal">
          <h3 className="panel-title"><Icon name="newspaper" /> Latest Posts</h3>
          <p className="error-msg">{postsError}</p>
        </div>
      );
    }

    return (
      <div className="glass-panel posts-section gsap-reveal">
        <h3 className="panel-title">
          <Icon name="newspaper" /> Latest Posts
        </h3>

        {posts.length > 0 ? (
          <div className="profile-posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {posts.map((post) => {
              const liked = isLikedByMe(post.likes);
              const authorName = post.author?.full_name || profileData.name || "User";
              const authorHeadline = post.author?.headline || profileData.headline || "";
              const authorImg = post.author?.profile_picture || profileData.profileImage || DEFAULT_PROFILE_IMG;
              const hasMedia = post.media && post.media.length > 0;
              const formattedDate = post.created_at ? new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

              return (
                <div key={post._id} className="profile-post-card">
                  <div className="post-card-header">
                    <img src={authorImg} alt={authorName} className="post-author-img" />
                    <div className="post-author-info">
                      <h4 className="post-author-name">{authorName}</h4>
                      <p className="post-author-headline">{authorHeadline}</p>
                      <p className="post-date"><Icon name="clock" size={12} /> {formattedDate}</p>
                    </div>
                    {isOwnProfile && (
                      <button 
                        className="post-delete-btn" 
                        title="Delete post" 
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    )}
                  </div>

                  <div className="post-card-body">
                    <p className="post-content-text">{post.content}</p>
                    {hasMedia && (
                      <div className="post-media-wrapper">
                        {post.media[0].media_type === "video" ? (
                          <video src={post.media[0].url} controls className="post-media-element" />
                        ) : (
                          <img src={post.media[0].url} alt="Post Attachment" className="post-media-element" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="post-card-footer">
                    <button 
                      className={`post-action-btn like-btn ${liked ? 'active' : ''}`}
                      onClick={() => handleLikePost(post._id)}
                    >
                      <Icon name="thumbs-up" size={14} />
                      <span>{liked ? "Liked" : "Like"} ({post.likes?.length || 0})</span>
                    </button>
                    <button 
                      className="post-action-btn comment-btn"
                      onClick={() => navigate("/home")}
                      title="View comments in feed"
                    >
                      <Icon name="comment" size={14} />
                      <span>Comments ({post.comments?.length || 0})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="posts-empty-state">
            <div className="empty-icon"><Icon name="newspaper" size={32} /></div>
            <p className="empty-text">No posts published yet.</p>
            {isOwnProfile && (
              <button className="profile-btn primary" onClick={() => navigate("/home")}>
                Share your first post
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleConnect = async () => {
    try {
      const res = await API.post(`/network/connect/${profileData.id}/${profileData.accountType}`);
      setConnectionStatus("pending");
      if (res.data.connection?.id || res.data.connection?._id) {
        setConnectionId(res.data.connection.id || res.data.connection._id);
      }
      alert("Connection request sent successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send connection request.");
    }
  };

  const handleAcceptConnection = async () => {
    if (!connectionId) return;
    try {
      await API.put(`/network/respond/${connectionId}`, { action: "accept" });
      setConnectionStatus("accepted");
      alert("Connection request accepted!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to accept connection request.");
    }
  };

  const handleToggleFollow = async () => {
    try {
      const res = await API.post(`/network/follow/${profileData.id}/${profileData.accountType}`);
      const isNowFollowing = res.data.following;
      
      setUser(prev => {
        const following = prev.following || [];
        const updatedFollowing = isNowFollowing
          ? [...following, profileData.id]
          : following.filter(id => id !== profileData.id);
        
        const updatedUser = { ...prev, following: updatedFollowing };
        localStorage.setItem("connectimi_user", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      alert(err.response?.data?.error || "Failed to toggle follow state.");
    }
  };

  if (profileLoading) {
    return (
      <div className="profile-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading-spinner" style={{ border: '4px solid rgba(255, 255, 255, 0.1)', borderLeftColor: 'var(--emerald-500)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="profile-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', gap: '20px' }}>
        <Icon name="exclamation-circle" size={48} style={{ color: 'var(--error)' }} />
        <h2>{profileError}</h2>
        <button className="profile-btn primary" onClick={() => navigate("/home")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="profile-container" ref={containerRef}>
      <div className="profile-header-card">
        <div className="banner-area">
          <img src={profileData.bannerImage} alt="Banner" className="banner-image" />
          <div className="profile-avatar-container">
            <img src={profileData.profileImage} alt={profileData.name} className="avatar-squircle" />
          </div>
        </div>

        <div className="profile-main-info">
          <div className="info-content">
            <h1>{profileData.name}</h1>
            <p className="headline">{profileData.headline}</p>
            <div className="meta-info">
              <span className="meta-item"><Icon name="map-marker" /> {profileData.location}</span>
              <span className="meta-item"><Icon name="link" /> <a href={profileData.website}>{profileData.website}</a></span>
            </div>
            <div className="profile-stats-bar">
              <div className="stat-box">
                <span className="stat-value">{profileData.connections}+</span>
                <span className="stat-label">Connections</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{profileData.profileViews}</span>
                <span className="stat-label">Profile Views</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {!isOwnProfile && (
              <>
                {(connectionStatus === "none" || connectionStatus === "declined") && (
                  <button className="profile-btn primary" onClick={handleConnect}>Connect</button>
                )}
                {connectionStatus === "pending" && (
                  <button className="profile-btn" disabled style={{ opacity: 0.7, cursor: "not-allowed" }}>Pending</button>
                )}
                {connectionStatus === "incoming_request" && (
                  <button className="profile-btn primary" onClick={handleAcceptConnection}>Accept Request</button>
                )}
                {connectionStatus === "accepted" && (
                  <button className="profile-btn primary" onClick={() => navigate("/messaging")}>Message</button>
                )}
                <button 
                  className={`profile-btn ${isFollowing ? '' : 'primary'}`} 
                  onClick={handleToggleFollow}
                  style={isFollowing ? { background: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' } : {}}
                >
                  <Icon name={isFollowing ? "user-times" : "user-plus"} />
                  {isFollowing ? " Unfollow" : " Follow"}
                </button>
              </>
            )}
            <button className="profile-btn" onClick={() => setShowCV(true)}>
              <Icon name="file-alt" /> CV Profile
            </button>
            <button className="profile-btn" onClick={() => profileSummary ? speakText(profileSummary) : generateProfileSummary()} disabled={isSummarizing}>
              <Icon name="play" /> AI Podcast
            </button>
            {isOwnProfile && (
              <button className="profile-btn" onClick={() => {
                setEditData({
                  ...profileData,
                  newSkill: "",
                  newExperience: { title: "", company: "", startDate: "", endDate: "", location: "", description: "", current: false },
                  newProject: { title: "", description: "", link: "" },
                  newEducation: { school: "", degree: "", field: "", startYear: "", endYear: "", description: "" },
                });
                setIsEditing(true);
              }}>
                <Icon name="edit" /> Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid-layout">
        <div className="main-col">
          <div className="glass-panel gsap-reveal">
            <h3 className="panel-title">About</h3>
            <p className="about-text">{profileData.about}</p>
          </div>
          {renderExperience()}
          {renderProjects()}
          {renderEducation()}
          {renderSkills()}
          {renderPosts()}
        </div>

        <div className="side-col">
          <div className="glass-panel ai-card gsap-reveal">
            <h3 className="panel-title"><Icon name="robot" /> Profile Podcast</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Listen to an AI-generated summary of this professional profile.
            </p>

            <div className="podcast-ui" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <div className="podcast-progress" style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ width: `${speechProgress}%`, height: '100%', background: 'var(--primary-emerald)', transition: 'width 0.1s linear' }}></div>
              </div>

              <div className="podcast-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {isSpeaking && !isPaused ? (
                  <button className="profile-btn" onClick={pauseSpeaking}><Icon name="pause" /> Pause</button>
                ) : (
                  <button className="profile-btn primary" onClick={() => profileSummary ? speakText(profileSummary) : generateProfileSummary()} disabled={isSummarizing}>
                    <Icon name="play" /> {isPaused ? "Resume" : "Listen"}
                  </button>
                )}
                <button className="profile-btn" onClick={stopSpeaking} disabled={!isSpeaking && !isPaused}><Icon name="stop" /> Stop</button>
              </div>
            </div>
          </div>

          <div className="glass-panel gsap-reveal">
            <h3 className="panel-title"><Icon name="trending-up" /> Analytics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Post Impressions</span>
                <span style={{ fontWeight: '700' }}>{profileData.postImpressions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Search Appearances</span>
                <span style={{ fontWeight: '700' }}>99+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCV && <CVModal profileData={profileData} onClose={() => setShowCV(false)} />}

      {isEditing && (
      <EditForm
          editData={editData}
          setEditData={setEditData}
          handleInputChange={handleInputChange}
          handleExperienceChange={handleExperienceChange}
          handleEducationChange={handleEducationChange}
          handleProjectChange={handleProjectChange}
          addExperience={addExperience}
          addEducation={addEducation}
          addProject={addProject}
          addSkill={addSkill}
          removeExperience={removeExperience}
          removeEducation={removeEducation}
          removeProject={removeProject}
          removeSkill={removeSkill}
          handleSave={handleSave}
          isUploading={isUploading}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          bannerPreview={bannerPreview}
          setBannerPreview={setBannerPreview}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default Profile;