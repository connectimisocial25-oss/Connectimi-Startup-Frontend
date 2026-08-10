import React, { useState, useRef } from "react";
import Icon from "./Icon";
import "./editProfile.css";
import ImageCropperModal from "./ImageCropperModal";
import { FaCamera } from "react-icons/fa";

const YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 1900 + 1 },
  (_, i) => new Date().getFullYear() - i
);

const AccordionSection = ({ id, title, count, isOpen, onToggle, children }) => (
  <div className={`accordion-section ${isOpen ? "open" : ""}`}>
    <button type="button" className="accordion-header" onClick={() => onToggle(id)}>
      <span className="accordion-title">
        {title}
        {typeof count === "number" && count > 0 && <span className="accordion-count">{count}</span>}
      </span>
      <Icon name="caret-down" className="accordion-chevron" />
    </button>
    {isOpen && <div className="accordion-body">{children}</div>}
  </div>
);

const EditForm = ({
  editData,
  setEditData,
  handleInputChange,
  handleExperienceChange,
  handleEducationChange,
  addExperience,
  addEducation,
  addSkill,
  removeExperience,
  removeEducation,
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
  const [openSection, setOpenSection] = useState("basics");
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const toggleSection = (id) => setOpenSection((prev) => (prev === id ? null : id));

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

  const renderExperienceRow = (value, onChange, mode, index) => (
    <div className={`entry-card ${mode === "new" ? "new-entry" : ""}`} key={mode === "new" ? "new-experience" : (value.id ?? index)}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Title"
          value={value.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
        <input
          type="text"
          placeholder="Company"
          value={value.company}
          onChange={(e) => onChange("company", e.target.value)}
        />
        {mode === "existing" && (
          <button type="button" className="btn-remove" onClick={() => removeExperience(index)}>
            <Icon name="close" />
          </button>
        )}
      </div>

      <div className="form-row-2col">
        <div className="field-col">
          <label className="field-label-sm">Start Date</label>
          <input
            type="date"
            value={value.startDate || ""}
            onChange={(e) => onChange("startDate", e.target.value)}
          />
        </div>
        <div className="field-col">
          <label className="field-label-sm">
            End Date
            <span className="present-check">
              <input
                type="checkbox"
                checked={value.endDate === "Present"}
                onChange={(e) => onChange("endDate", e.target.checked ? "Present" : "")}
              />
              Present
            </span>
          </label>
          <input
            type="date"
            value={value.endDate === "Present" ? "" : (value.endDate || "")}
            disabled={value.endDate === "Present"}
            onChange={(e) => onChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row-2col">
        <input
          type="text"
          placeholder="Location"
          value={value.location || ""}
          onChange={(e) => onChange("location", e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={value.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      {mode === "new" && (
        <div className="entry-add-actions">
          <button type="button" className="btn-cancel-inline" onClick={() => setShowAddExperience(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-add"
            disabled={!value.title || !value.company}
            onClick={() => {
              addExperience();
              setShowAddExperience(false);
            }}
          >
            <Icon name="plus" /> Add Experience
          </button>
        </div>
      )}
    </div>
  );

  const renderEducationRow = (value, onChange, mode, index) => (
    <div className={`entry-card ${mode === "new" ? "new-entry" : ""}`} key={mode === "new" ? "new-education" : (value.id ?? index)}>
      <div className="form-row">
        <input
          type="text"
          placeholder="School"
          value={value.school}
          onChange={(e) => onChange("school", e.target.value)}
        />
        <input
          type="text"
          placeholder="Degree"
          value={value.degree}
          onChange={(e) => onChange("degree", e.target.value)}
        />
        {mode === "existing" && (
          <button type="button" className="btn-remove" onClick={() => removeEducation(index)}>
            <Icon name="close" />
          </button>
        )}
      </div>

      <div className="form-row-2col">
        <div className="field-col">
          <label className="field-label-sm">Start Year</label>
          <select value={value.startYear || ""} onChange={(e) => onChange("startYear", e.target.value)}>
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="field-col">
          <label className="field-label-sm">
            End Year
            <span className="present-check">
              <input
                type="checkbox"
                checked={value.endYear === "Present"}
                onChange={(e) => onChange("endYear", e.target.checked ? "Present" : "")}
              />
              Present
            </span>
          </label>
          <select
            value={value.endYear === "Present" ? "" : (value.endYear || "")}
            disabled={value.endYear === "Present"}
            onChange={(e) => onChange("endYear", e.target.value)}
          >
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row-2col">
        <input
          type="text"
          placeholder="Field of Study"
          value={value.field || ""}
          onChange={(e) => onChange("field", e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={value.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      {mode === "new" && (
        <div className="entry-add-actions">
          <button type="button" className="btn-cancel-inline" onClick={() => setShowAddEducation(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-add"
            disabled={!value.school || !value.degree}
            onClick={() => {
              addEducation();
              setShowAddEducation(false);
            }}
          >
            <Icon name="plus" /> Add Education
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="edit-form-overlay" onClick={onCancel}>
      <div className="edit-form-content" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Profile Information</h3>

        <div className="accordion-list">
          <AccordionSection id="basics" title="Profile & Basics" isOpen={openSection === "basics"} onToggle={toggleSection}>
            <div className="form-grid">
              {/* Image Upload Section */}
              <div className="form-group full-width">
                <label>Profile Branding</label>
                <div className="edit-images-preview">
                  <div
                    className="edit-banner-preview"
                    style={{ backgroundImage: `url(${bannerPreview || (typeof editData.bannerImage === "string" ? editData.bannerImage : "")})` }}
                    onClick={() => {
                      if (bannerInputRef.current) bannerInputRef.current.value = null;
                      bannerInputRef.current?.click();
                    }}
                  >
                    <div className="edit-image-overlay">
                      <FaCamera />
                      <span>Change Banner</span>
                    </div>
                  </div>
                  <div
                    className="edit-avatar-preview"
                    style={{ backgroundImage: `url(${imagePreview || (typeof editData.profileImage === "string" ? editData.profileImage : "")})` }}
                    onClick={() => {
                      if (profileInputRef.current) profileInputRef.current.value = null;
                      profileInputRef.current?.click();
                    }}
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

              <p className="section-hint full-width">
                Projects are showcased and managed via the <strong>Showcase Project</strong> button on your profile page.
              </p>
            </div>
          </AccordionSection>

          <AccordionSection
            id="experience"
            title="Experience"
            count={editData.experience.length}
            isOpen={openSection === "experience"}
            onToggle={toggleSection}
          >
            {editData.experience.length === 0 && !showAddExperience && (
              <p className="accordion-empty">No experience added yet.</p>
            )}
            {editData.experience.map((exp, index) =>
              renderExperienceRow(exp, (field, val) => handleExperienceChange(index, field, val), "existing", index)
            )}
            {showAddExperience ? (
              renderExperienceRow(
                editData.newExperience,
                (field, val) => setEditData((prev) => ({ ...prev, newExperience: { ...prev.newExperience, [field]: val } })),
                "new"
              )
            ) : (
              <button type="button" className="btn-add-trigger" onClick={() => setShowAddExperience(true)}>
                <Icon name="plus" /> Add Experience
              </button>
            )}
          </AccordionSection>

          <AccordionSection
            id="education"
            title="Education"
            count={editData.education.length}
            isOpen={openSection === "education"}
            onToggle={toggleSection}
          >
            {editData.education.length === 0 && !showAddEducation && (
              <p className="accordion-empty">No education added yet.</p>
            )}
            {editData.education.map((edu, index) =>
              renderEducationRow(edu, (field, val) => handleEducationChange(index, field, val), "existing", index)
            )}
            {showAddEducation ? (
              renderEducationRow(
                editData.newEducation,
                (field, val) => setEditData((prev) => ({ ...prev, newEducation: { ...prev.newEducation, [field]: val } })),
                "new"
              )
            ) : (
              <button type="button" className="btn-add-trigger" onClick={() => setShowAddEducation(true)}>
                <Icon name="plus" /> Add Education
              </button>
            )}
          </AccordionSection>

          <AccordionSection
            id="skills"
            title="Skills"
            count={editData.skills.length}
            isOpen={openSection === "skills"}
            onToggle={toggleSection}
          >
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
          </AccordionSection>
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
