import React, { useState, useEffect, useRef } from "react";
import Avatar from "../Avatar";
import Icon from "../Icon";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

const Feed = () => {
  const feedRef = useRef(null);
  const modalRef = useRef(null);
  const postModalRef = useRef(null);
  const postOverlayRef = useRef(null);
  const postTextareaRef = useRef(null);
  const likeRefs = useRef({});
  const { user } = useAuth();

  // State for managing "See More" modal
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postImages, setPostImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedPostComments, setExpandedPostComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const modalFileInputRef = useRef(null);
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
    commentsData: (post.comments || []).map(c => ({
        id: c._id,
        authorId: c.author?._id || c.author,
        authorName: c.author?.full_name || "Anonymous",
        authorImg: c.author?.profile_picture || null,
        authorHeadline: c.author?.headline || "",
        text: c.text,
        createdAt: c.created_at
    })),

    // Timestamp
    createdAt: post.created_at,

    // Post type
    type: post.type || "post",
  });

  // Fallback demo posts shown when API is unavailable
  const DEMO_POSTS = [
    {
      id: "demo-1",
      author: user?.fullName || user?.firstName + " " + user?.lastName || "Suroj Swarnakar",
      authorHeadline: user?.headline || "Full-Stack Developer | Building at Connectimi",
      authorImg: user?.profileImage || null,
      authorId: "demo",
      title: "Analyzed customer acquisition data this week. Interesting trends emerging from organic traffic sources.",
      takeaway: "Analyzed customer acquisition data this week. Interesting trends emerging from organic traffic sources.",
      image: null,
      liked: false,
      likes: 4,
      comments: 2,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      type: "post",
    },
    {
      id: "demo-2",
      author: "Arnab Dinda",
      authorHeadline: "Web Developer | React & TypeScript",
      authorImg: null,
      authorId: "demo-2",
      title: "Just launched my portfolio! Check it out — built with React, TypeScript, and a lot of coffee ☕",
      takeaway: "Just launched my portfolio! Check it out — built with React, TypeScript, and a lot of coffee ☕",
      image: null,
      liked: false,
      likes: 12,
      comments: 5,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      type: "post",
    },
    {
      id: "demo-3",
      author: "Sanniv Kumar",
      authorHeadline: "Backend Engineer | Node.js & MongoDB",
      authorImg: null,
      authorId: "demo-3",
      title: "Built a rate-limiting middleware from scratch today. It's amazing how much you learn when you avoid using libraries.",
      takeaway: "Built a rate-limiting middleware from scratch today. It's amazing how much you learn when you avoid using libraries.",
      image: null,
      liked: false,
      likes: 8,
      comments: 3,
      createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      type: "post",
    },
  ];

  // Load dynamic posts from feed
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await API.get("/posts/feed");
        const mapped = res.data.posts.map((p) => mapPostToInsight(p, user?.id));
        setInsights(mapped.length > 0 ? mapped : DEMO_POSTS);
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
        // Show demo posts so the page is never empty
        setInsights(DEMO_POSTS);
        setTimeout(() => {
          const cards = feedRef.current?.querySelectorAll(".insight-card");
          if (cards && cards.length > 0) {
            gsap.fromTo(
              cards,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
            );
          }
        }, 100);
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
      // Micro-animation: scale the button on click
      const btn = likeRefs.current[id];
      if (btn) {
        gsap.fromTo(
          btn,
          { scale: 1 },
          {
            scale: 1.35, duration: 0.12, ease: "power2.out",
            onComplete: () => gsap.to(btn, { scale: 1, duration: 0.2, ease: "elastic.out(1.2, 0.4)" })
          }
        );
      }

      const res = await API.post(`/posts/${id}/like`);
      const { liked, like_count } = res.data;

      setInsights((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, liked, likes: like_count } : item
        )
      );

      // Keep modal in sync if it's open on this post
      setSelectedInsight((prev) =>
        prev?.id === id ? { ...prev, liked, likes: like_count } : prev
      );
    } catch (err) {
      console.error("Failed to toggle like:", err.message);
    }
  };

  const handleCreateComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      const res = await API.post(`/posts/${postId}/comments`, { text });
      const newComment = res.data.comment;
      
      const newCommentObj = {
        id: newComment._id,
        authorId: user?.id,
        authorName: user?.fullName || user?.name || "You",
        authorImg: user?.profileImage || null,
        authorHeadline: user?.headline || "",
        text: newComment.text,
        createdAt: newComment.created_at || new Date().toISOString()
      };

      setInsights(prev => prev.map(item => {
        if (item.id === postId) {
          return {
            ...item,
            comments: res.data.comment_count,
            commentsData: [...(item.commentsData || []), newCommentObj]
          };
        }
        return item;
      }));

      setNewCommentText(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await API.delete(`/posts/${postId}/comments/${commentId}`);
      setInsights(prev => prev.map(item => {
        if (item.id === postId) {
          const updatedCommentsData = (item.commentsData || []).filter(c => c.id !== commentId);
          return {
            ...item,
            comments: updatedCommentsData.length,
            commentsData: updatedCommentsData
          };
        }
        return item;
      }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setInsights(prev => prev.filter(item => item.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
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

  const triggerFileSelect = () => {
    openPostModal();
    setTimeout(() => modalFileInputRef.current?.click(), 300);
  };
  const triggerVideoSelect = () => videoInputRef.current.click();

  const openPostModal = () => {
    setIsPostModalOpen(true);
    setTimeout(() => {
      if (postOverlayRef.current && postModalRef.current) {
        gsap.fromTo(
          postOverlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
        gsap.fromTo(
          postModalRef.current,
          { scale: 0.92, opacity: 0, y: 24 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" }
        );
        postTextareaRef.current?.focus();
      }
    }, 10);
    document.body.style.overflow = "hidden";
  };

  const closePostModal = () => {
    if (postOverlayRef.current && postModalRef.current) {
      gsap.to(postModalRef.current, { scale: 0.94, opacity: 0, y: 16, duration: 0.22, ease: "power2.in" });
      gsap.to(postOverlayRef.current, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => {
          setIsPostModalOpen(false);
          document.body.style.overflow = "";
        }
      });
    } else {
      setIsPostModalOpen(false);
      document.body.style.overflow = "";
    }
  };

  const handleModalImageSelect = (files) => {
    if (!files) return;
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) return;

    // Only keep the first image — replace, don't append
    const file = imgs[0];
    const reader = new FileReader();
    reader.onload = (e) => setPostImages([{ url: e.target.result, file }]);
    reader.readAsDataURL(file);
  };

  const removePostImage = (idx) =>
    setPostImages((prev) => prev.filter((_, i) => i !== idx));

  const handleCreatePost = async (e) => {
    if (e) e.preventDefault();
    if (!newPostContent.trim() && postImages.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("content", newPostContent);
      formData.append("type", "post");

      if (postImages.length > 0) {
        formData.append("image", postImages[0].file); // single() only accepts one file
      }

      const res = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newPost = mapPostToInsight(res.data.post, user?.id);
      setInsights([newPost, ...insights]);
      setNewPostContent("");
      setPostImages([]);
      closePostModal();
    } catch (err) {
      console.error("Failed to create post:", err.message);
    }
  };

  return (
    <main className="feed-container" ref={feedRef}>
      {/* Create Post Area */}
      <div className="share-insight-card">
        <div className="share-header">
          <Avatar
            className="user-avatar-ring"
            src={
              user?.profileImage ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            }
            size={48}
          />
          <div className="share-input-wrapper" onClick={openPostModal} style={{ cursor: "pointer" }}>
            <span className="share-placeholder">Build Something meaningful....</span>
            <div className="share-actions-inline">
              <button
                className="btn-miing"
                type="button"
                onClick={(e) => { e.stopPropagation(); openPostModal(); }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
        <div className="share-footer-actions">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            multiple
            onChange={(e) => handleModalImageSelect(e.target.files)}
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
            onClick={() => alert("Video coming soon!")}
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
                    ref={(el) => (likeRefs.current[insight.id] = el)}
                  >
                    <Icon name="thumbs-up" />
                    Like{insight.likes > 0 && <span className="like-count">{insight.likes}</span>}
                  </button>
                  <button 
                    className={`btn-comment-box ${expandedPostComments[insight.id] ? "active" : ""}`}
                    onClick={() => setExpandedPostComments(prev => ({ ...prev, [insight.id]: !prev[insight.id] }))}
                  >
                    <Icon name="comment" /> Comment
                  </button>
                </div>
                <button className="btn-share-center">
                  <Icon name="share" /> Share
                </button>
              </div>

              {/* Comments Section */}
              {expandedPostComments[insight.id] && (
                <div className="comments-section" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", marginTop: "15px", paddingTop: "15px" }}>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateComment(insight.id, newCommentText[insight.id] || "");
                    }}
                    style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
                  >
                    <Avatar src={user?.profileImage} size={32} />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newCommentText[insight.id] || ""}
                      onChange={(e) => setNewCommentText(prev => ({ ...prev, [insight.id]: e.target.value }))}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.05)", color: "white", outline: "none", fontSize: "0.85rem" }}
                    />
                    <button 
                      type="submit" 
                      disabled={!(newCommentText[insight.id] || "").trim()}
                      style={{ padding: "8px 16px", borderRadius: "20px", border: "none", background: "var(--emerald-500)", color: "white", cursor: "pointer", fontWeight: "600", opacity: (newCommentText[insight.id] || "").trim() ? 1 : 0.5 }}
                    >
                      Post
                    </button>
                  </form>

                  <div className="comments-list" style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "250px", overflowY: "auto" }}>
                    {(insight.commentsData || []).length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "10px 0" }}>No comments yet.</p>
                    ) : (
                      (insight.commentsData || []).map((comm) => (
                        <div key={comm.id} className="comment-item" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <Avatar src={comm.authorImg} size={28} />
                          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                <span style={{ fontWeight: "600", fontSize: "0.8rem", color: "white" }}>{comm.authorName}</span>
                                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                  {comm.createdAt ? new Date(comm.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                                </span>
                              </div>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>{comm.authorHeadline}</span>
                              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>{comm.text}</p>
                            </div>
                            {comm.authorId === user?.id && (
                              <button 
                                onClick={() => handleDeleteComment(insight.id, comm.id)}
                                style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer", fontSize: "0.75rem", alignSelf: "flex-start", marginTop: "4px", padding: 0 }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Author footer */}
            <div className="insight-footer-author" style={{ position: "relative" }}>
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
              {insight.authorId === user?.id && (
                <button 
                  className="post-delete-btn" 
                  onClick={() => handleDeletePost(insight.id)}
                  style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--error)", fontSize: "1rem", transition: "color 0.2s" }}
                  title="Delete Post"
                >
                  <Icon name="trash" size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Post Creation Modal Overlay ────────────────────── */}
      {isPostModalOpen && (
        <div
          ref={postOverlayRef}
          className="post-modal-overlay"
          onClick={(e) => { if (e.target === postOverlayRef.current) closePostModal(); }}
        >
          <div ref={postModalRef} className="post-modal-card">
            {/* Close */}
            <button className="post-modal-close" onClick={closePostModal}>
              <Icon name="close" size={18} />
            </button>

            {/* Header */}
            <div className="post-modal-header">
              <Avatar
                src={
                  user?.profileImage ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                }
                size={52}
                style={{ border: "2px solid var(--primary-green)", flexShrink: 0 }}
              />
              <div>
                <h3 className="post-modal-name">{user?.fullName || user?.name || "You"}</h3>
                <span className="post-modal-audience">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Anyone
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={postTextareaRef}
              className="post-modal-textarea"
              placeholder="What do you want to talk about?"
              value={newPostContent}
              onChange={(e) => {
                setNewPostContent(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            {/* Image Previews */}
            {postImages.length > 0 && (
              <div className="post-modal-image-previews">
                {postImages.map((img, idx) => (
                  <div key={idx} className="post-modal-preview-item">
                    <img src={img.url} alt={`upload-${idx}`} className="post-modal-preview-img" />
                    <button className="post-modal-preview-remove" onClick={() => removePostImage(idx)}>
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone */}
            {postImages.length === 0 && (
              <div
                className={`post-modal-dropzone${isDragging ? " dragging" : ""}`}
                onClick={() => modalFileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleModalImageSelect(e.dataTransfer.files);
                }}
              >
                <div className="post-modal-dropzone-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <path d="M3 15l4.586-4.586a2 2 0 012.828 0L16 16" />
                    <path d="M14 14l1.586-1.586a2 2 0 012.828 0L21 15" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                  </svg>
                </div>
                <p className="post-modal-dropzone-label">Add Photos</p>
                <p className="post-modal-dropzone-sub">Drag &amp; drop or click to upload</p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={modalFileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={(e) => handleModalImageSelect(e.target.files)}
            />

            {/* Footer */}
            <div className="post-modal-footer">
              <div className="post-modal-footer-actions">
                <button
                  className="post-modal-action-btn"
                  title="Add Photo"
                  onClick={() => modalFileInputRef.current?.click()}
                >
                  <Icon name="image" size={20} />
                </button>
              </div>
              <button
                className={`post-modal-submit${!newPostContent.trim() && postImages.length === 0 ? " disabled" : ""
                  }`}
                disabled={!newPostContent.trim() && postImages.length === 0}
                onClick={handleCreatePost}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal ------------------------------*/}
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
                    <button
                      className={`btn-like-text ${selectedInsight.liked ? "active" : ""}`}
                      onClick={() => handleLike(selectedInsight.id)}
                      style={{ marginTop: "6px", fontSize: "12px", padding: "4px 10px" }}
                      ref={(el) => (likeRefs.current[`modal-${selectedInsight.id}`] = el)}
                    >
                      <Icon name="thumbs-up" /> {selectedInsight.liked ? "Liked" : "Like"}
                    </button>
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
