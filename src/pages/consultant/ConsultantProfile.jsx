import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/Icon";
import UpiQrPayment from "../../components/UpiQrPayment";
import {
  createBooking,
  getAvailableSlots,
  getPublicConsultant,
  uploadPaymentProof,
} from "../../services/consultantBookingApi";
import "./ConsultantProfile.css";

function nextDays(count) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

const toDateStr = (d) => d.toISOString().slice(0, 10);

const ConsultantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const days = useMemo(() => nextDays(14), []);
  const [selectedDate, setSelectedDate] = useState(toDateStr(days[0]));
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // step: 'slots' | 'details' | 'payment' | 'submitted'
  const [step, setStep] = useState("slots");
  const [form, setForm] = useState({ clientName: "", clientPhone: "", clientEmail: "", notes: "" });
  const [formError, setFormError] = useState("");
  const [bookingInfo, setBookingInfo] = useState(null);
  const [submittingProof, setSubmittingProof] = useState(false);

  useEffect(() => {
    let active = true;
    getPublicConsultant(id).then((data) => {
      if (!active) return;
      if (!data) {
        setNotFound(true);
      } else {
        setConsultant(data);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!consultant) return;
    let active = true;
    setSlotsLoading(true);
    setSelectedSlot(null);
    getAvailableSlots(consultant.id, selectedDate).then((data) => {
      if (active) {
        setSlots(data);
        setSlotsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [consultant, selectedDate]);

  const handlePickSlot = (slot) => {
    setSelectedSlot(slot);
    setStep("details");
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.clientPhone.trim()) {
      setFormError("Name and phone number are required.");
      return;
    }
    setFormError("");
    try {
      const res = await createBooking({
        consultantId: consultant.id,
        slotDate: selectedDate,
        slotStart: selectedSlot.start,
        slotEnd: selectedSlot.end,
        clientName: form.clientName.trim(),
        clientPhone: form.clientPhone.trim(),
        clientEmail: form.clientEmail.trim(),
        notes: form.notes.trim(),
      });
      setBookingInfo(res);
      setStep("payment");
    } catch (err) {
      setFormError(err.message || "Could not create booking.");
    }
  };

  const handleSubmitProof = async ({ utrNumber, proofFile }) => {
    setSubmittingProof(true);
    try {
      await uploadPaymentProof(bookingInfo.bookingRef, {
        utrNumber,
        proofFile,
      });
      setStep("submitted");
    } catch (err) {
      alert(err.message || "Could not submit payment proof.");
    } finally {
      setSubmittingProof(false);
    }
  };

  if (loading) {
    return <div className="consultant-profile-page consultant-profile-loading">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="consultant-profile-page consultant-profile-loading">
        <p>Consultant not found.</p>
        <Link to="/consultants" className="cp-back-link">
          <Icon name="arrow-right" size={14} style={{ transform: "rotate(180deg)" }} /> Back to consultants
        </Link>
      </div>
    );
  }

  return (
    <div className="consultant-profile-page">
      <div className="cp-container">
        <Link to="/consultants" className="cp-back-link">
          <Icon name="arrow-right" size={14} style={{ transform: "rotate(180deg)" }} /> Back to consultants
        </Link>

        <div className="cp-header-card">
          <img src={consultant.avatar} alt={consultant.name} className="cp-avatar" />
          <div>
            <h1>{consultant.name}</h1>
            <p className="cp-headline">{consultant.headline}</p>
            <div className="cp-tags">
              {consultant.specializations.map((s) => (
                <span key={s} className="cp-tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="cp-fee-box">
            <span>Consultation fee</span>
            <strong>₹{consultant.consultationFee}</strong>
          </div>
        </div>

        {consultant.bio && (
          <div className="cp-section">
            <h2>About</h2>
            <p className="cp-bio">{consultant.bio}</p>
          </div>
        )}

        {step === "slots" && (
          <div className="cp-section">
            <h2>Pick a slot</h2>
            <div className="cp-day-strip">
              {days.map((d) => {
                const dateStr = toDateStr(d);
                return (
                  <button
                    key={dateStr}
                    className={`cp-day-btn ${selectedDate === dateStr ? "active" : ""}`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <span className="cp-day-name">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                    <span className="cp-day-num">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <div className="cp-slots-grid">
              {slotsLoading ? (
                <p className="cp-slots-empty">Loading slots...</p>
              ) : slots.length === 0 ? (
                <p className="cp-slots-empty">No available slots on this date. Try another day.</p>
              ) : (
                slots.map((s) => (
                  <button key={s.start} className="cp-slot-btn" onClick={() => handlePickSlot(s)}>
                    {s.start}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {step === "details" && selectedSlot && (
          <div className="cp-section">
            <h2>Your details</h2>
            <p className="cp-slot-summary">
              <Icon name="calendar" size={14} /> {selectedDate} · {selectedSlot.start} - {selectedSlot.end}
            </p>
            <form className="cp-form" onSubmit={handleDetailsSubmit}>
              <input
                type="text"
                placeholder="Full name"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={form.clientPhone}
                onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              />
              <textarea
                placeholder="Briefly describe your case (optional)"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              {formError && <p className="cp-form-error">{formError}</p>}
              <div className="cp-form-actions">
                <button type="button" className="cp-secondary-btn" onClick={() => setStep("slots")}>
                  Back
                </button>
                <button type="submit" className="cp-primary-btn">
                  Continue to payment
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "payment" && bookingInfo && (
          <div className="cp-section">
            <h2>Pay & confirm your slot</h2>
            <p className="cp-payment-notice">
              Your slot is reserved for the next 10 minutes while payment is verified. This is not
              automatic — {consultant.name} will confirm once they receive your payment.
            </p>
            <UpiQrPayment
              upiId={bookingInfo.upiId}
              payeeName={bookingInfo.upiPayeeName}
              amount={bookingInfo.amount}
              note={`Connectimi booking ${bookingInfo.bookingRef}`}
              onSubmitProof={handleSubmitProof}
              submitting={submittingProof}
            />
          </div>
        )}

        {step === "submitted" && bookingInfo && (
          <div className="cp-section cp-submitted">
            <Icon name="check-circle" size={40} />
            <h2>Payment submitted for verification</h2>
            <p>
              Your booking reference is <strong>{bookingInfo.bookingRef}</strong>. Save it to check your
              booking status any time.
            </p>
            <button className="cp-primary-btn" onClick={() => navigate(`/booking-status/${bookingInfo.bookingRef}`)}>
              View booking status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantProfile;
