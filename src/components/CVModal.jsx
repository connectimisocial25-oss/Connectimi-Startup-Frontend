import React from 'react';
import { FaPrint, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaLinkedin } from 'react-icons/fa';
import './CVModal.css';

const CVModal = ({ profileData, onClose }) => {
  if (!profileData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cv-modal-overlay" onClick={onClose}>
      <div className="cv-modal-content" onClick={e => e.stopPropagation()}>
        <div className="cv-modal-header">
          <h2>CV Profile Preview</h2>
          <div className="cv-actions">
            <button className="btn-print" onClick={handlePrint}>
              <FaPrint /> Print / Save as PDF
            </button>
            <button className="btn-close" onClick={onClose}>
              <FaTimes /> Close
            </button>
          </div>
        </div>
        
        <div className="cv-preview-container">
          <div className="cv-document">
            {/* CV Header */}
            <div className="cv-header">
              <h1 className="cv-name">{profileData.name}</h1>
              <p className="cv-headline">{profileData.headline}</p>
              
              <div className="cv-contact-info">
                {profileData.email && (
                  <div className="cv-contact-item">
                    <FaEnvelope size={12} /> {profileData.email}
                  </div>
                )}
                {profileData.phone && (
                  <div className="cv-contact-item">
                    <FaPhone size={12} /> {profileData.phone}
                  </div>
                )}
                {profileData.location && (
                  <div className="cv-contact-item">
                    <FaMapMarkerAlt size={12} /> {profileData.location}
                  </div>
                )}
                {profileData.website && (
                  <div className="cv-contact-item">
                    <FaGlobe size={12} /> {profileData.website}
                  </div>
                )}
              </div>
            </div>
            
            {/* About Section */}
            {profileData.about && (
              <div className="cv-section">
                <div className="cv-section-title">Professional Summary</div>
                <p className="cv-item-description">{profileData.about}</p>
              </div>
            )}
            
            {/* Experience Section */}
            {profileData.experience && profileData.experience.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-title">Experience</div>
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="cv-experience-item">
                    <div className="cv-item-header">
                      <div className="cv-item-title">{exp.title}</div>
                      <div className="cv-item-date">{exp.startDate} - {exp.endDate}</div>
                    </div>
                    <div className="cv-item-subtitle">{exp.company}, {exp.location}</div>
                    {exp.description && <div className="cv-item-description">{exp.description}</div>}
                  </div>
                ))}
              </div>
            )}
            
            {/* Education Section */}
            {profileData.education && profileData.education.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-title">Education</div>
                {profileData.education.map((edu, index) => (
                  <div key={index} className="cv-education-item">
                    <div className="cv-item-header">
                      <div className="cv-item-title">{edu.school}</div>
                      <div className="cv-item-date">{edu.startYear} - {edu.endYear}</div>
                    </div>
                    <div className="cv-item-subtitle">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                    {edu.description && <div className="cv-item-description">{edu.description}</div>}
                  </div>
                ))}
              </div>
            )}
            
            {/* Skills Section */}
            {profileData.skills && profileData.skills.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-title">Skills</div>
                <div className="cv-skills-grid">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="cv-skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVModal;
