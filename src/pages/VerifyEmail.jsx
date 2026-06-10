import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 59;

function VerifyEmail() {
  const navigate = useNavigate();
  const { tempData, verifyEmail, resendOtp } = useAuth();
  const cardRef = useRef(null);
  const inputsRef = useRef([]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  // Entry animation
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
    );
    inputsRef.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  // ── OTP input handlers ──────────────────────────────────────────────────────

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1); // only last digit
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!text) return;
    const next = Array(OTP_LENGTH).fill("");
    text.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    // focus last filled or next empty
    const focusIndex = Math.min(text.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    // ✅ Capture BEFORE the async call clears tempData
    const accountType = tempData?.accountType;

    setLoading(true);
    setError("");

    try {
      await verifyEmail(code);
      // Now use the captured value, not tempData (which may be null by now)
      if (accountType === "consultant") {
        navigate("/org-account-completion");
      } else {
        navigate("/account-completion");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid or expired code. Try again.",
      );
      gsap.fromTo(
        cardRef.current,
        { x: -8 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" },
      );
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── Resend ──────────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendOtp(tempData?.email, tempData?.accountType);
      setOtp(Array(OTP_LENGTH).fill(""));
      setError("");
      setSeconds(RESEND_COOLDOWN);
      setCanResend(false);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend. Try again.");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="auth-container">
      <div className="auth-card" ref={cardRef} style={{ textAlign: "center" }}>
        {/* Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(16,185,129,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <span style={{ fontSize: "24px" }}>✉️</span>
        </div>

        <div className="auth-header" style={{ marginBottom: "1.5rem" }}>
          <h1 className="auth-title">Verify your email</h1>
          <p className="auth-subtitle">
            We sent a 6-digit code to{" "}
            <strong style={{ color: "var(--emerald-400)" }}>
              {tempData?.email || "your email"}
            </strong>
          </p>
        </div>

        {/* OTP boxes */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  width: "46px",
                  height: "54px",
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: error
                    ? "1.5px solid var(--error, #ef4444)"
                    : digit
                      ? "1.5px solid var(--emerald-500)"
                      : "1.5px solid var(--border-color)",
                  background: "var(--input-bg, transparent)",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.2s",
                  caretColor: "var(--emerald-500)",
                }}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                color: "var(--error, #ef4444)",
                fontSize: "13px",
                margin: "0 0 0.75rem",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            className="auth-submit-btn"
            type="submit"
            disabled={loading}
            style={{
              background:
                "linear-gradient(135deg, var(--emerald-500), var(--emerald-600))",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        {/* Resend */}
        <div className="auth-footer" style={{ marginTop: "1rem" }}>
          Didn't receive it?{" "}
          <button
            className="auth-link-btn"
            onClick={handleResend}
            disabled={!canResend}
            style={{ opacity: canResend ? 1 : 0.45 }}
          >
            Resend code
          </button>
          {!canResend && (
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                marginLeft: "4px",
              }}
            >
              ({seconds}s)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
