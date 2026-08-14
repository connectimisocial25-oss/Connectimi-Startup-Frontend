import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon";
import Avatar from "../Avatar";
import { getProject, deleteProject } from "../../services/projectApi";
import API from "../../services/api";
import "./ProjectModal.css";

export default function ProjectModal({ projectId, initialInsight, onClose, currentUser }) {
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getProject(projectId)
      .then((data) => {
        if (!isMounted) return;
        setProjectData(data.project);
        setPostData(data.post);

        if (data.post) {
          const isLiked = currentUser?.id
            ? data.post.likes?.some(
                (l) => (l._id || l.id || l).toString() === currentUser.id.toString(),
              )
            : false;

          setLiked(isLiked);
          setLikesCount(data.post.likes?.length || 0);
          setComments(data.post.comments || []);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.response?.data?.error || "Failed to load project details.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [projectId, currentUser?.id]);

  const handleLike = async () => {
    if (!postData?._id && !postData?.id) return;
    const pId = postData._id || postData.id;
    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await API.post(`/posts/${pId}/like`);
    } catch {
      setLiked(!nextLiked);
      setLikesCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const pId = postData?._id || postData?.id;
    if (!commentText.trim() || !pId) return;

    try {
      const res = await API.post(`/posts/${pId}/comments`, {
        text: commentText.trim(),
      });
      if (res.data?.comment) {
        setComments((prev) => [...prev, res.data.comment]);
        setCommentText("");
      }
    } catch {
      alert("Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const pId = postData?._id || postData?.id;
    if (!pId) return;
    try {
      await API.delete(`/posts/${pId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => (c._id || c.id) !== commentId));
    } catch {
      alert("Failed to delete comment");
    }
  };

  const handleDeleteProject = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project showcase? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deleteProject(projectId);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete project");
      setDeleting(false);
    }
  };

  const rawAuthor = projectData?.created_by || projectData?.createdBy;
  const authorName =
    rawAuthor?.full_name ||
    rawAuthor?.name ||
    initialInsight?.author ||
    "Developer";

  const authorAvatar =
    rawAuthor?.profile_picture ||
    initialInsight?.authorImg ||
    "/images/default_profile_picture.png";

  const authorHeadline =
    rawAuthor?.headline ||
    initialInsight?.authorHeadline ||
    "Software Developer";

  const authorId = rawAuthor?._id || rawAuthor?.id || initialInsight?.authorId;
  const isOwner = currentUser?.id && authorId === currentUser.id;

  const [activeModalPhotoIndex, setActiveModalPhotoIndex] = useState(0);

  const coverUrl =
    projectData?.cover_image_url ||
    projectData?.coverImageUrl ||
    (typeof projectData?.cover_image === "string"
      ? projectData.cover_image
      : projectData?.cover_image?.url) ||
    projectData?.coverImage?.url ||
    initialInsight?.image;

  const galleryItems = (projectData?.gallery || [])
    .map((item) => (typeof item === "string" ? item : item?.url))
    .filter(Boolean);

  const allProjectPhotos = Array.from(
    new Set([coverUrl, ...galleryItems].filter(Boolean))
  ).slice(0, 3);

  const currentDisplayPhoto =
    allProjectPhotos[activeModalPhotoIndex] || coverUrl;

  const techStack = projectData?.tech_stack || projectData?.techStack || [];
  const gallery = projectData?.gallery || [];

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header - Populated instantly from initialInsight or fetched author */}
        <div className="project-modal-header">
          <div
            className="project-modal-author-info"
            style={{ cursor: authorId ? "pointer" : "default" }}
            onClick={() => {
              if (authorId) {
                onClose();
                navigate(`/profile/${authorId}`);
              }
            }}
          >
            <Avatar src={authorAvatar} size={36} />
            <div>
              <h4 className="project-modal-author-name">{authorName}</h4>
              <p className="project-modal-author-headline">{authorHeadline}</p>
            </div>
          </div>
          <button className="project-modal-close-btn" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Scrollable Body Area */}
        <div className="project-modal-body">
          {loading ? (
            <>
              {/* Skeleton Shimmer Loading UI */}
              <div className="skeleton-box project-modal-skeleton-banner" />
              <div className="project-modal-skeleton-badges">
                <div className="skeleton-box project-modal-skeleton-badge" />
                <div className="skeleton-box project-modal-skeleton-badge" />
              </div>
              <div className="skeleton-box project-modal-skeleton-title" />
              <div className="skeleton-box project-modal-skeleton-short" />
              <div className="project-modal-skeleton-chips-row">
                <div className="skeleton-box project-modal-skeleton-chip" />
                <div className="skeleton-box project-modal-skeleton-chip" />
                <div className="skeleton-box project-modal-skeleton-chip" />
              </div>
              <div className="project-modal-skeleton-text-block">
                <div className="skeleton-box project-modal-skeleton-line" />
                <div className="skeleton-box project-modal-skeleton-line" />
                <div className="skeleton-box project-modal-skeleton-line short" />
              </div>
            </>
          ) : error || !projectData ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <p style={{ color: "var(--error, #ef4444)", marginBottom: "12px" }}>
                {error || "Project Not Found"}
              </p>
            </div>
          ) : (
            <>
              {/* Main Photo Banner & Gallery Switcher */}
              {currentDisplayPhoto && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="project-modal-cover" style={{ position: "relative" }}>
                    <img src={currentDisplayPhoto} alt={projectData.title} />

                    {allProjectPhotos.length > 1 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(0, 0, 0, 0.7)",
                          backdropFilter: "blur(6px)",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "14px",
                          fontSize: "0.78rem",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Icon name="image" size={14} />
                        Photo {activeModalPhotoIndex + 1} of {allProjectPhotos.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip for Multi-Photo Projects */}
                  {allProjectPhotos.length > 1 && (
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      {allProjectPhotos.map((photoUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveModalPhotoIndex(idx)}
                          style={{
                            width: "60px",
                            height: "40px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border:
                              activeModalPhotoIndex === idx
                                ? "2px solid var(--emerald-400, #34d399)"
                                : "1px solid rgba(255, 255, 255, 0.2)",
                            opacity: activeModalPhotoIndex === idx ? 1 : 0.6,
                            cursor: "pointer",
                            padding: 0,
                            background: "transparent",
                            transition: "all 0.2s",
                          }}
                        >
                          <img
                            src={photoUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Status & Meta Row */}
              <div className="project-modal-badges-row">
                {projectData.status && (
                  <span className={`project-modal-status-badge ${projectData.status}`}>
                    {projectData.status}
                  </span>
                )}
                {projectData.category && (
                  <span className="project-modal-meta-tag">• {projectData.category}</span>
                )}
                {projectData.duration && (
                  <span className="project-modal-meta-tag">• {projectData.duration}</span>
                )}
              </div>

              {/* Title & Short Description */}
              <h2 className="project-modal-title">{projectData.title}</h2>
              {projectData.shortDescription || projectData.short_description ? (
                <p className="project-modal-short-desc">
                  {projectData.shortDescription || projectData.short_description}
                </p>
              ) : null}

              {/* Tech Stack Chips */}
              {techStack.length > 0 && (
                <div className="project-modal-block">
                  <h4 className="project-modal-block-title">
                    <Icon name="code" size={16} /> Technologies & Stack
                  </h4>
                  <div className="project-modal-tech-chips">
                    {techStack.map((tech, idx) => (
                      <span key={idx} className="project-modal-tech-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Overview / Description */}
              {projectData.description && (
                <div className="project-modal-block">
                  <h4 className="project-modal-block-title">
                    <Icon name="document" size={16} /> Project Overview
                  </h4>
                  <p className="project-modal-text">{projectData.description}</p>
                </div>
              )}

              {/* Key Features */}
              {projectData.features && projectData.features.length > 0 && (
                <div className="project-modal-block">
                  <h4 className="project-modal-block-title">
                    <Icon name="star" size={16} /> Key Features
                  </h4>
                  <ul className="project-modal-features-list">
                    {projectData.features.map((feat, idx) => (
                      <li key={idx} className="project-modal-feature-item">
                        <span style={{ color: "var(--emerald-500, #10b981)", fontWeight: "bold" }}>
                          ✓
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gallery Screenshots */}
              {gallery.length > 0 && (
                <div className="project-modal-block">
                  <h4 className="project-modal-block-title">
                    <Icon name="image" size={16} /> Project Screenshots
                  </h4>
                  <div className="project-modal-gallery">
                    {gallery.map((img, idx) => (
                      <div key={idx} className="project-modal-gallery-item">
                        <img src={img.url} alt={`Screenshot ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Challenges */}
              {projectData.challenges && (
                <div className="project-modal-block">
                  <h4 className="project-modal-block-title">
                    <Icon name="alert" size={16} /> Technical Challenges
                  </h4>
                  <p className="project-modal-text">{projectData.challenges}</p>
                </div>
              )}

              {/* Key Learnings */}
              {projectData.learnings && (
                <div className="project-modal-block">
                  <h4 className="project-modal-block-title">
                    <Icon name="bulb" size={16} /> Key Learnings & Insights
                  </h4>
                  <p className="project-modal-text">{projectData.learnings}</p>
                </div>
              )}

              {/* External Links & Owner Actions */}
              <div className="project-modal-actions">
                {(projectData.github_url || projectData.githubUrl) && (
                  <a
                    href={projectData.github_url || projectData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-modal-link-btn github"
                  >
                    <Icon name="github" size={15} /> GitHub Repo
                  </a>
                )}
                {(projectData.live_demo_url || projectData.liveDemoUrl) && (
                  <a
                    href={projectData.live_demo_url || projectData.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-modal-link-btn live"
                  >
                    <Icon name="link" size={15} /> Live Demo
                  </a>
                )}

                {isOwner && (
                  <>
                    <button
                      onClick={() => {
                        onClose();
                        navigate(`/projects/${projectId}/edit`);
                      }}
                      className="project-modal-link-btn github"
                    >
                      <Icon name="edit" size={15} /> Edit Showcase
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      disabled={deleting}
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        color: "#ef4444",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "20px",
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.82rem",
                      }}
                    >
                      {deleting ? "Deleting..." : "Delete Showcase"}
                    </button>
                  </>
                )}
              </div>

              {/* Social Discussion Card */}
              {postData && (
                <div className="project-modal-social-section">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleLike}
                      style={{
                        background: liked
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(255, 255, 255, 0.05)",
                        color: liked ? "var(--emerald-400, #34d399)" : "white",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Icon name="thumbs-up" size={15} />
                      Like {likesCount > 0 && <span>({likesCount})</span>}
                    </button>

                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {comments.length} Comments
                    </span>
                  </div>

                  {/* Add Comment Form */}
                  <form
                    onSubmit={handleAddComment}
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <Avatar src={currentUser?.profileImage} size={32} />
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: "1px solid var(--surface-border, rgba(255, 255, 255, 0.1))",
                        background: "rgba(255, 255, 255, 0.04)",
                        color: "white",
                        outline: "none",
                        fontSize: "0.85rem",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "20px",
                        border: "none",
                        background: "var(--emerald-500, #10b981)",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        opacity: commentText.trim() ? 1 : 0.5,
                      }}
                    >
                      Comment
                    </button>
                  </form>

                  {/* Comments List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {comments.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
                        No comments yet. Start the conversation!
                      </p>
                    ) : (
                      comments.map((comm) => {
                        const commId = comm._id || comm.id;
                        const commAuthor = comm.author || {};
                        const commAuthorId = commAuthor._id || commAuthor.id || commAuthor;
                        const canDelete =
                          currentUser?.id &&
                          (commAuthorId === currentUser.id || commAuthor === currentUser.id);

                        return (
                          <div
                            key={commId}
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                              background: "rgba(255, 255, 255, 0.02)",
                              padding: "10px 12px",
                              borderRadius: "12px",
                              border: "1px solid rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            <Avatar src={commAuthor.profile_picture} size={28} />
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "2px",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "0.82rem",
                                    color: "white",
                                  }}
                                >
                                  {commAuthor.full_name || commAuthor.name || "User"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  {comm.created_at
                                    ? new Date(comm.created_at).toLocaleDateString()
                                    : ""}
                                </span>
                              </div>
                              <p
                                style={{
                                  fontSize: "0.85rem",
                                  color: "rgba(255, 255, 255, 0.85)",
                                  margin: 0,
                                }}
                              >
                                {comm.text}
                              </p>
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(commId)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#ef4444",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                    padding: 0,
                                    marginTop: "4px",
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
