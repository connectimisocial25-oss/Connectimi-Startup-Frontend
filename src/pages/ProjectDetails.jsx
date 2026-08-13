import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Icon from "../components/Icon";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { getProject, deleteProject } from "../services/projectApi";
import API from "../services/api";
import "./ProjectDetails.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projectData, setProjectData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Social State
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProject(id);
      setProjectData(data.project);
      setPostData(data.post);

      if (data.post) {
        const isLiked = user?.id
          ? data.post.likes?.some(
              (l) => (l._id || l).toString() === user.id.toString(),
            )
          : false;

        setLiked(isLiked);
        setLikesCount(data.post.likes?.length || 0);
        setComments(data.post.comments || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load project details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!postData?._id) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await API.post(`/posts/${postData._id}/like`);
    } catch {
      // Revert on error
      setLiked(!nextLiked);
      setLikesCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !postData?._id) return;

    try {
      const res = await API.post(`/posts/${postData._id}/comments`, {
        text: commentText.trim(),
      });
      if (res.data?.comment) {
        setComments((prev) => [...prev, res.data.comment]);
        setCommentText("");
      }
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!postData?._id) return;
    try {
      await API.delete(`/posts/${postData._id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
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
      await deleteProject(id);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete project");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="project-details-container" style={{ alignItems: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Loading project details...</div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="project-details-container" style={{ alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "12px", color: "var(--error, #ef4444)" }}>
            {error || "Project Not Found"}
          </h2>
          <button
            className="btn-secondary"
            onClick={() => navigate("/home")}
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const author = projectData.created_by || projectData.createdBy || {};
  const isOwner = user?.id && (author._id || author.id) === user.id;

  const coverUrl =
    projectData.cover_image_url ||
    projectData.coverImageUrl ||
    (typeof projectData.cover_image === "string"
      ? projectData.cover_image
      : projectData.cover_image?.url) ||
    projectData.coverImage?.url;

  return (
    <div className="project-details-container">
      <div className="project-details-content">
        {/* Hero Card */}
        <div className="project-details-hero">
          {coverUrl && (
            <div className="project-cover-banner">
              <img src={coverUrl} alt={projectData.title} />
            </div>
          )}

          <div className="project-hero-body">
            <div className="project-badges-row">
              <span className={`project-status-badge ${projectData.status}`}>
                {projectData.status}
              </span>
              {projectData.category && (
                <span className="project-category-tag">
                  • {projectData.category}
                </span>
              )}
              {projectData.duration && (
                <span className="project-category-tag">
                  • {projectData.duration}
                </span>
              )}
            </div>

            <h1 className="project-main-title">{projectData.title}</h1>
            <p className="project-short-desc">{projectData.shortDescription}</p>

            <div className="project-meta-row">
              <div className="project-author-info">
                <Avatar src={projectData.createdBy?.profile_picture} size={40} />
                <div>
                  <div className="author-name-bold">
                    {projectData.createdBy?.full_name || "Anonymous Developer"}
                  </div>
                  <div className="author-headline-sub">
                    {projectData.createdBy?.headline || "Software Developer"}
                  </div>
                </div>
              </div>

              <div className="project-external-links">
                {projectData.githubUrl && (
                  <a
                    href={projectData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-button github"
                  >
                    <Icon name="github" size={16} /> GitHub Repo
                  </a>
                )}
                {projectData.liveDemoUrl && (
                  <a
                    href={projectData.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-button live"
                  >
                    <Icon name="link" size={16} /> Live Demo
                  </a>
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={() => navigate(`/projects/${id}/edit`)}
                      className="link-button github"
                      style={{ cursor: "pointer" }}
                    >
                      <Icon name="edit" size={16} /> Edit Showcase
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      disabled={deleting}
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        color: "#ef4444",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "20px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                      }}
                    >
                      {deleting ? "Deleting..." : "Delete Showcase"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="project-details-section">
          {/* Tech Stack */}
          {projectData.techStack && projectData.techStack.length > 0 && (
            <div className="section-block">
              <h3 className="section-title">
                <Icon name="code" size={18} /> Technologies & Stack
              </h3>
              <div className="tech-chips-grid">
                {projectData.techStack.map((tech, idx) => (
                  <span key={idx} className="tech-chip-item">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          <div className="section-block">
            <h3 className="section-title">
              <Icon name="document" size={18} /> Project Overview
            </h3>
            <p className="section-text-plain">{projectData.description}</p>
          </div>

          {/* Features */}
          {projectData.features && projectData.features.length > 0 && (
            <div className="section-block">
              <h3 className="section-title">
                <Icon name="star" size={18} /> Key Features
              </h3>
              <ul className="features-list">
                {projectData.features.map((feat, idx) => (
                  <li key={idx} className="feature-item">
                    <span className="feature-bullet">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {projectData.gallery && projectData.gallery.length > 0 && (
            <div className="section-block">
              <h3 className="section-title">
                <Icon name="image" size={18} /> Project Screenshots
              </h3>
              <div className="gallery-grid">
                {projectData.gallery.map((img, idx) => (
                  <div key={idx} className="gallery-item">
                    <img src={img.url} alt={`Screenshot ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges & Learnings */}
          {projectData.challenges && (
            <div className="section-block">
              <h3 className="section-title">
                <Icon name="alert" size={18} /> Technical Challenges
              </h3>
              <p className="section-text-plain">{projectData.challenges}</p>
            </div>
          )}

          {projectData.learnings && (
            <div className="section-block">
              <h3 className="section-title">
                <Icon name="bulb" size={18} /> Key Learnings & Insights
              </h3>
              <p className="section-text-plain">{projectData.learnings}</p>
            </div>
          )}
        </div>

        {/* Social Card (Likes & Comments) */}
        {postData && (
          <div className="project-social-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                marginBottom: "20px",
              }}
            >
              <button
                type="button"
                className={`btn-like-text ${liked ? "active" : ""}`}
                onClick={handleLike}
                style={{
                  background: liked
                    ? "rgba(16, 185, 129, 0.15)"
                    : "rgba(255, 255, 255, 0.05)",
                  color: liked ? "var(--emerald-400)" : "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Icon name="thumbs-up" size={16} />
                Like {likesCount > 0 && <span>({likesCount})</span>}
              </button>

              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {comments.length} Comments
              </span>
            </div>

            {/* Comment Form */}
            <form
              onSubmit={handleAddComment}
              style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
              <Avatar src={user?.profileImage} size={32} />
              <input
                type="text"
                placeholder="Write a comment about this project..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "20px",
                  border: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))",
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
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border: "none",
                  background: "var(--emerald-500)",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  opacity: commentText.trim() ? 1 : 0.5,
                }}
              >
                Comment
              </button>
            </form>

            {/* Comments List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {comments.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((comm) => (
                  <div
                    key={comm._id}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      background: "rgba(255, 255, 255, 0.02)",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <Avatar src={comm.author?.profile_picture} size={32} />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "700",
                            fontSize: "0.85rem",
                            color: "white",
                          }}
                        >
                          {comm.author?.full_name || "User"}
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
                      {(comm.author?._id === user?.id || comm.author === user?.id) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comm._id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            padding: 0,
                            marginTop: "6px",
                          }}
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
    </div>
  );
}
