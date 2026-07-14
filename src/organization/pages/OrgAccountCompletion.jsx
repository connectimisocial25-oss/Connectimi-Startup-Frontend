import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import { FaCamera, FaTimes, FaPlus, FaTrash, FaBuilding, FaGlobe, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import ImageCropperModal from "../../components/ImageCropperModal";
import "../../pages/Auth.css";

const SUGGESTED_SPECIALTIES = [
    "Software Development", "Cloud Computing", "AI & Machine Learning",
    "Digital Marketing", "Financial Services", "Healthcare Technology",
    "E-commerce", "Education", "Consulting", "Cybersecurity"
];

const COMPANY_SIZES = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001-5000 employees",
    "5001-10,000 employees",
    "10,001+ employees"
];

function OrgAccountCompletion() {
    const navigate = useNavigate();
    const { tempData, completeAccount } = useAuth();

    // Org basic info
    const [industry, setIndustry] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [about, setAbout] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [foundedDate, setFoundedDate] = useState("");

    // Specialties
    const [specialties, setSpecialties] = useState([]);
    const [currentSpecialty, setCurrentSpecialty] = useState("");

    // Profile Images
    const [logoImage, setLogoImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
            if (bannerPreview && bannerPreview.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
        };
    }, [logoPreview, bannerPreview]);

    // Cropper State
    const [imageToCrop, setImageToCrop] = useState(null);
    const [cropType, setCropType] = useState(null); // 'logo' or 'banner'
    const [showCropper, setShowCropper] = useState(false);

    // Services
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        title: "", description: ""
    });

    const cardRef = useRef(null);
    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    const handleAddSpecialty = (specToAdd) => {
        const spec = typeof specToAdd === 'string' ? specToAdd : currentSpecialty;
        if (spec.trim() && !specialties.includes(spec.trim())) {
            setSpecialties([...specialties, spec.trim()]);
            setCurrentSpecialty("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSpecialty();
        }
    };

    const removeSpecialty = (specToRemove) => {
        setSpecialties(specialties.filter(s => s !== specToRemove));
    };

    // Service handlers
    const addService = () => {
        if (newService.title) {
            setServices([...services, { ...newService, id: Date.now() }]);
            setNewService({ title: "", description: "" });
        }
    };

    const removeService = (id) => {
        setServices(services.filter(svc => svc.id !== id));
    };

    const handleImageClick = (type) => {
        if (type === 'logo') logoInputRef.current.click();
        else bannerInputRef.current.click();
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
                setCropType(type);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = (croppedImage) => {
        const previewUrl = URL.createObjectURL(croppedImage);
        if (cropType === 'logo') {
            if (logoPreview && logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
            setLogoImage(croppedImage);
            setLogoPreview(previewUrl);
        } else {
            if (bannerPreview && bannerPreview.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
            setBannerImage(croppedImage);
            setBannerPreview(previewUrl);
        }
        setShowCropper(false);
        setImageToCrop(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await completeAccount({
                industry,
                location,
                phone,
                website,
                about,
                companySize,
                foundedDate,
                specialties,
                profileImage: logoImage, // Mapping logo to profileImage for consistency
                bannerImage,
                services,
                role: "organization" // Inform backend that this is an organization
            });
            navigate("/organization/feed");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to complete organization setup. Please check your fields.");
        }
    };

    return (
        <div className="auth-container">
            {showCropper && (
                <ImageCropperModal
                    image={imageToCrop}
                    onCropComplete={handleCropSave}
                    onClose={() => setShowCropper(false)}
                    aspect={cropType === 'logo' ? 1 : 16 / 5}
                    shape={cropType === 'logo' ? 'round' : 'rect'}
                    title={`Crop ${cropType === 'logo' ? 'Organization Logo' : 'Banner Image'}`}
                />
            )}
            <div className="auth-card card-wide" ref={cardRef}>
                <div className="auth-header">
                    <h1 className="auth-title">Welcome, {tempData?.firstName}!</h1>
                    <p className="auth-subtitle">Let's set up your organization's presence on Connectimi.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-content">
                    {/* Banner and Logo Upload */}
                    <div className="org-upload-section" style={{ marginBottom: '40px' }}>
                        <div
                            className="banner-upload-container"
                            onClick={() => handleImageClick('banner')}
                            style={{
                                height: '180px',
                                backgroundImage: bannerPreview ? `url(${bannerPreview})` : 'none',
                                backgroundColor: bannerPreview ? 'transparent' : 'var(--surface-faint)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '16px',
                                border: '2px dashed var(--emerald-500)',
                                position: 'relative',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {!bannerPreview && (
                                <div style={{ textAlign: 'center' }}>
                                    <FaCamera className="camera-icon" />
                                    <p className="add-photo-text">Add Banner Image</p>
                                </div>
                            )}
                            {bannerPreview && <div className="change-photo-overlay">Change Banner</div>}
                        </div>

                        <div
                            className="logo-upload-wrapper"
                            style={{
                                marginTop: '-60px',
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                                zIndex: 2
                            }}
                        >
                            <div
                                onClick={() => handleImageClick('logo')}
                                className="photo-upload-circle photo-upload-hover"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    backgroundImage: logoPreview ? `url(${logoPreview})` : 'none',
                                    backgroundColor: logoPreview ? 'transparent' : 'var(--bg-main)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '4px solid var(--bg-main)',
                                    boxShadow: 'var(--premium-shadow)'
                                }}
                            >
                                {!logoPreview && (
                                    <>
                                        <FaCamera className="camera-icon" />
                                        <span className="add-photo-text">Add Logo</span>
                                    </>
                                )}
                                {logoPreview && (
                                    <div className="change-photo-overlay">Change</div>
                                )}
                            </div>
                        </div>

                        <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" style={{ display: 'none' }} />
                        <input type="file" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} accept="image/*" style={{ display: 'none' }} />
                    </div>

                    {/* Basic Info */}
                    <div className="form-grid-completion">
                        <div className="auth-field">
                            <label className="field-label">INDUSTRY / TYPE</label>
                            <div className="input-with-icon">
                                <FaBuilding className="input-icon" />
                                <input
                                    type="text"
                                    className="auth-input input-icon-padding"
                                    placeholder="e.g., Software Development"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="auth-field">
                            <label className="field-label">LOCATION</label>
                            <div className="input-with-icon">
                                <FaMapMarkerAlt className="input-icon" />
                                <input
                                    type="text"
                                    className="auth-input input-icon-padding"
                                    placeholder="City, Country"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="auth-field">
                            <label className="field-label">WEBSITE</label>
                            <div className="input-with-icon">
                                <FaGlobe className="input-icon" />
                                <input
                                    type="url"
                                    className="auth-input input-icon-padding"
                                    placeholder="https://company.com"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="auth-field">
                            <label className="field-label">PHONE</label>
                            <div className="input-with-icon">
                                <FaPhone className="input-icon" />
                                <input
                                    type="tel"
                                    className="auth-input input-icon-padding"
                                    placeholder="+1 (555) 000-0000"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="auth-field">
                            <label className="field-label">COMPANY SIZE</label>
                            <div className="input-with-icon">
                                <FaUsers className="input-icon" />
                                <select
                                    className="auth-input input-icon-padding"
                                    value={companySize}
                                    onChange={(e) => setCompanySize(e.target.value)}
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="" disabled>Select size</option>
                                    {COMPANY_SIZES.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="auth-field">
                            <label className="field-label">FOUNDED DATE</label>
                            <div className="input-with-icon">
                                <FaCalendarAlt className="input-icon" />
                                <input
                                    type="text"
                                    className="auth-input input-icon-padding"
                                    placeholder="e.g., 2010"
                                    value={foundedDate}
                                    onChange={(e) => setFoundedDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="auth-field">
                        <label className="field-label">ABOUT THE ORGANIZATION</label>
                        <textarea
                            className="auth-input"
                            placeholder="Describe your organization's mission and goals..."
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={4}
                            style={{ resize: 'vertical', minHeight: '100px' }}
                        />
                    </div>

                    {/* Services Section */}
                    <div className="completion-section">
                        <h4 className="section-title">Our Services</h4>
                        {services.map((svc) => (
                            <div key={svc.id} className="item-card">
                                <div className="item-header">
                                    <span className="item-main">{svc.title}</span>
                                    <button type="button" onClick={() => removeService(svc.id)} className="btn-remove-item"><FaTrash /></button>
                                </div>
                                <div className="item-meta">{svc.description}</div>
                            </div>
                        ))}
                        <div className="add-item-box">
                            <input type="text" placeholder="Service Title" value={newService.title} onChange={(e) => setNewService({...newService, title: e.target.value})} className="auth-input-small" style={{ width: '100%', marginBottom: '10px' }} />
                            <textarea placeholder="Brief description of the service" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} className="auth-input-small" style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} />
                            <button type="button" onClick={addService} className="btn-add-item"><FaPlus /> Add Service</button>
                        </div>
                    </div>

                    {/* Specialties Section */}
                    <div className="auth-field" style={{ marginTop: '20px' }}>
                        <label className="field-label">SPECIALTIES</label>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '15px',
                            minHeight: '20px'
                        }}>
                            {specialties.map(spec => (
                                <span key={spec} className="skill-tag-completion">
                                    {spec}
                                    <FaTimes
                                        style={{ cursor: 'pointer', fontSize: '12px' }}
                                        onClick={() => removeSpecialty(spec)}
                                    />
                                </span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Add a specialty..."
                                value={currentSpecialty}
                                onChange={(e) => setCurrentSpecialty(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={handleAddSpecialty}
                                className="btn-add-skill-icon"
                            >
                                <FaPlus />
                            </button>
                        </div>

                        {/* Suggestions */}
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px', marginLeft: '12px' }}>SUGGESTED SPECIALTIES</p>
                        <div className="suggestions-box">
                            {SUGGESTED_SPECIALTIES.map(spec => (
                                <button
                                    key={spec}
                                    type="button"
                                    onClick={() => handleAddSpecialty(spec)}
                                    disabled={specialties.includes(spec)}
                                    className="skill-suggestion-btn"
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="auth-submit-btn" type="submit" style={{ marginTop: '30px' }}>
                        Complete Organization Setup
                    </button>
                </form>
            </div>
        </div>
    );
}

export default OrgAccountCompletion;
