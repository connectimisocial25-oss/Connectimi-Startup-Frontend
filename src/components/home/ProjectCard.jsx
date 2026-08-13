import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import Icon from "../Icon";
import gsap from "gsap";

const ProjectCard = React.memo(({
  insight,
  user,
  expandedComments,
  commentText,
  onToggleComments,
  onCommentTextChange,
  onCreateComment,
  onDeleteComment,
  onDeletePost,
  onLike,
  onShare,
  onOpenProjectModal,
  onOpenModal,
}) => {
  const navigate = useNavigate();
  const [localLiked, setLocalLiked] = useState(insight.liked);
  const [localLikesCount, setLocalLikesCount] = useState(insight.likes);
  const likeBtnRef = useRef(null);
  const shareBtnRef = useRef(null);

  useEffect(() => {
    setLocalLiked(insight.liked);
    setLocalLikesCount(insight.likes);
  }, [insight.liked, insight.likes]);

  const projectInfo = insight.project || {};
  const projectId = projectInfo._id || projectInfo.id || insight.projectId || insight.id;

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (onOpenProjectModal && projectId) {
      onOpenProjectModal(projectId, insight);
    } else if (onOpenModal) {
      onOpenModal(insight);
    } else if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (likeBtnRef.current) {
      gsap.fromTo(
        likeBtnRef.current,
        { scale: 1 },
        {
          scale: 1.35,
          duration: 0.12,
          ease: "power2.out",
          onComplete: () =>
            gsap.to(likeBtnRef.current, {
              scale: 1,
              duration: 0.2,
              ease: "elastic.out(1.2, 0.4)",
            }),
        },
      );
    }

    const nextLiked = !localLiked;
    const nextCount = nextLiked
      ? localLikesCount + 1
      : Math.max(0, localLikesCount - 1);
    setLocalLiked(nextLiked);
    setLocalLikesCount(nextCount);

    onLike(insight.id);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (shareBtnRef.current) {
      gsap.fromTo(
        shareBtnRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          duration: 0.12,
          ease: "power2.out",
          onComplete: () =>
            gsap.to(shareBtnRef.current, {
              scale: 1,
              duration: 0.2,
              ease: "elastic.out(1.2, 0.4)",
            }),
        },
      );
    }

    onShare(insight);
  };

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const coverImage =
    projectInfo.cover_image_url ||
    projectInfo.coverImageUrl ||
    (typeof projectInfo.cover_image === "string"
      ? projectInfo.cover_image
      : projectInfo.cover_image?.url) ||
    projectInfo.coverImage?.url ||
    insight.image;

  const galleryItems = (projectInfo.gallery || [])
    .map((item) => (typeof item === "string" ? item : item?.url))
    .filter(Boolean);

  const allProjectPhotos = Array.from(
    new Set([coverImage, ...galleryItems].filter(Boolean))
  ).slice(0, 3);

  const displayImage = allProjectPhotos[activePhotoIndex] || coverImage;
  const projectTitle = projectInfo.title || insight.title || "Untitled Project";
  const shortDesc =
    projectInfo.shortDescription ||
    projectInfo.short_description ||
    insight.takeaway ||
    "";
  const techStack = projectInfo.techStack || projectInfo.tech_stack || [];
  const status = projectInfo.status || "completed";

  // Limit tech stack chips to max 3 on the feed card
  const visibleTech = techStack.slice(0, 3);
  const remainingTechCount = techStack.length - 3;

  return (
    <div
      className="insight-card project-feed-card"
      style={{
        border: "1px solid rgba(16, 185, 129, 0.25)",
        background: "var(--card-bg)",
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Cover / Multi-photo Image Header */}
      {displayImage && (
        <div
          className="insight-image-wrapper"
          onClick={handleCardClick}
          style={{ cursor: "pointer", maxHeight: "240px", position: "relative" }}
        >
          <img src={displayImage} alt={projectTitle} className="insight-image" />

          {/* Multi-photo Badge & Navigation */}
          {allProjectPhotos.length > 1 && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: "700",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Icon name="image" size={12} />
              {activePhotoIndex + 1} / {allProjectPhotos.length}
            </div>
          )}

          {allProjectPhotos.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "6px",
                zIndex: 2,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {allProjectPhotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  style={{
                    width: activePhotoIndex === idx ? "16px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    border: "none",
                    background: activePhotoIndex === idx ? "var(--emerald-400, #34d399)" : "rgba(255, 255, 255, 0.5)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}

          <button className="btn-arrow-overlay">
            <Icon name="arrow-right" />
          </button>
        </div>
      )}

      <div className="insight-body">
        {/* Header row: Project Badge + Category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <span
            className={`project-status-badge ${status}`}
            style={{ fontSize: "0.7rem", padding: "2px 8px" }}
          >
            PROJECT • {status}
          </span>
        </div>

        {/* Project Title */}
        <h3
          className="insight-title"
          style={{ cursor: "pointer", fontSize: "1.2rem", fontWeight: "700" }}
          onClick={handleCardClick}
        >
          {projectTitle}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            lineHeight: "1.5",
            marginBottom: "14px",
          }}
        >
          {shortDesc}
        </p>

        {/* Tech Stack Chips (max 3) */}
        {visibleTech.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "16px",
            }}
          >
            {visibleTech.map((tech, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.75rem",
                  padding: "3px 10px",
                  borderRadius: "14px",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "var(--emerald-400, #34d399)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  fontWeight: "600",
                }}
              >
                {tech}
              </span>
            ))}
            {remainingTechCount > 0 && (
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "3px 10px",
                  borderRadius: "14px",
                  background: "var(--surface-faint)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--surface-border)",
                }}
              >
                +{remainingTechCount} more
              </span>
            )}
          </div>
        )}

        {/* Created Date */}
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginBottom: "12px",
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

        {/* Action Bar: Like / Comment / Share */}
        <div className="insight-actions-new">
          <div className="action-main-row">
            <button
              type="button"
              className={`btn-like-text ${localLiked ? "active" : ""}`}
              onClick={handleLikeClick}
              ref={likeBtnRef}
            >
              <Icon name="thumbs-up" />
              Like
              {localLikesCount > 0 && (
                <span className="like-count">{localLikesCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`btn-comment-box ${expandedComments ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleComments(insight.id);
              }}
            >
              <Icon name="comment" /> Comment
            </button>
          </div>

          <button
            type="button"
            className="btn-share-center"
            onClick={handleShareClick}
            ref={shareBtnRef}
          >
            <Icon name="share" /> Share
          </button>
        </div>

        {/* Comments Section */}
        {expandedComments && (
          <div
            className="comments-section"
            style={{
              borderTop: "1px solid var(--surface-border)",
              marginTop: "15px",
              paddingTop: "15px",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreateComment(insight.id, commentText || "");
              }}
              style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
            >
              <Avatar src={user?.profileImage} size={32} />
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText || ""}
                onChange={(e) =>
                  onCommentTextChange(insight.id, e.target.value)
                }
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "20px",
                  border: "1px solid var(--surface-border)",
                  background: "var(--surface-faint)",
                  color: "var(--text-primary)",
                  outline: "none",
                  fontSize: "0.85rem",
                }}
              />
              <button
                type="submit"
                disabled={!(commentText || "").trim()}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  background: "var(--emerald-500)",
                  color: "var(--on-primary)",
                  cursor: "pointer",
                  fontWeight: "600",
                  opacity: (commentText || "").trim() ? 1 : 0.5,
                }}
              >
                Post
              </button>
            </form>

            <div
              className="comments-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {(insight.commentsData || []).length === 0 ? (
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    margin: "10px 0",
                  }}
                >
                  No comments yet.
                </p>
              ) : (
                (insight.commentsData || []).map((comm) => (
                  <div
                    key={comm.id}
                    className="comment-item"
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <Avatar src={comm.authorImg} size={28} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          background: "var(--surface-faint)",
                          padding: "10px 14px",
                          borderRadius: "12px",
                          border: "1px solid var(--surface-border)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "700",
                              fontSize: "0.85rem",
                              color: "var(--text-primary)",
                            }}
                          >
                            {comm.authorName}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {comm.createdAt
                              ? new Date(comm.createdAt).toLocaleDateString(
                                  "en-IN",
                                  { day: "numeric", month: "short" },
                                )
                              : ""}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            margin: 0,
                          }}
                        >
                          {comm.text}
                        </p>
                      </div>
                      {comm.authorId === user?.id && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteComment(insight.id, comm.id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--error)",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            alignSelf: "flex-start",
                            marginTop: "4px",
                            padding: 0,
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

      {/* Author Footer */}
      <div className="insight-footer-author" style={{ position: "relative" }}>
        <Avatar src={insight.authorImg} size={32} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="insight-author-name">{insight.author}</span>
          {insight.authorHeadline && (
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {insight.authorHeadline}
            </span>
          )}
        </div>
        {insight.authorId === user?.id && (
          <button
            className="post-delete-btn"
            onClick={() => onDeletePost(insight.id)}
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--error)",
              fontSize: "1rem",
              transition: "color 0.2s",
            }}
            title="Delete Post"
          >
            <Icon name="trash" size={16} />
          </button>
        )}
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
