import React, { useState, useEffect, useRef } from "react";
import Avatar from "../Avatar";
import Icon from "../Icon";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

const Feed = () => {
  const feedRef = useRef(null);
  const modalRef = useRef(null);
  const { user } = useAuth();

  // State for managing "See More" modal
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [insights, setInsights] = useState([]);

  // ─── Fixed mapper ─────────────────────────────────────────────
  const mapPostToInsight = (post, currentUserId) => ({
    id: post._id,

    // Author fields
    author: post.author?.full_name || "Anonymous",
    authorHeadline: post.author?.headline || "",
    authorImg: post.author?.profile_picture || null,
    authorId: post.author?._id,

    // Content — no title field in API, use content for both
    title: post.content || "Untitled Post",
    takeaway: post.content || "",

    // Media — array of objects with url, or empty
    image: post.media?.length > 0 ? post.media[0].url : null,

    // Likes — array of user ref objects, check by _id string
    liked: currentUserId
      ? post.likes?.some(
        (like) => (like._id || like).toString() === currentUserId.toString(),
      )
      : false,
    likes: post.likes?.length || 0,

    // Comments count
    comments: post.comments?.length || 0,

    // Timestamp
    createdAt: post.created_at,

    // Post type
    type: post.type || "post",
  });

  // Load dynamic posts from feed
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await API.get("/posts/feed");
        const mapped = res.data.posts.map((p) => mapPostToInsight(p, user?.id));
        setInsights(mapped);
        console.log(res.data);

        // GSAP Animations after loading data
        setTimeout(() => {
          const cards = feedRef.current?.querySelectorAll(".insight-card");
          const shareCard = feedRef.current?.querySelector(
            ".share-insight-card",
          );

          if (shareCard) {
            gsap.fromTo(
              shareCard,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
            );
          }

          if (cards && cards.length > 0) {
            gsap.fromTo(
              cards,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
              },
            );
          }
        }, 100);
      } catch (err) {
        console.error("Failed to load feed:", err.message);
      }
    };

    fetchFeed();
  }, [user]);
  //   console.log();

  useEffect(() => {
    if (selectedInsight && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    }
  }, [selectedInsight]);

  const handleLike = async (id) => {
    try {
      const res = await API.post(`/posts/${id}/like`);
      const { liked, like_count } = res.data;

      setInsights(
        insights.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              liked,
              likes: like_count,
            };
          }
          return item;
        }),
      );
    } catch (err) {
      console.error("Failed to toggle like:", err.message);
    }
  };

  const openProjectModal = (insight) => {
    setSelectedInsight(insight);
  };

  const closeProjectModal = () => {
    setSelectedInsight(null);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const triggerFileSelect = () => fileInputRef.current.click();
  const triggerVideoSelect = () => videoInputRef.current.click();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const res = await API.post("/posts", {
        content: newPostContent,
        type: "post",
      });

      const newPost = mapPostToInsight(res.data.post, user?.id);
      setInsights([newPost, ...insights]);
      setNewPostContent("");
    } catch (err) {
      console.error("Failed to create post:", err.message);
    }
  };

  return (
    <main className="feed-container" ref={feedRef}>
      {/* Create Post Area */}
      <div className="share-insight-card">
        <form className="share-header" onSubmit={handleCreatePost}>
          <Avatar
            className="user-avatar-ring"
            src={
              user?.profileImage ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            }
            size={48}
          />
          <div className="share-input-wrapper">
            <input
              type="text"
              className="share-input-field"
              placeholder="Build Something meaningful...."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                width: "100%",
                fontSize: "15px",
              }}
            />
            <div className="share-actions-inline">
              <button
                className="btn-miing"
                type="submit"
                disabled={!newPostContent.trim()}
                style={{ opacity: !newPostContent.trim() ? 0.5 : 1 }}
              >
                Post
              </button>
            </div>
          </div>
        </form>
        <div className="share-footer-actions">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
          />
          <input
            type="file"
            ref={videoInputRef}
            style={{ display: "none" }}
            accept="video/*"
          />

          <button
            type="button"
            className="btn-icon-text"
            onClick={() => alert("Project creation coming soon!")}
          >
            <Icon name="project" style={{ color: "#3b82f6" }} /> Project
          </button>
          <button
            type="button"
            className="btn-icon-text"
            onClick={triggerFileSelect}
          >
            <Icon name="image" style={{ color: "#10b981" }} /> Photo
          </button>
          <button
            type="button"
            className="btn-icon-text"
            onClick={triggerVideoSelect}
          >
            <Icon name="video" style={{ color: "#8b5cf6" }} /> Video
          </button>
          <button
            type="button"
            className="btn-icon-text"
            onClick={() => alert("Event scheduling coming soon!")}
          >
            <Icon name="calendar" style={{ color: "#f59e0b" }} /> Event
          </button>
          <div style={{ flex: 1 }}></div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="insights-grid">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`insight-card ${!insight.image ? "insight-card--text-only" : ""}`}
          >
            {/* Image — only render if exists */}
            {insight.image && (
              <div
                className="insight-image-wrapper"
                onClick={() => openProjectModal(insight)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={insight.image}
                  alt={insight.title}
                  className="insight-image"
                />
                <button className="btn-arrow-overlay">
                  <Icon name="arrow-right" />
                </button>
              </div>
            )}

            <div className="insight-body">
              {/* Title — clickable */}
              <h3
                className="insight-title"
                style={{ cursor: "pointer" }}
                onClick={() => openProjectModal(insight)}
              >
                {insight.title}
              </h3>

              {/* Takeaway */}
              <div className="insight-takeaway">
                <span className="takeaway-label">KEY TAKEAWAY:</span>
                <p>
                  {truncateText(insight.takeaway, insight.image ? 100 : 200)}
                  <span
                    style={{
                      color: "var(--primary-green)",
                      cursor: "pointer",
                      fontWeight: "500",
                      marginLeft: "4px",
                    }}
                    onClick={() => openProjectModal(insight)}
                  >
                    See More...
                  </span>
                </p>
              </div>

              {/* Timestamp */}
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                }}
              >
                {insight.createdAt
                  ? new Date(insight.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  : ""}
              </div>

              {/* Actions */}
              <div className="insight-actions-new">
                <div className="action-main-row">
                  <button
                    className={`btn-like-text ${insight.liked ? "active" : ""}`}
                    onClick={() => handleLike(insight.id)}
                  >
                    <Icon name="thumbs-up" /> Like
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

            {/* Author footer */}
            <div className="insight-footer-author">
              <Avatar src={insight.authorImg} size={32} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className="insight-author-name">{insight.author}</span>
                {insight.authorHeadline && (
                  <span
                    style={{ fontSize: "11px", color: "var(--text-muted)" }}
                  >
                    {insight.authorHeadline}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedInsight && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 2000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
          onClick={closeProjectModal}
        >
          <div
            ref={modalRef}
            style={{
              backgroundColor: "var(--glass-bg)",
              backdropFilter: "blur(16px)",
              borderRadius: "32px",
              border: "1px solid var(--glass-border)",
              maxWidth: "960px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Modal Header Title */}
            <div
              style={{
                padding: "24px 32px",
                borderBottom: "1px solid var(--glass-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  margin: 0,
                  fontFamily: "Satoshi",
                }}
              >
                {selectedInsight.title}
              </h2>
              <button
                onClick={closeProjectModal}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  cursor: "pointer",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-primary)",
                  transition: "all 0.2s",
                }}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* 2. Full Width Image Banner */}
            <div
              style={{
                width: "100%",
                height: "320px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={selectedInsight.image}
                alt={selectedInsight.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* 3. Content Body (Two Columns) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 300px",
                gap: "40px",
                padding: "30px",
                alignItems: "start",
              }}
            >
              {/* Left Column: Details */}
              <div style={{ minWidth: 0 }}>
                <div style={{ marginBottom: "30px" }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--text-secondary)",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    Project Overview
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.6",
                      color: "var(--text-secondary)",
                    }}
                  >
                    A deep dive into fintech user flows using mixed-methods
                    research to uncover pain points and optimization
                    opportunities.
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--text-secondary)",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    Key Takeaway
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "var(--primary-green)",
                        textTransform: "uppercase",
                      }}
                    >
                      KEY RESULT:
                    </span>
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "1.6",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {selectedInsight.takeaway}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Author & Actions */}
              <div
                style={{
                  paddingLeft: "20px",
                  borderLeft: "1px solid var(--border-color)",
                }}
              >
                {/* Author Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <Avatar src={selectedInsight.authorImg} size={40} />
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        margin: 0,
                        color: "var(--text-primary)",
                      }}
                    >
                      {selectedInsight.author}
                    </h4>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        margin: 0,
                      }}
                    >
                      Project Lead
                    </p>
                  </div>
                </div>

                {/* Message Button */}
                <button
                  style={{
                    backgroundColor: "var(--primary-green)" /* Green color */,
                    color: "white",
                    border: "none",
                    borderRadius: "24px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    marginBottom: "24px",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Icon name="comment-dots" /> Message Owner
                </button>

                {/* Stats Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: "20px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                      }}
                    >
                      {selectedInsight.likes}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Likes
                    </span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                      }}
                    >
                      {selectedInsight.comments}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Comments
                    </span>
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
