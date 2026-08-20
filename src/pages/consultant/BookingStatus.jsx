import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/Icon";
import { getBookingStatus } from "../../services/consultantBookingApi";
import "./BookingStatus.css";

const PAYMENT_LABELS = {
  awaiting_proof: { label: "Awaiting payment proof", tone: "pending" },
  pending_verification: { label: "Pending verification", tone: "pending" },
  verified: { label: "Payment verified", tone: "success" },
  rejected: { label: "Payment rejected", tone: "error" },
  expired: { label: "Expired", tone: "error" },
};

const BOOKING_LABELS = {
  pending: { label: "Pending confirmation", tone: "pending" },
  confirmed: { label: "Confirmed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "error" },
  completed: { label: "Completed", tone: "success" },
};

const StatusPill = ({ status, map }) => {
  const info = map[status] || { label: status, tone: "pending" };
  return <span className={`bs-pill bs-pill-${info.tone}`}>{info.label}</span>;
};

const BookingStatus = () => {
  const { bookingRef: refFromUrl } = useParams();
  const navigate = useNavigate();
  const [refInput, setRefInput] = useState(refFromUrl || "");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(!!refFromUrl);
  const searched = !!refFromUrl;

  useEffect(() => {
    if (!refFromUrl) return;
    let active = true;
    (async () => {
      setLoading(true);
      const data = await getBookingStatus(refFromUrl);
      if (active) {
        setBooking(data);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refFromUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!refInput.trim()) return;
    navigate(`/booking-status/${refInput.trim().toUpperCase()}`);
  };

  return (
    <div className="bs-page">
      <div className="bs-container">
        <Link to="/consultants" className="bs-back-link">
          <Icon name="arrow-right" size={14} style={{ transform: "rotate(180deg)" }} /> Back to consultants
        </Link>

        <h1>Check your booking</h1>
        <p className="bs-subtitle">Enter the booking reference you received after paying.</p>

        <form className="bs-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="e.g. CB-8F3K2Q"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
          />
          <button type="submit">Check status</button>
        </form>

        {loading && <p className="bs-loading">Looking up booking...</p>}

        {!loading && searched && !booking && (
          <p className="bs-not-found">No booking found for that reference.</p>
        )}

        {!loading && booking && (
          <div className="bs-card">
            <div className="bs-card-row">
              <span>Booking reference</span>
              <strong>{booking.bookingRef}</strong>
            </div>
            <div className="bs-card-row">
              <span>Consultant</span>
              <strong>{booking.consultantName}</strong>
            </div>
            <div className="bs-card-row">
              <span>Slot</span>
              <strong>
                {booking.slotDate} · {booking.slotStart} - {booking.slotEnd}
              </strong>
            </div>
            <div className="bs-card-row">
              <span>Amount</span>
              <strong>₹{booking.amount}</strong>
            </div>
            <div className="bs-card-row">
              <span>Payment status</span>
              <StatusPill status={booking.paymentStatus} map={PAYMENT_LABELS} />
            </div>
            <div className="bs-card-row">
              <span>Booking status</span>
              <StatusPill status={booking.bookingStatus} map={BOOKING_LABELS} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;
