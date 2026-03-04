import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Cropper from 'react-easy-crop';
import { useAuth } from "../context/AuthContext";
import { FaCamera, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import "./Auth.css";

const SUGGESTED_SKILLS = [
    "Python", "React", "Node.js", "Java", "SQL", "AWS",
    "UI/UX", "Figma", "Marketing", "Project Management",
    "Communication", "Public Speaking", "Data Science"
];

function AccountCompletion() {
    const navigate = useNavigate();
    const { tempData, completeAccount } = useAuth();

    // Profile basic info
    const [headline, setHeadline] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [about, setAbout] = useState("");

    // Skills
    const [skills, setSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState("");

    // Profile Image
    const [profileImage, setProfileImage] = useState(null);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    // Experience
    const [experience, setExperience] = useState([]);
    const [newExperience, setNewExperience] = useState({
        title: "", company: "", startDate: "", endDate: "", location: "", description: ""
    });

    // Projects
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: "", link: "", description: ""
    });

    // Education
    const [education, setEducation] = useState([]);
    const [newEducation, setNewEducation] = useState({
        school: "", degree: "", field: "", startYear: "", endYear: "", description: ""
    });

    const cardRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    const handleAddSkill = (skillToAdd) => {
        const skill = typeof skillToAdd === 'string' ? skillToAdd : currentSkill;
        if (skill.trim() && !skills.includes(skill.trim())) {
            setSkills([...skills, skill.trim()]);
            setCurrentSkill("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    // Experience handlers
    const addExperience = () => {
        if (newExperience.title && newExperience.company) {
            setExperience([...experience, { ...newExperience, id: Date.now() }]);
            setNewExperience({ title: "", company: "", startDate: "", endDate: "", location: "", description: "" });
        }
    };

    const removeExperience = (id) => {
        setExperience(experience.filter(exp => exp.id !== id));
    };

    // Project handlers
    const addProject = () => {
        if (newProject.title) {
            setProjects([...projects, { ...newProject, id: Date.now() }]);
            setNewProject({ title: "", link: "", description: "" });
        }
    };

    const removeProject = (id) => {
        setProjects(projects.filter(proj => proj.id !== id));
    };

    // Education handlers
    const addEducation = () => {
        if (newEducation.school && newEducation.degree) {
            setEducation([...education, { ...newEducation, id: Date.now() }]);
            setNewEducation({ school: "", degree: "", field: "", startYear: "", endYear: "", description: "" });
        }
    };

    const removeEducation = (id) => {
        setEducation(education.filter(edu => edu.id !== id));
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const createCroppedImage = async () => {
        try {
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.src = imageToCrop;
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            const base64Image = canvas.toDataURL('image/jpeg');
            setProfileImage(base64Image);
            setShowCropper(false);
            setImageToCrop(null);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        completeAccount({
            headline,
            location,
            phone,
            website,
            about,
            skills,
            profileImage,
            experience,
            projects,
            education
        });
        navigate("/home");
    };

    return (
        <div className="auth-container">
            {showCropper && (
                <div className="cropper-modal-overlay">
                    <div className="cropper-modal-content">
                        <div className="cropper-header">
                            <h3>Crop Profile Photo</h3>
                            <button type="button" onClick={() => setShowCropper(false)} className="btn-close-cropper"><FaTimes /></button>
                        </div>
                        <div className="cropper-container-wrapper">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1 / 1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>
                        <div className="cropper-controls">
                            <div className="zoom-control">
                                <span>Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="zoom-range"
                                />
                            </div>
                            <button type="button" onClick={createCroppedImage} className="btn-save-crop">
                                Apply Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="auth-card card-wide" ref={cardRef}>
                <div className="auth-header">
                    <h1 className="auth-title">Welcome to Connectimi, {tempData?.firstName}!</h1>
                    <p className="auth-subtitle">Let's finish setting up your professional profile.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-content">
                    {/* Profile Photo */}
                    <div className="photo-upload-container">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <div
                            onClick={handlePhotoClick}
                            className="photo-upload-circle photo-upload-hover"
                            style={{
                                background: profileImage ? `url(${profileImage})` : 'var(--surface-faint)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {!profileImage && (
                                <>
                                    <FaCamera className="camera-icon" />
                                    <span className="add-photo-text">Add Photo</span>
                                </>
                            )}
                            {profileImage && (
                                <div className="change-photo-overlay">Change</div>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="form-grid-completion">
                        <div className="auth-field">
                            <label className="field-label">HEADLINE</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="e.g., Senior Software Engineer at Company"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                            />
                        </div>
                        <div className="auth-field">
                            <label className="field-label">LOCATION</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="City, Country"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="auth-field">
                            <label className="field-label">PHONE</label>
                            <input
                                type="tel"
                                className="auth-input"
                                placeholder="+1 (555) 123-4567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="auth-field">
                            <label className="field-label">WEBSITE</label>
                            <input
                                type="url"
                                className="auth-input"
                                placeholder="https://yourwebsite.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label className="field-label">ABOUT</label>
                        <textarea
                            className="auth-input"
                            placeholder="Tell us about yourself..."
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={4}
                            style={{ resize: 'vertical', minHeight: '100px' }}
                        />
                    </div>

                    {/* Experience Section */}
                    <div className="completion-section">
                        <h4 className="section-title">Experience</h4>
                        {experience.map((exp) => (
                            <div key={exp.id} className="item-card">
                                <div className="item-header">
                                    <span className="item-main">{exp.title} at {exp.company}</span>
                                    <button type="button" onClick={() => removeExperience(exp.id)} className="btn-remove-item"><FaTrash /></button>
                                </div>
                                <div className="item-meta">{exp.startDate} - {exp.endDate} | {exp.location}</div>
                            </div>
                        ))}
                        <div className="add-item-box">
                            <div className="item-row">
                                <input type="text" placeholder="Title" value={newExperience.title} onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} className="auth-input-small" />
                                <input type="text" placeholder="Company" value={newExperience.company} onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} className="auth-input-small" />
                            </div>
                            <div className="item-row">
                                <input type="text" placeholder="Start" value={newExperience.startDate} onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})} className="auth-input-small" />
                                <input type="text" placeholder="End" value={newExperience.endDate} onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})} className="auth-input-small" />
                            </div>
                            <div className="item-row">
                                <input type="text" placeholder="Location" value={newExperience.location} onChange={(e) => setNewExperience({...newExperience, location: e.target.value})} className="auth-input-small" />
                                <input type="text" placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} className="auth-input-small" />
                            </div>
                            <button type="button" onClick={addExperience} className="btn-add-item"><FaPlus /> Add Experience</button>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="completion-section">
                        <h4 className="section-title">Projects</h4>
                        {projects.map((proj) => (
                            <div key={proj.id} className="item-card">
                                <div className="item-header">
                                    <span className="item-main">{proj.title}</span>
                                    <button type="button" onClick={() => removeProject(proj.id)} className="btn-remove-item"><FaTrash /></button>
                                </div>
                                {proj.link && <div className="item-meta">{proj.link}</div>}
                            </div>
                        ))}
                        <div className="add-item-box">
                            <div className="item-row">
                                <input type="text" placeholder="New Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="auth-input-small" />
                                <input type="text" placeholder="Link" value={newProject.link} onChange={(e) => setNewProject({...newProject, link: e.target.value})} className="auth-input-small" />
                            </div>
                            <input type="text" placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} className="auth-input-small" style={{ width: '100%', marginTop: '8px' }} />
                            <button type="button" onClick={addProject} className="btn-add-item"><FaPlus /> Add Project</button>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="completion-section">
                        <h4 className="section-title">Education</h4>
                        {education.map((edu) => (
                            <div key={edu.id} className="item-card">
                                <div className="item-header">
                                    <span className="item-main">{edu.school}</span>
                                    <button type="button" onClick={() => removeEducation(edu.id)} className="btn-remove-item"><FaTrash /></button>
                                </div>
                                <div className="item-meta">{edu.degree} | {edu.startYear} - {edu.endYear}</div>
                            </div>
                        ))}
                        <div className="add-item-box">
                            <div className="item-row">
                                <input type="text" placeholder="New School" value={newEducation.school} onChange={(e) => setNewEducation({...newEducation, school: e.target.value})} className="auth-input-small" />
                                <input type="text" placeholder="Degree" value={newEducation.degree} onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})} className="auth-input-small" />
                            </div>
                            <div className="item-row">
                                <input type="text" placeholder="Start Year" value={newEducation.startYear} onChange={(e) => setNewEducation({...newEducation, startYear: e.target.value})} className="auth-input-small" />
                                <input type="text" placeholder="End Year" value={newEducation.endYear} onChange={(e) => setNewEducation({...newEducation, endYear: e.target.value})} className="auth-input-small" />
                            </div>
                            <div className="item-row">
                                <input type="text" placeholder="Field of Study" value={newEducation.field} onChange={(e) => setNewEducation({...newEducation, field: e.target.value})} className="auth-input-small" />
                                <input type="text" placeholder="Description" value={newEducation.description} onChange={(e) => setNewEducation({...newEducation, description: e.target.value})} className="auth-input-small" />
                            </div>
                            <button type="button" onClick={addEducation} className="btn-add-item"><FaPlus /> Add Education</button>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="auth-field">
                        <label className="field-label">ADD SKILLS</label>

                        {/* Added Skills Tags */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '15px',
                            minHeight: '20px'
                        }}>
                            {skills.map(skill => (
                                <span key={skill} className="skill-tag-completion">
                                    {skill}
                                    <FaTimes
                                        style={{ cursor: 'pointer', fontSize: '12px' }}
                                        onClick={() => removeSkill(skill)}
                                    />
                                </span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Type a skill..."
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="btn-add-skill-icon"
                            >
                                <FaPlus />
                            </button>
                        </div>

                        {/* Suggestions */}
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px', marginLeft: '12px' }}>SUGGESTED FOR YOU</p>
                        <div className="suggestions-box">
                            {SUGGESTED_SKILLS.map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => handleAddSkill(skill)}
                                    disabled={skills.includes(skill)}
                                    className="skill-suggestion-btn"
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="auth-submit-btn" type="submit" style={{ marginTop: '30px' }}>
                        Complete Account
                    </button>
                </form>
            </div>

        </div>
    );
}

export default AccountCompletion;