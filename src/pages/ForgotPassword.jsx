import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaLock, FaKey } from "react-icons/fa";
import API from "../services/api";
import "./Auth.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [accountType, setAccountType] = useState("personal");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        );
    }, [step]); // re-run entrance animation on step changes

    async function handleRequestOtp(e) {
        if (e) e.preventDefault();
        if (!email) return;

        setError("");
        setLoading(true);

        try {
            await API.post("/auth/forgot-password", {
                email,
                account_type: accountType
            });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send reset code. Please check your email and try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        if (!email || !code || !password) return;

        setError("");
        setLoading(true);

        try {
            await API.post("/auth/reset-password", {
                email,
                code,
                password,
                account_type: accountType
            });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || "Reset password failed. Please check the code and try again.");
        } finally {
            setLoading(false);
        }
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
                    <h1 className="auth-title">
                        {step === 1 && "Forgot Password?"}
                        {step === 2 && "Reset Password"}
                        {step === 3 && "Password Reset!"}
                    </h1>
                    <p className="auth-subtitle">
                        {step === 1 && "Select your account type and enter your email to get a 6-digit verification code."}
                        {step === 2 && "Enter the 6-digit OTP code sent to your email along with your new password."}
                        {step === 3 && "Your password has been successfully reset."}
                    </p>
                </div>

                {step === 1 && (
                    <form className="auth-form-content" onSubmit={handleRequestOtp}>
                        <div className="auth-toggle" style={{ display: 'flex', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '4px' }}>
                            <button
                                type="button"
                                className={`toggle-btn ${accountType === "consultant" ? "active" : ""}`}
                                onClick={() => setAccountType("consultant")}
                                style={{ flex: 1, border: 'none', background: 'none', color: accountType === "consultant" ? 'white' : 'var(--text-muted)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: accountType === "consultant" ? 'var(--emerald-500)' : 'transparent', transition: 'all 0.3s' }}
                            >
                                Consultant
                            </button>
                            <button
                                type="button"
                                className={`toggle-btn ${accountType === "personal" ? "active" : ""}`}
                                onClick={() => setAccountType("personal")}
                                style={{ flex: 1, border: 'none', background: 'none', color: accountType === "personal" ? 'white' : 'var(--text-muted)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backgroundColor: accountType === "personal" ? 'var(--emerald-500)' : 'transparent', transition: 'all 0.3s' }}
                            >
                                Personal
                            </button>
                        </div>

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

                        {error && (
                            <p style={{ color: "var(--error, #ef4444)", fontSize: "14px", margin: "10px 0 0 0", textAlign: "center" }}>
                                {error}
                            </p>
                        )}

                        <button className="auth-submit-btn" type="submit" disabled={loading} style={{ marginTop: '20px' }}>
                            {loading ? "Sending OTP..." : "Send Verification Code"}
                        </button>

                        <div className="auth-footer" style={{ marginTop: '20px' }}>
                            <Link to="/login" className="auth-link-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaArrowLeft fontSize="12px" /> Back to Log in
                            </Link>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="auth-form-content" onSubmit={handleResetPassword}>
                        <div className="auth-field">
                            <div className="input-with-icon">
                                <FaKey className="input-icon" />
                                <input
                                    type="text"
                                    className="auth-input input-icon-padding"
                                    placeholder="Enter 6-digit OTP code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <div className="input-with-icon">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    className="auth-input input-icon-padding"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <p style={{ color: "var(--error, #ef4444)", fontSize: "14px", margin: "10px 0 0 0", textAlign: "center" }}>
                                {error}
                            </p>
                        )}

                        <button className="auth-submit-btn" type="submit" disabled={loading} style={{ marginTop: '20px' }}>
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>

                        <div className="auth-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <button type="button" className="auth-link-btn" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaArrowLeft fontSize="12px" /> Change Email
                            </button>
                            <button type="button" className="auth-link-btn" onClick={() => handleRequestOtp()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="auth-success-state" style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div className="success-icon-wrapper" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-500)', marginBottom: '20px' }}>
                            <FaCheckCircle className="success-icon" style={{ fontSize: '32px' }} />
                        </div>
                        <h2 className="success-title" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>Success!</h2>
                        <p className="success-text" style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px', lineHeight: '1.5' }}>
                            Your password has been changed. You can now log in with your new password.
                        </p>
                        <button className="auth-submit-btn" onClick={() => navigate("/login")}>
                            Go to Log in
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;