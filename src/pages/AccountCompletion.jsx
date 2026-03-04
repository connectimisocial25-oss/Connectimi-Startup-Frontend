import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import { FaCamera, FaTimes, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";

const SUGGESTED_SKILLS = [
    "Python", "React", "Node.js", "Java", "SQL", "AWS",
    "UI/UX", "Figma", "Marketing", "Project Management",
    "Communication", "Public Speaking", "Data Science"
];

function AccountCompletion() {
    const navigate = useNavigate();
    const { tempData, completeAccount } = useAuth();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [skills, setSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const cardRef = useRef(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password) return;

        completeAccount({ password, skills, profileImage });
        navigate("/home");
    };

    return (
        <div className="auth-container">
            <div className="auth-card" ref={cardRef} style={{ maxWidth: '600px' }}>
                <div className="auth-header">
                    <h1 className="auth-title">Welcome to Connectimi, {tempData?.firstName}!</h1>
                    <p className="auth-subtitle">Let's finish setting up your professional profile.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-content">
                    {/* Profile Photo */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'var(--surface-faint)',
                            border: '2px dashed var(--emerald-500)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }} className="photo-upload-hover">
                            <FaCamera style={{ fontSize: '24px', color: 'var(--emerald-500)', marginBottom: '8px' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Add Photo</span>
                        </div>
                    </div>

                    <div className="auth-field">
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', marginLeft: '12px' }}>SET PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    padding: '5px',
                                    transition: 'color 0.2s ease'
                                }}
                                className="password-toggle-btn"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="auth-field">
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px', marginLeft: '12px' }}>ADD SKILLS</label>

                        {/* Added Skills Tags */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '15px',
                            minHeight: '20px'
                        }}>
                            {skills.map(skill => (
                                <span key={skill} style={{
                                    background: 'var(--emerald-500)',
                                    color: 'white',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                                }}>
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
                                style={{
                                    width: '45px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'var(--emerald-500)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FaPlus />
                            </button>
                        </div>

                        {/* Suggestions */}
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px', marginLeft: '12px' }}>SUGGESTED FOR YOU</p>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            padding: '15px',
                            background: 'var(--surface-faint)',
                            borderRadius: '16px',
                            border: '1px solid var(--surface-border)'
                        }}>
                            {SUGGESTED_SKILLS.map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => handleAddSkill(skill)}
                                    disabled={skills.includes(skill)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                        background: skills.includes(skill) ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                        color: skills.includes(skill) ? 'rgba(16, 185, 129, 0.5)' : 'var(--emerald-400)',
                                        fontSize: '13px',
                                        cursor: skills.includes(skill) ? 'default' : 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
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

            <style>{`
        .photo-upload-hover:hover {
          background: rgba(16, 185, 129, 0.05) !important;
          border-style: solid !important;
        }
        .skill-suggestion-btn:hover:not(:disabled) {
          background: rgba(16, 185, 129, 0.1);
          transform: translateY(-1px);
        }
        .password-toggle-btn:hover {
          color: var(--emerald-400) !important;
        }
      `}</style>
        </div>
    );
}

export default AccountCompletion;
