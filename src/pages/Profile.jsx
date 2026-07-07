import React, { useState, useEffect, useRef, useCallback } from "react";
import Icon from "../components/Icon";
import { useNavigate, useLocation } from "react-router-dom";
import "./Profile.css";
import CVModal from "../components/CVModal";
import EditForm from "../components/editProfile";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext";

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80";
const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const [isEditing, setIsEditing] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [showCV, setShowCV] = useState(false);

  // Media Section State
  const [activeMediaTab, setActiveMediaTab] = useState("photos");
  const [mediaItems, setMediaItems] = useState({
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80", caption: "Team Hackathon 2024" },
      { id: 2, url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80", caption: "Conference Talk" },
      { id: 3, url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80", caption: "Product Launch" },
      { id: 4, url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80", caption: "Remote Work Setup" },
      { id: 5, url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80", caption: "Workshop Session" },
      { id: 6, url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80", caption: "Team Outing" },
    ],
    videos: [
      { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80", caption: "Product Demo Walkthrough" },
      { id: 2, url: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", caption: "Tech Talk at DevConf" },
    ]
  });
  const [lightbox, setLightbox] = useState({ open: false, item: null, type: null });
  const mediaUploadRef = useRef(null);

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
    fetchProfileData();
    initializeSpeechSynthesis();

    // GSAP Entrance
    const ctx = gsap.context(() => {
      gsap.from(".profile-header-card", { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
      gsap.to(".gsap-reveal", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.3,
        clearProps: "transform, y" // Keep opacity: 1, clear only positioning to prevent layout issues
      });
    }, containerRef);

    return () => {
      isMountedRef.current = false;
      stopSpeaking();
      cleanupPreviewURLs();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (speechSynthesisRef.current) speechSynthesisRef.current.onvoiceschanged = null;
      ctx.revert();
    };
  }, []); // Empty dependency array to ensure animation runs only once on mount

  const { user: authUser, updateUser: updateAuthUser } = useAuth();

  // Sync profileData whenever authUser is updated in context (e.g., after a save)
  useEffect(() => {
    if (authUser) {
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
  }, [authUser]);

  const fetchProfileData = async () => {
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
      return;
    }

    // Simulated API call (keeping the original mock structure)
    const mockData = {
      name: "Alex Johnson",
      role: "professional",
      headline: "Senior Software Engineer at TechCorp",
      location: "San Francisco, California",
      connections: 543,
      profileViews: 1287,
      postImpressions: 3256,
      about: "Passionate software engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Previously worked at WebSolutions Inc where I led a team of 5 developers.",
      experience: [
        { id: 1, title: "Senior Software Engineer", company: "TechCorp", startDate: "2020-03", endDate: "Present", location: "San Francisco, CA", description: "Lead development of customer-facing web applications using React and Node.js" },
        { id: 2, title: "Software Engineer", company: "WebSolutions Inc", startDate: "2017-06", endDate: "2020-02", location: "New York, NY", description: "Developed and maintained multiple client websites and web applications" }
      ],
      projects: [
        { id: 1, title: "E-commerce Platform", description: "Built a full-stack e-commerce platform using MERN stack with payment gateway integration.", link: "https://github.com/alex/ecommerce" }
      ],
      education: [
        { id: 1, school: "Stanford University", degree: "Master of Science", field: "Computer Science", startYear: "2015", endYear: "2017", description: "Specialized in Machine Learning and Web Technologies" }
      ],
      skills: ["React", "JavaScript", "Node.js", "TypeScript", "AWS", "MongoDB", "Python", "Docker"],
      website: "https://alexjohnson.dev",
      profileImage: DEFAULT_PROFILE_IMG,
      bannerImage: DEFAULT_BANNER,
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
    };
    setProfileData(mockData);
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
      let errMsg = "Failed to save profile. Please try again.";
      if (err.response?.data?.errors) {
        // Format Zod structured validation errors nicely
        errMsg = err.response.data.errors.map(e => {
          const fieldName = e.field.replace("urls.0.url", "website").replace("urls.0.", "");
          return `${fieldName}: ${e.message}`;
        }).join("\n");
      } else if (err.response?.data?.error) {
        errMsg = err.response.data.error;
      }
      alert(errMsg);
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

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video/");
      const newItem = { id: Date.now() + Math.random(), url, caption: file.name.replace(/\.[^/.]+$/, "") };
      if (isVideo) {
        newItem.thumbnail = url;
        setMediaItems(prev => ({ ...prev, videos: [newItem, ...prev.videos] }));
        setActiveMediaTab("videos");
      } else {
        setMediaItems(prev => ({ ...prev, photos: [newItem, ...prev.photos] }));
        setActiveMediaTab("photos");
      }
    });
    e.target.value = "";
  };

  const removeMedia = (type, id) => {
    setMediaItems(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
    // Close lightbox if the deleted item is currently open
    if (lightbox.open && lightbox.item?.id === id) {
      setLightbox({ open: false, item: null, type: null });
    }
  };

  const renderMedia = () => (
    <div className="glass-panel media-section gsap-reveal">
      {/* Lightbox */}
      {lightbox.open && (
        <div className="media-lightbox" onClick={() => setLightbox({ open: false, item: null, type: null })}>
          <button className="lightbox-close" onClick={() => setLightbox({ open: false, item: null, type: null })}>✕</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            {lightbox.type === "photo" ? (
              <img src={lightbox.item.url} alt={lightbox.item.caption} className="lightbox-img" />
            ) : (
              <video src={lightbox.item.url} controls autoPlay className="lightbox-video" />
            )}
            {lightbox.item.caption && (
              <p className="lightbox-caption">{lightbox.item.caption}</p>
            )}
          </div>
        </div>
      )}

      <div className="media-header">
        <h3 className="panel-title">
          <Icon name="image" /> Media
        </h3>
        <div className="media-header-right">
          <div className="media-tabs">
            <button
              className={`media-tab ${activeMediaTab === "photos" ? "active" : ""}`}
              onClick={() => setActiveMediaTab("photos")}
            >
              📷 Photos <span className="media-count">{mediaItems.photos.length}</span>
            </button>
            <button
              className={`media-tab ${activeMediaTab === "videos" ? "active" : ""}`}
              onClick={() => setActiveMediaTab("videos")}
            >
              🎬 Videos <span className="media-count">{mediaItems.videos.length}</span>
            </button>
          </div>
          <input
            ref={mediaUploadRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: "none" }}
            onChange={handleMediaUpload}
          />
          <button className="profile-btn media-upload-btn" onClick={() => mediaUploadRef.current?.click()}>
            <Icon name="plus" /> Add Media
          </button>
        </div>
      </div>

      {activeMediaTab === "photos" && (
        <div className="media-grid">
          {mediaItems.photos.length > 0 ? (
            mediaItems.photos.map((photo, i) => (
              <div
                key={photo.id}
                className={`media-card ${i === 0 ? "media-card--featured" : ""}`}
                onClick={() => setLightbox({ open: true, item: photo, type: "photo" })}
              >
                <img src={photo.url} alt={photo.caption} loading="lazy" />
                <div className="media-overlay">
                  <span className="media-caption">{photo.caption}</span>
                  <span className="media-expand-icon">⛶</span>
                </div>
                <button
                  className="media-delete-btn"
                  title="Remove photo"
                  onClick={e => { e.stopPropagation(); removeMedia("photos", photo.id); }}
                >
                  🗑
                </button>
              </div>
            ))
          ) : (
            <div className="media-empty">
              <div className="media-empty-icon">📷</div>
              <p>No photos yet. Click "Add Media" to upload your first photo.</p>
            </div>
          )}
        </div>
      )}

      {activeMediaTab === "videos" && (
        <div className="media-grid">
          {mediaItems.videos.length > 0 ? (
            mediaItems.videos.map((video) => (
              <div
                key={video.id}
                className="media-card media-card--video"
                onClick={() => setLightbox({ open: true, item: video, type: "video" })}
              >
                <img src={video.thumbnail} alt={video.caption} loading="lazy" />
                <div className="media-overlay">
                  <div className="video-play-badge">▶</div>
                  <span className="media-caption">{video.caption}</span>
                </div>
                <button
                  className="media-delete-btn"
                  title="Remove video"
                  onClick={e => { e.stopPropagation(); removeMedia("videos", video.id); }}
                >
                  🗑
                </button>
              </div>
            ))
          ) : (
            <div className="media-empty">
              <div className="media-empty-icon">🎬</div>
              <p>No videos yet. Click "Add Media" to upload your first video.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

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
            <button className="profile-btn primary">Connect</button>
            <button className="profile-btn" onClick={() => setShowCV(true)}>
              <Icon name="file-alt" /> CV Profile
            </button>
            <button className="profile-btn" onClick={() => profileSummary ? speakText(profileSummary) : generateProfileSummary()} disabled={isSummarizing}>
              <Icon name="play" /> AI Podcast
            </button>
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
          {renderMedia()}
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