import React from "react";
import Icon from "./Icon";

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
  onCancel,
}) => (
  <div className="edit-form">
    <h3>Edit Profile Information</h3>

    <div className="form-grid">
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={editData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div className="form-group">
        <label>Headline</label>
        <input
          type="text"
          value={editData.headline}
          onChange={(e) => handleInputChange("headline", e.target.value)}
          placeholder="e.g., Senior Software Engineer at Company"
        />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          value={editData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          placeholder="City, Country"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={editData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="your.email@example.com"
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          value={editData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="form-group">
        <label>Website</label>
        <input
          type="url"
          value={editData.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div className="form-group full-width">
        <label>About</label>
        <textarea
          value={editData.about}
          onChange={(e) => handleInputChange("about", e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      {/* Projects Section */}
      <div className="form-section full-width projects-section">
        <h4>Projects</h4>
        {editData.projects.map((proj, index) => (
          <div key={proj.id} className="form-row">
            <input
              type="text"
              placeholder="Project Title"
              value={proj.title}
              onChange={(e) =>
                handleProjectChange(index, "title", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={proj.description}
              onChange={(e) =>
                handleProjectChange(index, "description", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Link"
              value={proj.link}
              onChange={(e) =>
                handleProjectChange(index, "link", e.target.value)
              }
            />
            <button
              type="button"
              className="btn-remove"
              onClick={() => removeProject(index)}
            >
              <Icon name="close" />
            </button>
          </div>
        ))}

        <div className="form-row">
          <input
            type="text"
            placeholder="Project Title"
            value={editData.newProject.title}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newProject: { ...prev.newProject, title: e.target.value },
              }))
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={editData.newProject.description}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newProject: { ...prev.newProject, description: e.target.value },
              }))
            }
          />
          <input
            type="text"
            placeholder="Link"
            value={editData.newProject.link}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newProject: { ...prev.newProject, link: e.target.value },
              }))
            }
          />
          <button type="button" className="btn-add" onClick={addProject}>
            <Icon name="plus" /> Add
          </button>
        </div>
      </div>

      {/* Experience Section */}
      <div className="form-section full-width experience-section">
        <h4>Experience</h4>
        {editData.experience.map((exp, index) => (
          <div key={exp.id} className="form-row">
            <input
              type="text"
              placeholder="Title"
              value={exp.title}
              onChange={(e) =>
                handleExperienceChange(index, "title", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) =>
                handleExperienceChange(index, "company", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) =>
                handleExperienceChange(index, "startDate", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) =>
                handleExperienceChange(index, "endDate", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Location"
              value={exp.location}
              onChange={(e) =>
                handleExperienceChange(index, "location", e.target.value)
              }
            />
            <button
              type="button"
              className="btn-remove"
              onClick={() => removeExperience(index)}
            >
              <Icon name="close" />
            </button>
          </div>
        ))}

        <div className="form-row">
          <input
            type="text"
            placeholder="Title"
            value={editData.newExperience.title}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newExperience: { ...prev.newExperience, title: e.target.value },
              }))
            }
          />
          <input
            type="text"
            placeholder="Company"
            value={editData.newExperience.company}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newExperience: {
                  ...prev.newExperience,
                  company: e.target.value,
                },
              }))
            }
          />
          <input
            type="text"
            placeholder="Start Date"
            value={editData.newExperience.startDate}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newExperience: {
                  ...prev.newExperience,
                  startDate: e.target.value,
                },
              }))
            }
          />
          <input
            type="text"
            placeholder="End Date"
            value={editData.newExperience.endDate}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newExperience: {
                  ...prev.newExperience,
                  endDate: e.target.value,
                },
              }))
            }
          />
          <input
            type="text"
            placeholder="Location"
            value={editData.newExperience.location}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newExperience: {
                  ...prev.newExperience,
                  location: e.target.value,
                },
              }))
            }
          />
          <button type="button" className="btn-add" onClick={addExperience}>
            <Icon name="plus" /> Add
          </button>
        </div>
      </div>

      {/* Education Section */}
      <div className="form-section full-width education-section">
        <h4>Education</h4>
        {editData.education.map((edu, index) => (
          <div key={edu.id} className="form-row">
            <input
              type="text"
              placeholder="School"
              value={edu.school}
              onChange={(e) =>
                handleEducationChange(index, "school", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) =>
                handleEducationChange(index, "degree", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.field}
              onChange={(e) =>
                handleEducationChange(index, "field", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Start Year"
              value={edu.startYear}
              onChange={(e) =>
                handleEducationChange(index, "startYear", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="End Year"
              value={edu.endYear}
              onChange={(e) =>
                handleEducationChange(index, "endYear", e.target.value)
              }
            />
            <button
              type="button"
              className="btn-remove"
              onClick={() => removeEducation(index)}
            >
              <Icon name="close" />
            </button>
          </div>
        ))}

        <div className="form-row">
          <input
            type="text"
            placeholder="School"
            value={editData.newEducation.school}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newEducation: { ...prev.newEducation, school: e.target.value },
              }))
            }
          />
          <input
            type="text"
            placeholder="Degree"
            value={editData.newEducation.degree}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newEducation: { ...prev.newEducation, degree: e.target.value },
              }))
            }
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={editData.newEducation.field}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newEducation: { ...prev.newEducation, field: e.target.value },
              }))
            }
          />
          <input
            type="text"
            placeholder="Start Year"
            value={editData.newEducation.startYear}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newEducation: {
                  ...prev.newEducation,
                  startYear: e.target.value,
                },
              }))
            }
          />
          <input
            type="text"
            placeholder="End Year"
            value={editData.newEducation.endYear}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                newEducation: { ...prev.newEducation, endYear: e.target.value },
              }))
            }
          />
          <button type="button" className="btn-add" onClick={addEducation}>
            <Icon name="plus" /> Add
          </button>
        </div>
      </div>

      {/* Skills Section */}
      <div className="form-section full-width">
        <h4>Skills</h4>
        <div className="skills-edit">
          {editData.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
              <button
                type="button"
                className="skill-remove"
                onClick={() => removeSkill(index)}
              >
                <Icon name="close" />
              </button>
            </span>
          ))}
        </div>
        <div className="skill-input-container">
          <input
            type="text"
            placeholder="Add a skill"
            value={editData.newSkill}
            onChange={(e) => handleInputChange("newSkill", e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
          />
          <button type="button" className="btn-add-skill" onClick={addSkill}>
            <Icon name="plus" /> Add Skill
          </button>
        </div>
      </div>
    </div>

    <div className="form-actions">
      <button className="btn-save" onClick={handleSave} disabled={isUploading}>
        {isUploading ? "Saving..." : "Save Changes"}
      </button>
      <button className="btn-cancel" onClick={onCancel} disabled={isUploading}>
        Cancel
      </button>
    </div>
  </div>
);

export default EditForm;
