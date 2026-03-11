import React, { useState, useRef } from "react";
import Icon from "../../components/Icon";
import { FaPlus, FaTimes, FaBriefcase, FaCamera } from "react-icons/fa";
import "./OrgEditForm.css";
import ImageCropperModal from "../../components/ImageCropperModal";

const OrgEditForm = ({
  editData,
  setEditData,
  handleSave,
  onCancel,
  isUploading
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

  const onCropSave = (croppedImage) => {
    if (cropType === 'profile') {
      handleInputChange('profileImage', croppedImage);
    } else {
      handleInputChange('bannerImage', croppedImage);
    }
    setImageToCrop(null);
    setCropType(null);
  };

  const [newSpecialty, setNewSpecialty] = useState("");
  const [newService, setNewService] = useState({ title: "", description: "" });

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !editData.specialties.includes(newSpecialty.trim())) {
      setEditData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index) => {
    setEditData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (newService.title.trim()) {
      setEditData(prev => ({
        ...prev,
        services: [...prev.services, { ...newService, id: Date.now() }]
      }));
      setNewService({ title: "", description: "" });
    }
  };

  const removeService = (id) => {
    setEditData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  const handleServiceChange = (id, field, value) => {
    setEditData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  return (
    <div className="edit-form-overlay" onClick={onCancel}>
      <div className="edit-form-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-form-header">
          <h3>Edit Organization Profile</h3>
          <button className="close-btn" onClick={onCancel}><FaTimes /></button>
        </div>

        <div className="form-grid">
          {/* Branding Section */}
          <div className="form-group full-width">
            <label>Branding</label>
            <div className="edit-images-preview">
              <div
                className="edit-banner-preview"
                style={{ backgroundImage: `url(${editData.bannerImage})` }}
                onClick={() => bannerInputRef.current.click()}
              >
                <div className="edit-image-overlay">
                  <FaCamera />
                  <span>Change Banner</span>
                </div>
              </div>
              <div
                className="edit-avatar-preview"
                style={{ backgroundImage: `url(${editData.profileImage})` }}
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
              onChange={(e) => handleFileChange(e, 'profile')}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <input
              type="file"
              ref={bannerInputRef}
              onChange={(e) => handleFileChange(e, 'banner')}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="org-name">Organization Name</label>
            <input
              id="org-name"
              type="text"
              value={editData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g. TechCorp Inc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="org-industry">Industry</label>
            <input
              id="org-industry"
              type="text"
              value={editData.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              placeholder="e.g. Software Development"
            />
          </div>

          <div className="form-group">
            <label htmlFor="org-location">Location</label>
            <input
              id="org-location"
              type="text"
              value={editData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div className="form-group">
            <label htmlFor="org-website">Website</label>
            <input
              id="org-website"
              type="url"
              value={editData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="org-size">Company Size</label>
            <select
              id="org-size"
              value={editData.companySize}
              onChange={(e) => handleInputChange("companySize", e.target.value)}
            >
              <option value="">Select size</option>
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-500 employees">201-500 employees</option>
              <option value="501-1000 employees">501-1000 employees</option>
              <option value="1001-5000 employees">1001-5000 employees</option>
              <option value="5001-10,000 employees">5001-10,000 employees</option>
              <option value="10,001+ employees">10,001+ employees</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="org-founded">Founded Year</label>
            <input
              id="org-founded"
              type="text"
              value={editData.foundedDate}
              onChange={(e) => handleInputChange("foundedDate", e.target.value)}
              placeholder="e.g. 2010"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="org-about">About</label>
            <textarea
              id="org-about"
              value={editData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
              placeholder="Describe your organization..."
              rows={4}
            />
          </div>

          {/* Specialties */}
          <div className="form-section full-width">
            <h4>Specialties</h4>
            <div className="tags-container">
              {editData.specialties.map((spec, index) => (
                <span key={index} className="edit-tag">
                  {spec}
                  <button onClick={() => removeSpecialty(index)}><FaTimes /></button>
                </span>
              ))}
            </div>
            <div className="tag-input-group">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add a specialty"
                onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
              />
              <button className="add-btn" onClick={addSpecialty}><FaPlus /></button>
            </div>
          </div>

          {/* Services */}
          <div className="form-section full-width">
            <h4>Our Services</h4>
            <div className="edit-services-list">
              {editData.services.map((service) => (
                <div key={service.id} className="edit-service-card">
                  <div className="service-inputs">
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleServiceChange(service.id, "title", e.target.value)}
                      placeholder="Service Title"
                    />
                    <textarea
                      value={service.description}
                      onChange={(e) => handleServiceChange(service.id, "description", e.target.value)}
                      placeholder="Service Description"
                      rows={2}
                    />
                  </div>
                  <button className="remove-service-btn" onClick={() => removeService(service.id)}>
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
            <div className="new-service-form">
              <h5>Add New Service</h5>
              <input
                type="text"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                placeholder="New Service Title"
              />
              <textarea
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="New Service Description"
                rows={2}
              />
              <button className="add-service-btn" onClick={addService}>
                <FaPlus /> Add Service
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
          aspect={cropType === 'profile' ? 1 : 16 / 5}
          shape={cropType === 'profile' ? 'round' : 'rect'}
          title={`Crop ${cropType === 'profile' ? 'Logo' : 'Banner Image'}`}
        />
      )}
    </div>
  );
};

export default OrgEditForm;
