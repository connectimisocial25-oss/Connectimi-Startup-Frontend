import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import UpiQrPayment from "../../components/UpiQrPayment";
import {
  DAY_NAMES,
  getMyBookings,
  getMyCommission,
  getMyConsultantProfile,
  PLATFORM_UPI_ID,
  PLATFORM_UPI_NAME,
  rejectBookingPayment,
  settleCommission,
  updateMyConsultantProfile,
  verifyBookingPayment,
} from "../../services/consultantBookingApi";
import "./ConsultantDashboard.css";

const TABS = [
  { id: "bookings", label: "Bookings", icon: "calendar" },
  { id: "availability", label: "Availability", icon: "clock" },
  { id: "commission", label: "Commission", icon: "chart-bar" },
];

const PAYMENT_TONE = {
  awaiting_proof: "pending",
  pending_verification: "pending",
  verified: "success",
  rejected: "error",
  expired: "error",
};

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    getMyBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleVerify = async (id) => {
    setBusyId(id);
    try {
      await verifyBookingPayment(id);
      load();
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    setBusyId(id);
    try {
      await rejectBookingPayment(id);
      load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="cd-empty">Loading bookings...</p>;
  if (bookings.length === 0) return <p className="cd-empty">No bookings yet.</p>;

  return (
    <div className="cd-bookings-list">
      {bookings.map((b) => (
        <div key={b.id} className="cd-booking-card">
          <div className="cd-booking-main">
            <div className="cd-booking-top">
              <strong>{b.clientName}</strong>
              <span className={`cd-pill cd-pill-${PAYMENT_TONE[b.paymentStatus] || "pending"}`}>
                {b.paymentStatus.replace(/_/g, " ")}
              </span>
            </div>
            <p className="cd-booking-meta">
              <Icon name="calendar" size={13} /> {b.slotDate} · {b.slotStart} - {b.slotEnd}
            </p>
            <p className="cd-booking-meta">
              <Icon name="phone" size={13} /> {b.clientPhone}
            </p>
            {b.notes && <p className="cd-booking-notes">{b.notes}</p>}
            {b.utrNumber && (
              <p className="cd-booking-meta">
                <Icon name="link" size={13} /> UTR: {b.utrNumber}
              </p>
            )}
            {b.paymentProofUrl && (
              <p className="cd-booking-meta">
                <Icon name="file-alt" size={13} />{" "}
                <a href={b.paymentProofUrl} target="_blank" rel="noreferrer">
                  View payment screenshot
                </a>
              </p>
            )}
            <p className="cd-booking-amount">₹{b.amount}</p>
          </div>
          {b.paymentStatus === "pending_verification" && (
            <div className="cd-booking-actions">
              <button
                className="cd-confirm-btn"
                disabled={busyId === b.id}
                onClick={() => handleVerify(b.id)}
              >
                Confirm payment received
              </button>
              <button className="cd-reject-btn" disabled={busyId === b.id} onClick={() => handleReject(b.id)}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const AvailabilityTab = ({ profile, onUpdated }) => {
  const [selectedDays, setSelectedDays] = useState(
    (profile.availability || []).map((a) => a.dayOfWeek),
  );
  const [startTime, setStartTime] = useState(profile.availability?.[0]?.startTime || "10:00");
  const [endTime, setEndTime] = useState(profile.availability?.[0]?.endTime || "17:00");
  const [slotDuration, setSlotDuration] = useState(profile.availability?.[0]?.slotDurationMinutes || 30);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleDay = (day) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateMyConsultantProfile({
        availability: selectedDays.map((dayOfWeek) => ({
          dayOfWeek,
          startTime,
          endTime,
          slotDurationMinutes: Number(slotDuration),
          isActive: true,
        })),
      });
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cd-availability">
      <label className="cd-label">Available days</label>
      <div className="cd-chip-grid">
        {DAY_NAMES.map((name, idx) => (
          <button
            type="button"
            key={name}
            className={`cd-chip ${selectedDays.includes(idx) ? "active" : ""}`}
            onClick={() => toggleDay(idx)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="cd-row">
        <div className="cd-field">
          <label className="cd-label">Start time</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="cd-field">
          <label className="cd-label">End time</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <div className="cd-field">
          <label className="cd-label">Slot length (min)</label>
          <select value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)}>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
            <option value={60}>60</option>
          </select>
        </div>
      </div>
      <button className="cd-save-btn" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved!" : "Save availability"}
      </button>
    </div>
  );
};

const CommissionTab = ({ profile }) => {
  const [data, setData] = useState({ commissionOwed: 0, settlements: [] });
  const [loading, setLoading] = useState(true);
  const [showSettle, setShowSettle] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getMyCommission().then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleSettle = async ({ utrNumber, proofFile }) => {
    setSubmitting(true);
    try {
      await settleCommission({ utrNumber, proofFile });
      setShowSettle(false);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="cd-empty">Loading commission summary...</p>;

  return (
    <div className="cd-commission">
      <div className="cd-commission-summary">
        <span>Commission owed to Connectimi ({profile.commissionRate}% per confirmed booking)</span>
        <strong>₹{data.commissionOwed}</strong>
        {data.commissionOwed > 0 && !showSettle && (
          <button className="cd-save-btn" onClick={() => setShowSettle(true)}>
            Settle now
          </button>
        )}
      </div>

      {showSettle && (
        <div className="cd-settle-box">
          <UpiQrPayment
            upiId={PLATFORM_UPI_ID}
            payeeName={PLATFORM_UPI_NAME}
            amount={data.commissionOwed}
            note={`Commission settlement — ${profile.name}`}
            onSubmitProof={handleSettle}
            submitting={submitting}
          />
        </div>
      )}

      <h3 className="cd-settlement-title">Settlement history</h3>
      {data.settlements.length === 0 ? (
        <p className="cd-empty">No settlements yet.</p>
      ) : (
        <div className="cd-settlement-list">
          {data.settlements.map((s) => (
            <div key={s.id} className="cd-settlement-row">
              <span>{new Date(s.createdAt).toLocaleDateString()}</span>
              <span>₹{s.amountOwed}</span>
              <span className={`cd-pill cd-pill-${s.status === "verified" ? "success" : s.status === "rejected" ? "error" : "pending"}`}>
                {s.status.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    getMyConsultantProfile().then((data) => {
      if (!data) {
        navigate("/consultant/apply", { replace: true });
      } else {
        setProfile(data);
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading || !profile) {
    return <div className="cd-page cd-loading">Loading...</div>;
  }

  return (
    <div className="cd-page">
      <div className="cd-container">
        <div className="cd-header">
          <img src={profile.avatar} alt={profile.name} className="cd-avatar" />
          <div>
            <h1>{profile.name}</h1>
            <p>{profile.headline}</p>
          </div>
          <div className="cd-stat">
            <span>Total bookings</span>
            <strong>{profile.totalBookings}</strong>
          </div>
        </div>

        <div className="cd-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`cd-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <Icon name={t.icon} size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="cd-tab-content">
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "availability" && (
            <AvailabilityTab profile={profile} onUpdated={setProfile} />
          )}
          {activeTab === "commission" && <CommissionTab profile={profile} />}
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
