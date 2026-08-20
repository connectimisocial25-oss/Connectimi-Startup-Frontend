import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { applyAsConsultant, getMyConsultantProfile, SPECIALIZATIONS, DAY_NAMES } from "../../services/consultantBookingApi";
import "./ConsultantApply.css";

const UPI_REGEX = /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/;

const ConsultantApply = () => {
  const navigate = useNavigate();
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiPayeeName, setUpiPayeeName] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState(30);

  useEffect(() => {
    getMyConsultantProfile().then((profile) => {
      if (profile) {
        navigate("/consultant/dashboard", { replace: true });
      } else {
        setCheckingExisting(false);
      }
    });
  }, [navigate]);

  const toggleSpecialization = (s) => {
    setSpecializations((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!headline.trim() || !consultationFee || !upiId.trim() || !upiPayeeName.trim()) {
      setError("Please fill in headline, fee, UPI ID, and payee name.");
      return;
    }
    if (Number(consultationFee) <= 0) {
      setError("Consultation fee must be greater than 0.");
      return;
    }
    if (!UPI_REGEX.test(upiId.trim())) {
      setError("That doesn't look like a valid UPI ID (e.g. name@bank).");
      return;
    }
    if (selectedDays.length === 0) {
      setError("Select at least one available day.");
      return;
    }
    if (startTime >= endTime) {
      setError("Availability start time must be before end time.");
      return;
    }

    setSaving(true);
    try {
      await applyAsConsultant({
        headline: headline.trim(),
        bio: bio.trim(),
        consultationFee: Number(consultationFee),
        upiId: upiId.trim(),
        upiPayeeName: upiPayeeName.trim(),
        specializations,
        availability: selectedDays.map((dayOfWeek) => ({
          dayOfWeek,
          startTime,
          endTime,
          slotDurationMinutes: Number(slotDuration),
          isActive: true,
        })),
      });
      navigate("/consultant/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (checkingExisting) {
    return <div className="ca-page ca-loading">Loading...</div>;
  }

  return (
    <div className="ca-page">
      <div className="ca-container">
        <div className="ca-header">
          <h1>Become a Consultant</h1>
          <p>
            Set your fee, your UPI ID, and your availability. Clients pay you directly — Connectimi only
            takes a commission on confirmed bookings, settled separately.
          </p>
        </div>

        <form className="ca-form" onSubmit={handleSubmit}>
          <div className="ca-section">
            <h2>Profile</h2>
            <label>Headline</label>
            <input
              type="text"
              placeholder="e.g. Corporate Law · 8 yrs experience"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
            <label>Bio</label>
            <textarea
              rows={4}
              placeholder="Tell clients what you help with..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <label>Specializations</label>
            <div className="ca-chip-grid">
              {SPECIALIZATIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`ca-chip ${specializations.includes(s) ? "active" : ""}`}
                  onClick={() => toggleSpecialization(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="ca-section">
            <h2>Fee & payment</h2>
            <div className="ca-row">
              <div className="ca-field">
                <label>Consultation fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="1500"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                />
              </div>
              <div className="ca-field">
                <label>UPI ID</label>
                <input
                  type="text"
                  placeholder="name@bank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </div>
            <label>Payee name (shown in client's UPI app)</label>
            <input
              type="text"
              placeholder="Your full name"
              value={upiPayeeName}
              onChange={(e) => setUpiPayeeName(e.target.value)}
            />
          </div>

          <div className="ca-section">
            <h2>Availability</h2>
            <div className="ca-day-grid">
              {DAY_NAMES.map((name, idx) => (
                <button
                  type="button"
                  key={name}
                  className={`ca-chip ${selectedDays.includes(idx) ? "active" : ""}`}
                  onClick={() => toggleDay(idx)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="ca-row">
              <div className="ca-field">
                <label>Start time</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="ca-field">
                <label>End time</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
              <div className="ca-field">
                <label>Slot length (min)</label>
                <select value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)}>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={45}>45</option>
                  <option value={60}>60</option>
                </select>
              </div>
            </div>
          </div>

          {error && <p className="ca-error">{error}</p>}

          <button type="submit" className="ca-submit-btn" disabled={saving}>
            {saving ? "Submitting..." : "Start accepting bookings"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultantApply;
