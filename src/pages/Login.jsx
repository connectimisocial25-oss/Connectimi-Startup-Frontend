import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";
import { useAuth } from "../context/AuthContext";
import { parseApiError } from "../utils/adapters";

export function LoginForm({ onToggle, compact = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [accountType, setAccountType] = useState("personal");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current.children,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
    );
  }, [accountType]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password, accountType); // pass accountType
      // AuthContext.login sets the user + token
      // navigate based on account type & profile completion
      if (loggedInUser && !loggedInUser.accountCompleted) {
        if (accountType === "consultant") {
          navigate("/org-account-completion");
        } else {
          navigate("/account-completion");
        }
      } else {
        if (accountType === "consultant") {
          navigate("/organization");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`auth-form-wrapper ${compact ? "compact" : ""}`}>
      <div className="auth-toggle">
        <button
          type="button"
          className={`toggle-btn ${accountType === "consultant" ? "active" : ""}`}
          onClick={() => setAccountType("consultant")}
        >
          Consultant
        </button>
        <button
          type="button"
          className={`toggle-btn ${accountType === "personal" ? "active" : ""}`}
          onClick={() => setAccountType("personal")}
        >
          Personal
        </button>
      </div>

      <form className="auth-form-content" onSubmit={handleSubmit} ref={formRef}>
        <div className="auth-field">
          <input
            type="email"
            className="auth-input"
            placeholder={
              accountType === "consultant" ? "Work Email" : "Email or Phone"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field" style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: "45px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              padding: "5px",
              transition: "color 0.2s ease",
            }}
            className="password-toggle-btn"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p
            style={{
              color: "var(--error, #ef4444)",
              fontSize: "14px",
              margin: "0",
            }}
          >
            {error}
          </p>
        )}

        <div style={{ textAlign: "left" }}>
          <Link
            to="/forgot-password"
            style={{
              color: "var(--emerald-500)",
              fontWeight: "700",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Forgot password?
          </Link>
        </div>

        <button className="auth-submit-btn" type="submit" disabled={loading}>
          {loading ? <div className="auth-btn-spinner"></div> : "Sign In"}
        </button>
      </form>

      {!compact && (
        <div className="auth-footer">
          New to Connectimi?
          <button onClick={onToggle} className="auth-link-btn">
            Join now
          </button>
        </div>
      )}
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
    );
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card" ref={cardRef}>
        <div className="auth-header">
          <div className="auth-logo">
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#10b981",
                WebkitMaskImage: "url(/Connectimi_logo.png)",
                maskImage: "url(/Connectimi_logo.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
              role="img"
              aria-label="Connectimi Logo"
            />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Stay updated on your professional world
          </p>
        </div>

        <LoginForm onToggle={() => navigate("/signup")} />
      </div>
    </div>
  );
}

export default Login;
