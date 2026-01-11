import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Auth.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

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
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <img src="/Connectimi_logo.png" alt="Connectimi Logo" />
                    </div>
                    <h1 className="auth-title">Forgot Password?</h1>
                    <p className="auth-subtitle">Reset password in two quick steps</p>
                </div>

                {!isSubmitted ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="Email or Phone"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button className="auth-submit-btn" type="submit">
                            Reset Password
                        </button>

                        <div className="auth-footer" style={{ marginTop: '20px' }}>
                            <Link to="/" className="auth-link">Back to Sign in</Link>
                        </div>
                    </form>
                ) : (
                    <div className="auth-success-message" style={{ textAlign: 'center', padding: '20px 0' }}>
                        <p style={{ marginBottom: '20px', fontSize: '16px', color: '#555' }}>
                            We have sent a reset link to <strong>{email}</strong>.
                            Please check your inbox.
                        </p>
                        <div className="auth-footer">
                            <Link to="/" className="auth-link">Back to Sign in</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
