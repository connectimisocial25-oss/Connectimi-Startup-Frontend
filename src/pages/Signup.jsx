import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("personal"); // 'personal' or 'organization'
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) return;

    const fullName = `${firstName} ${lastName}`;
    // In a real app you'd call your signup API here with split names or full name

    navigate("/profile", {
      state: {
        newSignup: true,
        firstName,
        lastName
      }
    });
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/Connectimi_logo.png" alt="Connectimi Logo" />
          </div>
          <h1 className="auth-title">Join Connectimi</h1>
          <p className="auth-subtitle">Start building meaningful connections</p>
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
          {/* Split Name Fields */}
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

          <p style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "center", margin: "10px 0" }}>
            By clicking Create Account, you agree to the User Agreement, Privacy Policy, and Cookie Policy.
          </p>

          <button className="auth-submit-btn" type="submit">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already on Connectimi?
          <Link to="/" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
