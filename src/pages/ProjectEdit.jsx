import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { getProject, updateProject } from "../services/projectApi";
import "./ProjectCreate.css";

const STEPS = [
  { id: 1, name: "Basic Info" },
  { id: 2, name: "Links" },
  { id: 3, name: "Details" },
  { id: 4, name: "Images" },
  { id: 5, name: "Additional" },
];

const STATUS_OPTIONS = [
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
  { value: "planned", label: "Planned" },
];

const CATEGORY_OPTIONS = [
  { value: "web", label: "Web Application" },
  { value: "mobile", label: "Mobile App" },
  { value: "ai-ml", label: "AI / Machine Learning" },
  { value: "devops", label: "DevOps & Cloud" },
  { value: "open-source", label: "Open Source Tool" },
  { value: "other", label: "Other" },
];

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");

  const [status, setStatus] = useState("in-progress");
  const [category, setCategory] = useState("web");
  const [duration, setDuration] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [existingCover, setExistingCover] = useState(null);
  const [existingGallery, setExistingGallery] = useState([]);

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [challenges, setChallenges] = useState("");
  const [learnings, setLearnings] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const data = await getProject(id);
      const proj = data.project;

      if (!proj) {
        setServerError("Project not found.");
        return;
      }

      if (user?.id && proj.createdBy?._id !== user.id) {
        setServerError("You are not authorized to edit this project.");
        return;
      }

      setTitle(proj.title || "");
      setShortDescription(proj.shortDescription || "");
      setDescription(proj.description || "");
      setGithubUrl(proj.githubUrl || "");
      setLiveDemoUrl(proj.liveDemoUrl || "");
      setStatus(proj.status || "in-progress");
      setCategory(proj.category || "other");
      setDuration(proj.duration || "");
      setTechStack(proj.techStack || []);
      setExistingCover(proj.coverImage || null);
      setExistingGallery(proj.gallery || []);
      setFeatures(proj.features || []);
      setChallenges(proj.challenges || "");
      setLearnings(proj.learnings || "");
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Failed to load project details.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Tag Handlers ─────────────────────────────────────────────────────────

  const handleAddTech = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = techInput.trim();
      if (val && !techStack.includes(val)) {
        setTechStack([...techStack, val]);
        setTechInput("");
        setErrors((prev) => ({ ...prev, techStack: null }));
      }
    }
  };

  const handleRemoveTech = (index) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const handleAddFeature = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = featureInput.trim();
      if (val && !features.includes(val)) {
        if (features.length >= 10) {
          setErrors((prev) => ({
            ...prev,
            features: "Maximum 10 features allowed",
          }));
          return;
        }
        setFeatures([...features, val]);
        setFeatureInput("");
        setErrors((prev) => ({ ...prev, features: null }));
      }
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // ─── Step Validation ──────────────────────────────────────────────────────

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!title.trim()) newErrors.title = "Project title is required.";
      if (!shortDescription.trim())
        newErrors.shortDescription = "Short description is required.";
      if (!description.trim())
        newErrors.description = "Full description is required.";
    }

    if (currentStep === 2) {
      if (
        githubUrl.trim() &&
        !/^https?:\/\/(www\.)?github\.com\/.+/i.test(githubUrl.trim())
      ) {
        newErrors.githubUrl =
          "Github URL must be a valid GitHub URL (e.g., https://github.com/username/repo).";
      }
      if (liveDemoUrl.trim()) {
        try {
          new URL(liveDemoUrl.trim());
        } catch {
          newErrors.liveDemoUrl = "Live Demo URL must be a valid URL.";
        }
      }
    }

    if (currentStep === 3) {
      if (techStack.length === 0) {
        newErrors.techStack = "At least 1 technology is required.";
      }
      if (!status) newErrors.status = "Status is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // ─── Save Changes ─────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setSaving(true);
    setServerError("");

    try {
      const payload = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        githubUrl: githubUrl.trim() || null,
        liveDemoUrl: liveDemoUrl.trim() || null,
        status,
        category,
        duration: duration.trim() || null,
        techStack,
        features,
        challenges: challenges.trim() || null,
        learnings: learnings.trim() || null,
      };

      await updateProject(id, payload);
      navigate(`/projects/${id}`);
    } catch (err) {
      setServerError(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.message ||
          "Failed to update project. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="project-create-container" style={{ alignItems: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Loading project details...</div>
      </div>
    );
  }

  return (
    <div className="project-create-container">
      <div className="project-create-card">
        <div className="project-create-header">
          <h1 className="project-create-title">Edit Project Showcase</h1>
          <p className="project-create-subtitle">
            Update your project information and tech details.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="stepper-nav">
          <div
            className="stepper-progress"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div
                key={step.id}
                className={`stepper-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              >
                <div className="step-number">
                  {isCompleted ? <Icon name="check" size={14} /> : step.id}
                </div>
                <span className="step-label">{step.name}</span>
              </div>
            );
          })}
        </div>

        {serverError && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              color: "#ef4444",
              marginBottom: "20px",
              fontSize: "0.85rem",
            }}
          >
            {serverError}
          </div>
        )}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="step-form-content">
            <div className="form-group">
              <label className="form-label">
                Project Title <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              {errors.title && <span className="form-error-msg">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Short Description <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                maxLength={300}
              />
              {errors.shortDescription && (
                <span className="form-error-msg">{errors.shortDescription}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Full Description <span className="required-star">*</span>
              </label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={5000}
              />
              {errors.description && (
                <span className="form-error-msg">{errors.description}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Links */}
        {currentStep === 2 && (
          <div className="step-form-content">
            <div className="form-group">
              <label className="form-label">GitHub Repository URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
              {errors.githubUrl && (
                <span className="form-error-msg">{errors.githubUrl}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Live Demo URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://myproject.com"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
              />
              {errors.liveDemoUrl && (
                <span className="form-error-msg">{errors.liveDemoUrl}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Project Details */}
        {currentStep === 3 && (
          <div className="step-form-content">
            <div className="form-group">
              <label className="form-label">
                Technologies & Tech Stack <span className="required-star">*</span>
              </label>
              <div className="tags-input-container">
                {techStack.map((tech, idx) => (
                  <span key={idx} className="tag-chip">
                    {tech}
                    <button
                      type="button"
                      className="tag-chip-remove"
                      onClick={() => handleRemoveTech(idx)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="tag-input-field"
                  placeholder="Type tech and press Enter or comma..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                />
              </div>
              {errors.techStack && (
                <span className="form-error-msg">{errors.techStack}</span>
              )}
            </div>

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
            >
              <div className="form-group">
                <label className="form-label">
                  Status <span className="required-star">*</span>
                </label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Development Duration</label>
              <input
                type="text"
                className="form-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 4: Images (Read-Only per Requirements) */}
        {currentStep === 4 && (
          <div className="step-form-content">
            <div className="form-group">
              <label className="form-label">Project Images</label>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "16px",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                ℹ️ Image editing (replacement, deletion, reordering) is disabled in this version and will be added in a future enhancement.
              </p>

              <div className="image-previews-grid">
                {existingCover?.url && (
                  <div className="image-preview-card">
                    <img src={existingCover.url} alt="Cover" />
                    <span className="cover-badge">Cover</span>
                  </div>
                )}
                {existingGallery.map((img, idx) => (
                  <div key={idx} className="image-preview-card">
                    <img src={img.url} alt={`Gallery ${idx + 1}`} />
                  </div>
                ))}
                {!existingCover?.url && existingGallery.length === 0 && (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    No images were attached to this project.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Additional Information */}
        {currentStep === 5 && (
          <div className="step-form-content">
            <div className="form-group">
              <label className="form-label">Key Features</label>
              <div className="tags-input-container">
                {features.map((feat, idx) => (
                  <span key={idx} className="tag-chip">
                    {feat}
                    <button
                      type="button"
                      className="tag-chip-remove"
                      onClick={() => handleRemoveFeature(idx)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="tag-input-field"
                  placeholder="Type feature and press Enter..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleAddFeature}
                />
              </div>
              {errors.features && (
                <span className="form-error-msg">{errors.features}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Technical Challenges Faced</label>
              <textarea
                className="form-textarea"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                rows={3}
                maxLength={2000}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Key Learnings & Insights</label>
              <textarea
                className="form-textarea"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                rows={3}
                maxLength={2000}
              />
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="step-actions">
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
              disabled={saving}
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/projects/${id}`)}
            >
              Cancel
            </button>
          )}

          {currentStep < 5 ? (
            <button type="button" className="btn-primary" onClick={handleNext}>
              Next Step
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
