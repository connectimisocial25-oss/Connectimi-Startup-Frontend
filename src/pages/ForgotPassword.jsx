import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import "./Auth.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        if (!email) return;

        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    }

    return (
        <div className="auth-container">
            <div className="auth-card" ref={cardRef}>
                <div className="auth-header">
                    <div className="auth-logo">
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: 'var(--emerald-500)',
                                WebkitMaskImage: 'url(/Connectimi_logo.png)',
                                maskImage: 'url(/Connectimi_logo.png)',
                                maskSize: 'contain',
                                WebkitMaskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                WebkitMaskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                WebkitMaskPosition: 'center'
                            }}
                        />
                    </div>
                    <h1 className="auth-title">Forgot Password?</h1>
                    <p className="auth-subtitle">We'll send you a link to reset your password.</p>
                </div>

                {!isSubmitted ? (
                    <form className="auth-form-content" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <div className="input-with-icon">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    className="auth-input input-icon-padding"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button className="auth-submit-btn" type="submit">
                            Send Reset Link
                        </button>

                        <div className="auth-footer">
                            <Link to="/" className="auth-link-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaArrowLeft fontSize="12px" /> Back to Log in
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="auth-success-state">
                        <div className="success-icon-wrapper">
                            <FaCheckCircle className="success-icon" />
                        </div>
                        <h2 className="success-title">Check your email</h2>
                        <p className="success-text">
                            We've sent a password reset link to <br />
                            <strong>{email}</strong>
                        </p>
                        <button className="auth-submit-btn" onClick={() => navigate("/")}>
                            Back to Log in
                        </button>
                        <div className="auth-footer">
                            <span style={{ fontSize: '14px' }}>Didn't receive it?</span>
                            <button className="auth-link-btn" onClick={() => setIsSubmitted(false)}>Try again</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;