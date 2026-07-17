import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { parseApiError } from "../utils/adapters";
import "./Auth.css";

export function SignupForm({ onToggle, compact = false }) {
  const navigate = useNavigate();
  const { initiateSignup } = useAuth();
  const [accountType, setAccountType] = useState("personal");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current.children,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }
    );
  }, [accountType]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (accountType === "personal") {
        if (!firstName || !lastName || !email || !password) {
          setLoading(false);
          return;
        }
        await initiateSignup({ firstName, lastName, email, password, accountType });
      } else {
        if (!firstName || !email || !password) {
          setLoading(false);
          return;
        }
        await initiateSignup({ firstName, lastName: "", email, password, accountType });
      }

      navigate("/verify-email");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`auth-form-wrapper ${compact ? 'compact' : ''}`}>
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
        {accountType === "personal" ? (
          <div className="form-row">
            <div className="auth-field">
              <input
                type="text"
                className="auth-input"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <input
                type="text"
                className="auth-input"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
        ) : (
          <div className="auth-field">
            <input
              type="text"
              className="auth-input"
              placeholder="Consultant name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="auth-field">
          <input
            type="email"
            className="auth-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field" style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            className="auth-input"
            placeholder="Password"
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


        <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", margin: "10px 0", lineHeight: "1.5" }}>
          By clicking Create Account, you agree to the <span style={{ color: 'var(--emerald-500)', fontWeight: 600 }}>User Agreement</span>, <span style={{ color: 'var(--emerald-500)', fontWeight: 600 }}>Privacy Policy</span>, and <span style={{ color: 'var(--emerald-500)', fontWeight: 600 }}>Cookie Policy</span>.
        </p>

        {error && (
          <p
            style={{
              color: "var(--error, #ef4444)",
              fontSize: "14px",
              margin: "0 0 10px 0",
              textAlign: "center"
            }}
          >
            {error}
          </p>
        )}

        <button className="auth-submit-btn" type="submit" disabled={loading}>
          {loading ? <div className="auth-btn-spinner"></div> : "Create Account"}
        </button>
      </form>

      {!compact && (
        <div className="auth-footer">
          Already on Connectimi?
          <button onClick={onToggle} className="auth-link-btn">Sign in</button>
        </div>
      )}
    </div>
  );
}

function Signup() {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
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
          <h1 className="auth-title">Join Connectimi</h1>
          <p className="auth-subtitle">Start building meaningful connections today</p>
        </div>

        <SignupForm onToggle={() => navigate("/")} />
      </div>
    </div>
  );
}

export default Signup;