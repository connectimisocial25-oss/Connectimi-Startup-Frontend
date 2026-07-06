import React, { useState, useRef } from "react";
import Icon from "./Icon";
import "./editProfile.css";
import ImageCropperModal from "./ImageCropperModal";
import { FaCamera } from "react-icons/fa";

const YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 1900 + 1 },
  (_, i) => new Date().getFullYear() - i
);

const EditForm = ({
  editData,
  setEditData,
  handleInputChange,
  handleExperienceChange,
  handleEducationChange,
  handleProjectChange,
  addExperience,
  addEducation,
  addProject,
  addSkill,
  removeExperience,
  removeEducation,
  removeProject,
  removeSkill,
  handleSave,
  isUploading,
  imagePreview,
  setImagePreview,
  bannerPreview,
  setBannerPreview,
  onCancel,
}) => {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(null); // 'profile' or 'banner'
  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setCropType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropSave = (croppedBlob) => {
    const previewUrl = URL.createObjectURL(croppedBlob);
    if (cropType === "profile") {
      setImagePreview(previewUrl);
      handleInputChange("profileImage", croppedBlob);
    } else {
      setBannerPreview(previewUrl);
      handleInputChange("bannerImage", croppedBlob);
    }
    setImageToCrop(null);
    setCropType(null);
  };

  return (
    <div className="edit-form-overlay" onClick={onCancel}>
      <div className="edit-form-content" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Profile Information</h3>

        <div className="form-grid">
          {/* Image Upload Section */}
          <div className="form-group full-width">
            <label>Profile Branding</label>
            <div className="edit-images-preview">
              <div
                className="edit-banner-preview"
                style={{ backgroundImage: `url(${bannerPreview || editData.bannerImage})` }}
                onClick={() => bannerInputRef.current.click()}
              >
                <div className="edit-image-overlay">
                  <FaCamera />
                  <span>Change Banner</span>
                </div>
              </div>
              <div
                className="edit-avatar-preview"
                style={{ backgroundImage: `url(${imagePreview || editData.profileImage})` }}
                onClick={() => profileInputRef.current.click()}
              >
                <div className="edit-image-overlay">
                  <FaCamera />
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={profileInputRef}
              onChange={(e) => handleFileChange(e, "profile")}
              accept="image/*"
              style={{ display: "none" }}
            />
            <input
              type="file"
              ref={bannerInputRef}
              onChange={(e) => handleFileChange(e, "banner")}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-name">Full Name</label>
            <input
              id="edit-name"
              type="text"
              value={editData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-headline">Headline</label>
            <input
              id="edit-headline"
              type="text"
              value={editData.headline}
              onChange={(e) => handleInputChange("headline", e.target.value)}
              placeholder="e.g., Senior Software Engineer at Company"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-location">Location</label>
            <input
              id="edit-location"
              type="text"
              value={editData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-email">Email</label>
            <input
              id="edit-email"
              type="email"
              value={editData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-phone">Phone</label>
            <input
              id="edit-phone"
              type="tel"
              value={editData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-website">Website</label>
            <input
              id="edit-website"
              type="url"
              value={editData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="edit-about">About</label>
            <textarea
              id="edit-about"
              value={editData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {/* ── Experience Section ─────────────────────────────────────────── */}
          <div className="form-section full-width">
            <h4>Experience</h4>

            {editData.experience.map((exp, index) => (
              <div
                key={exp.id || index}
                style={{ marginBottom: "1rem", border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "12px" }}
              >
                {/* Title + Company + Remove */}
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Title"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                  />
                  <button type="button" className="btn-remove" onClick={() => removeExperience(index)}>
                    <Icon name="close" />
                  </button>
                </div>

                {/* Start / End date with Present toggle */}
                <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                      START DATE
                    </label>
                    <input
                      type="date"
                      value={exp.startDate || ""}
                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                      END DATE
                      {/* <span style={{ marginLeft: "10px", fontWeight: 400, fontSize: "11px" }}>
                        <input
                          type="checkbox"
                          checked={exp.endDate === "Present"}
                          onChange={(e) =>
                            handleExperienceChange(index, "endDate", e.target.checked ? "Present" : "")
                          }
                          style={{ marginRight: "4px", cursor: "pointer" }}
                        />
                        Present
                      </span> */}
                    </label>
                    <input
                      type="date"
                      value={exp.endDate === "Present" ? "" : (exp.endDate || "")}
                      disabled={exp.endDate === "Present"}
                      onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                      style={exp.endDate === "Present" ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                    />
                  </div>
                </div>

                {/* Location + Description */}
                <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location || ""}
                    onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={exp.description || ""}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}

            {/* Add new experience */}
            <div style={{ marginTop: "1rem", border: "1px dashed var(--border-color)", padding: "1rem", borderRadius: "12px" }}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="New Title"
                  value={editData.newExperience.title}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, newExperience: { ...prev.newExperience, title: e.target.value } }))
                  }
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={editData.newExperience.company}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, newExperience: { ...prev.newExperience, company: e.target.value } }))
                  }
                />
              </div>
              <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={editData.newExperience.startDate}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, newExperience: { ...prev.newExperience, startDate: e.target.value } }))
                    }
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                    END DATE
                    <span style={{ marginLeft: "10px", fontWeight: 400, fontSize: "11px" }}>
                      {/* <input
                        type="checkbox"
                        checked={editData.newExperience.endDate === "Present"}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            newExperience: { ...prev.newExperience, endDate: e.target.checked ? "Present" : "" },
                          }))
                        }
                        style={{ marginRight: "4px", cursor: "pointer" }}
                      />
                      Present */}
                    </span>
                  </label>
                  <input
                    type="date"
                    value={editData.newExperience.endDate === "Present" ? "" : editData.newExperience.endDate}
                    disabled={editData.newExperience.endDate === "Present"}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, newExperience: { ...prev.newExperience, endDate: e.target.value } }))
                    }
                    style={editData.newExperience.endDate === "Present" ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                  />
                </div>
              </div>
              <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "0.5rem", marginBottom: 0 }}>
                <input
                  type="text"
                  placeholder="Location"
                  value={editData.newExperience.location}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, newExperience: { ...prev.newExperience, location: e.target.value } }))
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editData.newExperience.description}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, newExperience: { ...prev.newExperience, description: e.target.value } }))
                  }
                />
              </div>
              <button type="button" className="btn-add" onClick={addExperience} style={{ marginTop: "0.75rem" }}>
                <Icon name="plus" /> Add Experience
              </button>
            </div>
          </div>

          {/* ── Projects Section ───────────────────────────────────────────── */}
          <div className="form-section full-width">
            <h4>Projects</h4>
            {editData.projects.map((proj, index) => (
              <div key={proj.id || index} className="form-row">
                <input
                  type="text"
                  placeholder="Title"
                  value={proj.title}
                  onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Link"
                  value={proj.link}
                  onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                />
                <button type="button" className="btn-remove" onClick={() => removeProject(index)}>
                  <Icon name="close" />
                </button>
              </div>
            ))}

            <div className="form-row">
              <input
                type="text"
                placeholder="New Project Title"
                value={editData.newProject.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, newProject: { ...prev.newProject, title: e.target.value } }))
                }
              />
              <input
                type="text"
                placeholder="Link"
                value={editData.newProject.link}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, newProject: { ...prev.newProject, link: e.target.value } }))
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={editData.newProject.description}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, newProject: { ...prev.newProject, description: e.target.value } }))
                }
              />
              <button type="button" className="btn-add" onClick={addProject}>
                <Icon name="plus" /> Add
              </button>
            </div>
          </div>

          {/* ── Education Section ──────────────────────────────────────────── */}
          <div className="form-section full-width">
            <h4>Education</h4>

            {editData.education.map((edu, index) => (
              <div
                key={edu.id || index}
                style={{ marginBottom: "1rem", border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "12px" }}
              >
                {/* School + Degree + Remove */}
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) => handleEducationChange(index, "school", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                  />
                  <button type="button" className="btn-remove" onClick={() => removeEducation(index)}>
                    <Icon name="close" />
                  </button>
                </div>

                {/* Start Year / End Year with Present toggle */}
                <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                      START YEAR
                    </label>
                    <select
                      value={edu.startYear || ""}
                      onChange={(e) => handleEducationChange(index, "startYear", e.target.value)}
                    >
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                      END YEAR
                      <span style={{ marginLeft: "10px", fontWeight: 400, fontSize: "11px" }}>
                        <input
                          type="checkbox"
                          checked={edu.endYear === "Present"}
                          onChange={(e) =>
                            handleEducationChange(index, "endYear", e.target.checked ? "Present" : "")
                          }
                          style={{ marginRight: "4px", cursor: "pointer" }}
                        />
                        Present
                      </span>
                    </label>
                    <select
                      value={edu.endYear === "Present" ? "" : (edu.endYear || "")}
                      disabled={edu.endYear === "Present"}
                      onChange={(e) => handleEducationChange(index, "endYear", e.target.value)}
                      style={edu.endYear === "Present" ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                    >
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field of Study + Description */}
                <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={edu.field || ""}
                    onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={edu.description || ""}
                    onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}

            {/* Add new education */}
            <div style={{ marginTop: "1rem", border: "1px dashed var(--border-color)", padding: "1rem", borderRadius: "12px" }}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="New School"
                  value={editData.newEducation.school}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, newEducation: { ...prev.newEducation, school: e.target.value } }))
                  }
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={editData.newEducation.degree}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, newEducation: { ...prev.newEducation, degree: e.target.value } }))
                  }
                />
              </div>
              <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                    START YEAR
                  </label>
                  <select
                    value={editData.newEducation.startYear}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, newEducation: { ...prev.newEducation, startYear: e.target.value } }))
                    }
                  >
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                    END YEAR
                    <span style={{ marginLeft: "10px", fontWeight: 400, fontSize: "11px" }}>
                      <input
                        type="checkbox"
                        checked={editData.newEducation.endYear === "Present"}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            newEducation: { ...prev.newEducation, endYear: e.target.checked ? "Present" : "" },
                          }))
                        }
                        style={{ marginRight: "4px", cursor: "pointer" }}
                      />
                      Present
                    </span>
                  </label>
                  <select
                    value={editData.newEducation.endYear === "Present" ? "" : editData.newEducation.endYear}
                    disabled={editData.newEducation.endYear === "Present"}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, newEducation: { ...prev.newEducation, endYear: e.target.value } }))
                    }
                    style={editData.newEducation.endYear === "Present" ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                  >
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "0.5rem", marginBottom: 0 }}>
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={editData.newEducation.field}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, newEducation: { ...prev.newEducation, field: e.target.value } }))
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editData.newEducation.description}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, newEducation: { ...prev.newEducation, description: e.target.value } }))
                  }
                />
              </div>
              <button type="button" className="btn-add" onClick={addEducation} style={{ marginTop: "0.75rem" }}>
                <Icon name="plus" /> Add Education
              </button>
            </div>
          </div>

          {/* ── Skills Section ─────────────────────────────────────────────── */}
          <div className="form-section full-width">
            <h4>Skills</h4>
            <div className="skills-edit">
              {editData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button type="button" className="skill-remove" onClick={() => removeSkill(index)}>
                    <Icon name="close" />
                  </button>
                </span>
              ))}
            </div>
            <div className="skill-input-container">
              <input
                type="text"
                placeholder="Add a new skill"
                value={editData.newSkill}
                onChange={(e) => handleInputChange("newSkill", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
              <button type="button" className="btn-add" onClick={addSkill}>
                <Icon name="plus" /> Add
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={isUploading}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={isUploading}>
            {isUploading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {imageToCrop && (
        <ImageCropperModal
          image={imageToCrop}
          onCropComplete={onCropSave}
          onClose={() => {
            setImageToCrop(null);
            setCropType(null);
          }}
          aspect={cropType === "profile" ? 1 : 16 / 5}
          shape={cropType === "profile" ? "round" : "rect"}
          title={`Crop ${cropType === "profile" ? "Profile Picture" : "Banner Image"}`}
        />
      )}
    </div>
  );
};

export default EditForm;