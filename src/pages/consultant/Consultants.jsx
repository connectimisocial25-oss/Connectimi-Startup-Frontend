import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon";
import { listPublicConsultants, SPECIALIZATIONS } from "../../services/consultantBookingApi";
import "./Consultants.css";

const Consultants = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [maxFee, setMaxFee] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const data = await listPublicConsultants({
        search: search.trim() || undefined,
        specialization: specialization || undefined,
        maxFee: maxFee || undefined,
      });
      if (active) {
        setConsultants(data);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [search, specialization, maxFee]);

  return (
    <div className="consultants-page">
      <div className="consultants-hero">
        <Link to="/" className="consultants-logo-link">
          <span className="consultants-logo-dot" />
          Connectimi
        </Link>
        <h1>Talk to a lawyer directly</h1>
        <p>
          Browse verified law students, advocates, and legal scholars offering paid consultations.
          Pick a slot, pay the lawyer directly via UPI, and you're booked — no account needed.
        </p>
      </div>

      <div className="consultants-filters">
        <div className="consultants-search-wrap">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Search by name, specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All specializations</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={maxFee} onChange={(e) => setMaxFee(e.target.value)}>
          <option value="">Any fee</option>
          <option value="500">Under ₹500</option>
          <option value="1000">Under ₹1,000</option>
          <option value="2000">Under ₹2,000</option>
          <option value="5000">Under ₹5,000</option>
        </select>
      </div>

      <div className="consultants-grid">
        {loading ? (
          <p className="consultants-empty">Loading consultants...</p>
        ) : consultants.length === 0 ? (
          <p className="consultants-empty">No consultants match your filters.</p>
        ) : (
          consultants.map((c) => (
            <Link to={`/consultants/${c.id}`} key={c.id} className="consultant-card">
              <img src={c.avatar} alt={c.name} className="consultant-avatar" />
              <div className="consultant-card-body">
                <h3>{c.name}</h3>
                <p className="consultant-headline">{c.headline}</p>
                <div className="consultant-tags">
                  {c.specializations.slice(0, 2).map((s) => (
                    <span key={s} className="consultant-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="consultant-card-footer">
                <span className="consultant-fee">₹{c.consultationFee}</span>
                <span className="consultant-view-btn">
                  View & Book <Icon name="arrow-right" size={14} />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Consultants;
