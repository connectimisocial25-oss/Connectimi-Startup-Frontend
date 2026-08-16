import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import Icon from "../Icon";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import { useFeed } from "../../context/FeedContext";
import API from "../../services/api";

const InsightCard = React.memo(({
  insight,
  user,
  expandedComments,
  commentText,
  onToggleComments,
  onCommentTextChange,
  onCreateComment,
  onDeleteComment,
  onDeletePost,
  onOpenModal,
  onLike,
  onShare,
  navigate,
}) => {
  const [localLiked, setLocalLiked] = useState(insight.liked);
  const [localLikesCount, setLocalLikesCount] = useState(insight.likes);
  const likeBtnRef = useRef(null);
  const shareBtnRef = useRef(null);

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    if (insight.authorId && navigate) {
      navigate(`/profile/${insight.authorId}`);
    }
  };

  useEffect(() => {
    setLocalLiked(insight.liked);
    setLocalLikesCount(insight.likes);
  }, [insight.liked, insight.likes]);

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
        }
      );
    }

    const nextLiked = !localLiked;
    const nextCount = nextLiked ? localLikesCount + 1 : Math.max(0, localLikesCount - 1);
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
        }
      );
    }

    onShare(insight);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className={`insight-card ${!insight.image ? "insight-card--text-only" : ""}`}>
      {insight.image && (
        <div
          className="insight-image-wrapper"
          onClick={() => onOpenModal(insight)}
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
        {insight.title && insight.title !== "Untitled Post" && insight.title !== insight.takeaway && (
          <h3
            className="insight-title"
            style={{ cursor: "pointer" }}
            onClick={() => onOpenModal(insight)}
          >
            {insight.title}
          </h3>
        )}

        {insight.takeaway && (
          <div className="insight-takeaway">
            {insight.title && insight.title !== "Untitled Post" && insight.title !== insight.takeaway && (
              <span className="takeaway-label">KEY TAKEAWAY:</span>
            )}
            <p>
              {truncateText(insight.takeaway, insight.image ? 100 : 200)}
              {insight.takeaway && insight.takeaway.length > (insight.image ? 100 : 200) && (
                <span
                  style={{
                    color: "var(--primary-green)",
                    cursor: "pointer",
                    fontWeight: "500",
                    marginLeft: "4px",
                  }}
                  onClick={() => onOpenModal(insight)}
                >
                  See More...
                </span>
              )}
            </p>
          </div>
        )}

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

        <div className="insight-actions-new">
          <div className="action-main-row">
            <button
              type="button"
              className={`btn-like-text ${localLiked ? "active" : ""}`}
              onClick={handleLikeClick}
              ref={likeBtnRef}
            >
              <Icon name="thumbs-up" />
              Like{localLikesCount > 0 && <span className="like-count">{localLikesCount}</span>}
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
                onChange={(e) => onCommentTextChange(insight.id, e.target.value)}
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
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                                  { day: "numeric", month: "short" }
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

      <div
        className="insight-footer-author"
        style={{ position: "relative", cursor: insight.authorId ? "pointer" : "default" }}
        onClick={handleAuthorClick}
      >
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
            onClick={(e) => {
              e.stopPropagation();
              onDeletePost(insight.id);
            }}
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

InsightCard.displayName = "InsightCard";

const ShareModal = React.memo(({ insight, onClose, onCopyLink, onNativeShare, onSocialShare, onRepost }) => {
  const shareModalRef = useRef(null);
  const shareOverlayRef = useRef(null);

  useEffect(() => {
    if (shareOverlayRef.current && shareModalRef.current) {
      gsap.fromTo(
        shareOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        shareModalRef.current,
        { scale: 0.92, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" }
      );
    }
  }, []);

  const handleClose = () => {
    if (shareOverlayRef.current && shareModalRef.current) {
      gsap.to(shareModalRef.current, { scale: 0.94, opacity: 0, y: 12, duration: 0.2, ease: "power2.in" });
      gsap.to(shareOverlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!insight) return null;

  return (
    <div
      ref={shareOverlayRef}
      className="post-modal-overlay"
      onClick={(e) => { if (e.target === shareOverlayRef.current) handleClose(); }}
    >
      <div ref={shareModalRef} className="share-modal-card">
        <button className="post-modal-close" onClick={handleClose}>
          <Icon name="close" size={18} />
        </button>

        <h3 className="share-modal-title">Share Insight</h3>
        <p className="share-modal-subtitle">Share this post by {insight.author} with your network.</p>

        <div className="share-options-grid">
          <button type="button" className="share-option-btn" onClick={() => { onCopyLink(insight); handleClose(); }}>
            <div className="share-option-icon">
              <Icon name="link" size={18} />
            </div>
            <div>
              <span className="share-option-label">Copy Link</span>
              <span className="share-option-desc">Copy direct post URL to your clipboard</span>
            </div>
          </button>

          {typeof navigator !== "undefined" && navigator.share && (
            <button type="button" className="share-option-btn" onClick={() => { onNativeShare(insight); handleClose(); }}>
              <div className="share-option-icon">
                <Icon name="share" size={18} />
              </div>
              <div>
                <span className="share-option-label">Native Share</span>
                <span className="share-option-desc">Share using your device's native app menu</span>
              </div>
            </button>
          )}

          <button type="button" className="share-option-btn" onClick={() => { onRepost(insight); handleClose(); }}>
            <div className="share-option-icon" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
              <Icon name="project" size={18} />
            </div>
            <div>
              <span className="share-option-label">Repost on Connectimi</span>
              <span className="share-option-desc">Quote this insight in a new feed post</span>
            </div>
          </button>
        </div>

        <div className="share-socials-header">Share directly to</div>
        <div className="share-socials-row">
          <button type="button" className="social-share-btn" onClick={() => { onSocialShare("linkedin", insight); handleClose(); }}>
            <Icon name="linkedin" size={20} style={{ color: "#0a66c2" }} />
            LinkedIn
          </button>
          <button type="button" className="social-share-btn" onClick={() => { onSocialShare("twitter", insight); handleClose(); }}>
            <Icon name="twitter" size={20} style={{ color: "#1da1f2" }} />
            Twitter
          </button>
          <button type="button" className="social-share-btn" onClick={() => { onSocialShare("whatsapp", insight); handleClose(); }}>
            <Icon name="whatsapp" size={20} style={{ color: "#25d366" }} />
            WhatsApp
          </button>
          <button type="button" className="social-share-btn" onClick={() => { onSocialShare("email", insight); handleClose(); }}>
            <Icon name="mail" size={20} style={{ color: "#f59e0b" }} />
            Email
          </button>
        </div>
      </div>
    </div>
  );
});

ShareModal.displayName = "ShareModal";

const Feed = () => {
  const feedRef = useRef(null);
  const modalRef = useRef(null);
  const postModalRef = useRef(null);
  const postOverlayRef = useRef(null);
  const postTextareaRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const likeRefs = useRef({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    feedPosts,
    feedLoading,
    fetchFeed,
    patchFeedPost,
    prependFeedPost,
    removeFeedPost,
    hasFetchedFeed,
  } = useFeed();

  // State for managing "See More" modal, post modal, share modal, and toast feedback
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sharingInsight, setSharingInsight] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postImages, setPostImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedPostComments, setExpandedPostComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const modalFileInputRef = useRef(null);
  const currentUserId = user?.id ?? null;

  // ─── Fixed mapper ─────────────────────────────────────────────
  const mapPostToInsight = (post, currentUserId) => {
    const projectObj =
      post.project ||
      (typeof post.projectId === "object" ? post.projectId : null) ||
      (typeof post.project_id === "object" ? post.project_id : null);

    const postTitle = post.title || (projectObj ? projectObj.title : null);
    const postContent =
      post.content ||
      post.takeaway ||
      (projectObj ? projectObj.short_description || projectObj.shortDescription : "");

    return {
      id: post.id || post._id,

      // Author fields
      author: post.author?.name || post.author?.fullName || "Anonymous",
      authorHeadline: post.author?.headline || "",
      authorImg: post.author?.profile_picture || post.author?.profileImage || "/images/default_profile_picture.png",
      authorId: post.author?.id || post.author?._id || post.author_id,

      // Content
      title: postTitle,
      takeaway: postContent,

      // Media
      image:
        post.media?.length > 0
          ? post.media[0].url
          : projectObj?.cover_image_url ||
            projectObj?.coverImageUrl ||
            (typeof projectObj?.cover_image === "string" ? projectObj.cover_image : projectObj?.cover_image?.url) ||
            projectObj?.coverImage?.url ||
            null,
      images: (() => {
        if (post.media?.length > 0) return post.media.map((m) => m.url);
        if (!projectObj) return [];
        const cover =
          projectObj.cover_image_url ||
          projectObj.coverImageUrl ||
          (typeof projectObj.cover_image === "string" ? projectObj.cover_image : projectObj.cover_image?.url) ||
          projectObj.coverImage?.url;
        const galleryUrls = (projectObj.gallery || [])
          .map((item) => (typeof item === "string" ? item : item?.url))
          .filter(Boolean);
        const all = [cover, ...galleryUrls].filter(Boolean);
        return Array.from(new Set(all)).slice(0, 3);
      })(),

      // Likes — check user_id (PG) or id/_id
      liked: currentUserId
        ? post.likes?.some(
            (like) =>
              (like.user_id || like.id || like._id || like).toString() ===
              currentUserId.toString()
          )
        : false,
      likes: post.likes?.length || 0,

      // Comments count
      comments: post.comments?.length || 0,
      commentsData: (post.comments || []).map((c) => ({
        id: c.id || c._id,
        authorId: c.author?.id || c.author?._id || c.author_id || c.author,
        authorName: c.author?.name || c.author?.fullName || "Anonymous",
        authorImg: c.author?.profile_picture || c.author?.profileImage || null,
        text: c.text,
        createdAt: c.created_at || c.createdAt,
      })),

      // Timestamp
      createdAt: post.created_at || post.createdAt,

      // Post type & project data
      type: post.type || (projectObj ? "project" : "post"),
      projectId:
        post.project_id ||
        post.projectId?.id ||
        post.projectId?._id ||
        post.projectId ||
        null,
      project: projectObj,
    };
  };

  useEffect(() => {
    if (!currentUserId) return;

    fetchFeed().catch((err) => {
      console.error("Failed to load feed:", err.message);
    });
  }, [currentUserId, fetchFeed]);

  const insights = useMemo(() => {
    return feedPosts.map((post) => mapPostToInsight(post, currentUserId));
  }, [feedPosts, currentUserId]);

  useEffect(() => {
    if (feedLoading || !hasFetchedFeed) return;
    if (hasAnimatedRef.current) return;

    const timer = setTimeout(() => {
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
        hasAnimatedRef.current = true;
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

    return () => clearTimeout(timer);
  }, [feedPosts, hasFetchedFeed]);

  useEffect(() => {
    if (selectedInsight && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    }
  }, [selectedInsight]);

  const showToast = React.useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((prev) => (prev === msg ? null : prev)), 3000);
  }, []);

  const handleOpenShareModal = React.useCallback((insight) => {
    setSharingInsight(insight);
  }, []);

  const handleCopyLink = React.useCallback((insight) => {
    const postUrl = `${window.location.origin}/home?post=${insight.id}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(postUrl).then(() => {
        showToast("Link copied to clipboard!");
      }).catch(() => {
        showToast(`Post link: ${postUrl}`);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        showToast("Link copied to clipboard!");
      } catch {
        showToast(`Post link: ${postUrl}`);
      }
      document.body.removeChild(textArea);
    }
  }, [showToast]);

  const handleNativeShare = React.useCallback(async (insight) => {
    const postUrl = `${window.location.origin}/home?post=${insight.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${insight.author} on Connectimi`,
          text: insight.takeaway || "Check out this insight on Connectimi",
          url: postUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopyLink(insight);
        }
      }
    } else {
      handleCopyLink(insight);
    }
  }, [handleCopyLink]);

  const handleSocialShare = React.useCallback((platform, insight) => {
    const postUrl = encodeURIComponent(`${window.location.origin}/home?post=${insight.id}`);
    const text = encodeURIComponent(`Check out this post by ${insight.author} on Connectimi: "${insight.takeaway?.slice(0, 100) || ""}"`);
    let shareUrl = "";

    switch (platform) {
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${postUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${postUrl}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(`Insight by ${insight.author} on Connectimi`)}&body=${text}%0A%0A${postUrl}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      if (platform === "email") {
        window.location.href = shareUrl;
      } else {
        window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
      }
    }
  }, []);

  const handleLike = React.useCallback(async (id) => {
    try {
      const res = await API.post(`/posts/${id}/like`);
      const { liked, like_count } = res.data;

      patchFeedPost(id, (post) => {
        const existingLikes = post.likes || [];
        const normalizedCurrentUserId = currentUserId?.toString();
        const otherLikes = existingLikes.filter(
          (like) => (like.id || like._id || like).toString() !== normalizedCurrentUserId,
        );

        return {
          ...post,
          likes: liked
            ? [currentUserId, ...otherLikes].slice(0, like_count)
            : otherLikes.slice(0, like_count),
        };
      });

      setSelectedInsight((prev) =>
        prev?.id === id ? { ...prev, liked, likes: like_count } : prev
      );
    } catch (err) {
      console.error("Failed to toggle like:", err.message);
    }
  }, [currentUserId, patchFeedPost]);

  const handleCreateComment = React.useCallback(async (postId, text) => {
    if (!text.trim()) return;
    try {
      const res = await API.post(`/posts/${postId}/comments`, { text });
      const newComment = res.data.comment;
      
      const hydratedComment = {
        ...newComment,
        author: {
          id: user?.id || user?._id,
          _id: user?.id || user?._id,
          name: user?.fullName || user?.name || "You",
          profile_picture: user?.profileImage || null,
        },
      };

      patchFeedPost(postId, (post) => ({
        ...post,
        comments: [...(post.comments || []), hydratedComment],
      }));

      setNewCommentText(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  }, [user, patchFeedPost]);

  const handleDeleteComment = React.useCallback(async (postId, commentId) => {
    try {
      await API.delete(`/posts/${postId}/comments/${commentId}`);
      patchFeedPost(postId, (post) => ({
        ...post,
        comments: (post.comments || []).filter((comment) => (comment.id || comment._id) !== commentId),
      }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  }, [patchFeedPost]);

  const handleDeletePost = React.useCallback(async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      removeFeedPost(postId);
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  }, [removeFeedPost]);

  const openProjectModal = React.useCallback((insight) => {
    setSelectedInsight(insight);
  }, []);

  const closeProjectModal = React.useCallback(() => {
    setSelectedInsight(null);
  }, []);

  const handleToggleComments = React.useCallback((id) => {
    setExpandedPostComments((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCommentTextChange = React.useCallback((id, text) => {
    setNewCommentText((prev) => ({ ...prev, [id]: text }));
  }, []);

  const openPostModal = React.useCallback(() => {
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
  }, []);

  const handleRepost = React.useCallback((insight) => {
    setNewPostContent(`Quote from @${insight.author}: "${insight.takeaway?.slice(0, 150) || ""}"\n\n`);
    openPostModal();
  }, [openPostModal]);

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

      prependFeedPost(res.data.post);
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
            <span className="share-placeholder">Share legal insights, case law updates, constitutional analysis...</span>
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
            onClick={() => navigate("/projects/new")}
          >
            <Icon name="project" style={{ color: "#3b82f6" }} /> Legal Brief
          </button>
          <button
            type="button"
            className="btn-icon-text"
            onClick={() => { openPostModal(); setTimeout(() => modalFileInputRef.current?.click(), 300); }}
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
      {feedLoading || !hasFetchedFeed ? (
        <div className="insights-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="feed-skeleton-card">
              <div className="feed-skeleton-author">
                <div className="feed-skeleton-avatar" />
                <div className="feed-skeleton-author-info">
                  <div className="feed-skeleton-line" style={{ width: "45%" }} />
                  <div className="feed-skeleton-line" style={{ width: "30%", height: "10px", marginTop: "6px" }} />
                </div>
              </div>
              <div className="feed-skeleton-body">
                <div className="feed-skeleton-line" style={{ width: "90%" }} />
                <div className="feed-skeleton-line" style={{ width: "75%" }} />
                <div className="feed-skeleton-line" style={{ width: "60%" }} />
              </div>
              <div className="feed-skeleton-actions">
                <div className="feed-skeleton-btn" />
                <div className="feed-skeleton-btn" />
                <div className="feed-skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="insights-grid">
          {insights.length === 0 ? (
            <div className="feed-empty-state">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            insights.map((insight) =>
              insight.type === "project" ? (
                <ProjectCard
                  key={insight.id}
                  insight={insight}
                  user={user}
                  expandedComments={!!expandedPostComments[insight.id]}
                  commentText={newCommentText[insight.id] || ""}
                  onToggleComments={handleToggleComments}
                  onCommentTextChange={handleCommentTextChange}
                  onCreateComment={handleCreateComment}
                  onDeleteComment={handleDeleteComment}
                  onDeletePost={handleDeletePost}
                  onLike={handleLike}
                  onShare={handleOpenShareModal}
                  onOpenProjectModal={(pId, ins) => setSelectedProject({ id: pId, insight: ins })}
                />
              ) : (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  user={user}
                  expandedComments={!!expandedPostComments[insight.id]}
                  commentText={newCommentText[insight.id] || ""}
                  onToggleComments={handleToggleComments}
                  onCommentTextChange={handleCommentTextChange}
                  onCreateComment={handleCreateComment}
                  onDeleteComment={handleDeleteComment}
                  onDeletePost={handleDeletePost}
                  onOpenModal={openProjectModal}
                  onLike={handleLike}
                  onShare={handleOpenShareModal}
                  navigate={navigate}
                />
              )
            )
          )}
        </div>
      )}

      {/* Share Modal Overlay */}
      {sharingInsight && (
        <ShareModal
          insight={sharingInsight}
          onClose={() => setSharingInsight(null)}
          onCopyLink={handleCopyLink}
          onNativeShare={handleNativeShare}
          onSocialShare={handleSocialShare}
          onRepost={handleRepost}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="share-toast">
          <Icon name="check" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

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
              placeholder="What constitutional or legal insights do you want to share today?"
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
              backgroundColor: "var(--glass-bg, rgba(30, 41, 59, 0.75))",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              border: "1px solid var(--glass-border, rgba(255, 255, 255, 0.1))",
              maxWidth: "880px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--surface-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface-faint)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px", cursor: selectedInsight.authorId ? "pointer" : "default" }}
                onClick={() => {
                  if (selectedInsight.authorId) {
                    closeProjectModal();
                    navigate(`/profile/${selectedInsight.authorId}`);
                  }
                }}
              >
                <Avatar src={selectedInsight.authorImg} size={42} />
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: "700", margin: 0, color: "var(--text-primary)" }}>
                    {selectedInsight.author}
                  </h4>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                    {selectedInsight.authorHeadline || "Member"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeProjectModal}
                style={{
                  background: "var(--surface-hover)",
                  border: "none",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-primary)",
                  transition: "background 0.2s",
                }}
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Post Image Container (Dynamic Height) */}
              {selectedInsight.image && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                    borderBottom: "1px solid var(--surface-border)",
                    padding: "10px 0",
                  }}
                >
                  <img
                    src={selectedInsight.image}
                    alt={selectedInsight.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "480px",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              )}

              {/* Two Column Layout for Body & Interactions */}
              <div className="post-modal-body-grid">

                {/* Left Column: Post Content & Comments */}
                <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* Post Content Text */}
                  <div style={{ wordBreak: "break-word" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        lineHeight: "1.6",
                        color: "var(--text-primary)",
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selectedInsight.takeaway}
                    </p>
                  </div>

                  {/* Interactive Comments Section */}
                  <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "20px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>
                      Discussion ({selectedInsight.comments})
                    </h4>
                    
                    {/* Add Comment Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateComment(selectedInsight.id, newCommentText[selectedInsight.id] || "");
                      }}
                      style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
                    >
                      <Avatar src={user?.profileImage} size={32} />
                      <input
                        type="text"
                        placeholder="Add to the discussion..."
                        value={newCommentText[selectedInsight.id] || ""}
                        onChange={(e) => setNewCommentText(prev => ({ ...prev, [selectedInsight.id]: e.target.value }))}
                        style={{
                          flex: 1,
                          padding: "10px 16px",
                          borderRadius: "24px",
                          border: "1px solid var(--surface-border)",
                          background: "var(--surface-faint)",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.85rem",
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!(newCommentText[selectedInsight.id] || "").trim()}
                        style={{
                          padding: "8px 18px",
                          borderRadius: "24px",
                          border: "none",
                          background: "var(--emerald-500)",
                          color: "var(--on-primary)",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          opacity: (newCommentText[selectedInsight.id] || "").trim() ? 1 : 0.55,
                        }}
                      >
                        Post
                      </button>
                    </form>

                    {/* Comments List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {(selectedInsight.commentsData || []).length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "10px 0" }}>
                          No comments yet. Start the conversation!
                        </p>
                      ) : (
                        (selectedInsight.commentsData || []).map((comm) => (
                          <div key={comm.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <Avatar src={comm.authorImg} size={30} />
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                              <div
                                style={{
                                  background: "var(--surface-faint)",
                                  padding: "10px 14px",
                                  borderRadius: "14px",
                                  border: "1px solid var(--surface-border)",
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                  <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                                    {comm.authorName}
                                  </span>
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                    {comm.createdAt ? new Date(comm.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                                  </span>
                                </div>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, whiteSpace: "pre-wrap" }}>
                                  {comm.text}
                                </p>
                              </div>
                              {comm.authorId === user?.id && (
                                <button
                                  onClick={() => handleDeleteComment(selectedInsight.id, comm.id)}
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
                </div>

                {/* Right Column: Actions Sidebar */}
                <div className="post-modal-sidebar">

                  {/* Actions Area */}
                  <div>
                    <button
                      type="button"
                      className={`btn-like-text ${selectedInsight.liked ? "active" : ""}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLike(selectedInsight.id); }}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: "20px",
                        background: selectedInsight.liked ? "rgba(16, 185, 129, 0.15)" : "var(--surface-faint)",
                        border: "1px solid var(--surface-border)",
                        color: selectedInsight.liked ? "var(--primary-green)" : "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        marginBottom: "12px",
                        transition: "all 0.2s",
                      }}
                      ref={(el) => (likeRefs.current[`modal-${selectedInsight.id}`] = el)}
                    >
                      <Icon name="thumbs-up" /> {selectedInsight.liked ? "Liked" : "Like"}
                    </button>

                    <button
                      style={{
                        backgroundColor: "var(--primary-green)",
                        color: "var(--on-primary)",
                        border: "none",
                        borderRadius: "20px",
                        padding: "10px 16px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                      }}
                    >
                      <Icon name="comment-dots" /> Message Owner
                    </button>
                  </div>

                  {/* Info Stats */}
                  <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                      <span>Likes</span>
                      <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{selectedInsight.likes}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      <span>Comments</span>
                      <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{selectedInsight.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal Component */}
      {selectedProject && (
        <ProjectModal
          projectId={selectedProject.id}
          initialInsight={selectedProject.insight}
          onClose={() => setSelectedProject(null)}
          currentUser={user}
        />
      )}
    </main>
  );
};

export default Feed;
