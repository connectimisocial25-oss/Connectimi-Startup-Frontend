import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("personal"); // 'personal' or 'organization'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    // In a real app you'd call your auth API here, passing accountType
    if (accountType === 'organization') {
      navigate("/organization");
    } else {
      navigate("/home");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "var(--primary-green)",
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
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Stay updated on your professional world</p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={`toggle-btn ${accountType === "organization" ? "active" : ""}`}
            onClick={() => setAccountType("organization")}
          >
            Organization
          </button>
          <button
            type="button"
            className={`toggle-btn ${accountType === "personal" ? "active" : ""}`}
            onClick={() => setAccountType("personal")}
          >
            Personal
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <input
              type="email"
              className="auth-input"
              placeholder={accountType === "organization" ? "Work Email" : "Email or Phone"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <Link to="/forgot-password" style={{ color: "var(--primary-blue)", fontWeight: "600", textDecoration: "none", fontSize: "14px" }}>
              Forgot password?
            </Link>
          </div>

          <button className="auth-submit-btn" type="submit">
            Sign in
          </button>
        </form>

        <div className="auth-footer">
          New to Connectimi?
          <Link to="/signup" className="auth-link">Join now</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
