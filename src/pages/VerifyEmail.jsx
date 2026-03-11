import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function VerifyEmail() {
    const navigate = useNavigate();
    const { tempData, verifyEmail } = useAuth();
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    const handleSimulateVerify = () => {
        verifyEmail();
        if (tempData?.accountType === "organization") {
            navigate("/org-account-completion");
        } else {
            navigate("/account-completion");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" ref={cardRef} style={{ textAlign: 'center' }}>
                <div className="auth-header">
                    <div className="auth-logo" style={{ marginBottom: '20px' }}>
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                backgroundColor: "#10b981",
                                WebkitMaskImage: "url(/Connectimi_logo.png)",
                                maskImage: "url(/Connectimi_logo.png)",
                                WebkitMaskSize: "contain",
                                maskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                maskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                                maskPosition: "center",
                                margin: '0 auto'
                            }}
                            role="img"
                            aria-label="Connectimi Logo"
                        />
                    </div>
                    <h1 className="auth-title">Verify your email</h1>
                    <p className="auth-subtitle">
                        We've sent a verification link to <br />
                        <strong style={{ color: 'var(--emerald-400)' }}>{tempData?.email || "your email"}</strong>
                    </p>
                </div>

                <div style={{ margin: '30px 0' }}>
                    <div style={{
                        fontSize: '50px',
                        marginBottom: '20px',
                        animation: 'pulse 2s infinite'
                    }}>📧</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                        Please check your inbox (and spam folder) and click the link to continue setting up your account.
                    </p>
                </div>

                <button
                    className="auth-submit-btn"
                    onClick={handleSimulateVerify}
                    style={{ background: 'linear-gradient(135deg, var(--emerald-500), var(--emerald-600))' }}
                >
                    Verify My Email (Simulated)
                </button>

                <div className="auth-footer">
                    Didn't receive the email?
                    <button className="auth-link-btn">Resend</button>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
        </div>
    );
}

export default VerifyEmail;
