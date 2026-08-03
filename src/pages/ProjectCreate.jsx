import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { createProject } from "../services/projectApi";
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

export default function ProjectCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
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

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [challenges, setChallenges] = useState("");
  const [learnings, setLearnings] = useState("");

  // Step Validation Errors
  const [errors, setErrors] = useState({});

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

  // ─── Image Upload Handlers ────────────────────────────────────────────────

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    addImages(selectedFiles);
  };

  const addImages = (newFiles) => {
    setErrors((prev) => ({ ...prev, images: null }));

    if (images.length + newFiles.length > 3) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 3 images allowed in total.",
      }));
      return;
    }

    const validFiles = [];
    const validPreviews = [];

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          images: "Only image files are allowed.",
        }));
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: `"${file.name}" exceeds maximum allowed size of 1 MB.`,
        }));
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...validPreviews]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
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

  // ─── Submit Project ───────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setLoading(true);
    setServerError("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("shortDescription", shortDescription.trim());
      formData.append("description", description.trim());

      if (githubUrl.trim()) formData.append("githubUrl", githubUrl.trim());
      if (liveDemoUrl.trim()) formData.append("liveDemoUrl", liveDemoUrl.trim());

      formData.append("status", status);
      formData.append("category", category);
      if (duration.trim()) formData.append("duration", duration.trim());

      formData.append("techStack", JSON.stringify(techStack));
      formData.append("features", JSON.stringify(features));

      if (challenges.trim()) formData.append("challenges", challenges.trim());
      if (learnings.trim()) formData.append("learnings", learnings.trim());

      // Append image files under "images" array key
      images.forEach((imgFile) => {
        formData.append("images", imgFile);
      });

      const res = await createProject(formData);
      const newProjectId = res.project?._id;

      if (newProjectId) {
        navigate(`/projects/${newProjectId}`);
      } else {
        navigate("/home");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.message ||
          "Failed to create project. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-create-container">
      <div className="project-create-card">
        <div className="project-create-header">
          <h1 className="project-create-title">Create Project Showcase</h1>
          <p className="project-create-subtitle">
            Highlight your software project to your network on Connectimi.
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
                placeholder="e.g. Connectimi Developer Portal"
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
                placeholder="Brief summary for feed card (max 300 chars)"
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
                placeholder="Detailed overview of what your project does, the problem it solves, architecture, etc."
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
                placeholder="e.g. 2 months, Jan 2026 - Mar 2026"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 4: Images */}
        {currentStep === 4 && (
          <div className="step-form-content">
            <div className="form-group">
              <label className="form-label">Project Images (Max 3, Max 1MB each)</label>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                }}
              >
                The first image will be set as the <strong>Cover Image</strong>. You can upload up to 2 additional gallery images.
              </p>

              {images.length < 3 && (
                <div
                  className="image-upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="upload" size={24} style={{ marginBottom: "8px" }} />
                  <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                    Click to select images
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Supported formats: JPEG, PNG, WebP, GIF (Max 1 MB each)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
              )}

              {errors.images && (
                <span className="form-error-msg">{errors.images}</span>
              )}

              <div className="image-previews-grid">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="image-preview-card">
                    <img src={src} alt={`Upload ${idx + 1}`} />
                    {idx === 0 && <span className="cover-badge">Cover</span>}
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
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
                  placeholder="Type feature and press Enter (max 10)..."
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
                placeholder="What major engineering challenges did you solve?"
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
                placeholder="What did you learn from building this project?"
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
              disabled={loading}
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(-1)}
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
              disabled={loading}
            >
              {loading ? "Publishing Project..." : "Publish Project"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
