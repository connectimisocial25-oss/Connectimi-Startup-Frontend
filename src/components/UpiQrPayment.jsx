import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Icon from "./Icon";
import { buildUpiDeepLink } from "../services/consultantBookingApi";
import "./UpiQrPayment.css";

/**
 * Reusable UPI QR + deep-link + proof-upload block.
 * Used both by the guest booking flow (client → consultant) and the
 * consultant's own commission-settlement flow (consultant → platform).
 */
const UpiQrPayment = ({ upiId, payeeName, amount, note, onSubmitProof, submitting }) => {
  const [utrNumber, setUtrNumber] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");

  const deepLink = buildUpiDeepLink({ upiId, payeeName, amount, note });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — ignore, the UPI ID is still visible to copy manually
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Please upload an image (screenshot) of the payment.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image must be under 5MB.");
      return;
    }
    setFormError("");
    setProofFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setFormError("Enter the UTR / transaction reference number from your UPI app.");
      return;
    }
    setFormError("");
    onSubmitProof({ utrNumber: utrNumber.trim(), proofFile });
  };

  return (
    <div className="upi-qr-payment">
      <div className="upi-qr-code-wrap">
        <QRCodeSVG value={deepLink} size={200} level="M" includeMargin bgColor="#ffffff" fgColor="#0f172a" />
      </div>

      <div className="upi-amount-row">
        <span>Amount</span>
        <strong>₹{amount}</strong>
      </div>

      <div className="upi-id-row">
        <span className="upi-id-value">{upiId}</span>
        <button type="button" className="upi-copy-btn" onClick={handleCopy}>
          <Icon name="link" size={14} />
          {copied ? "Copied" : "Copy UPI ID"}
        </button>
      </div>

      <a className="upi-pay-app-btn" href={deepLink}>
        <Icon name="smartphone" size={16} />
        Pay with UPI app
      </a>
      <p className="upi-hint">On desktop, scan the QR with any UPI app. On mobile, tap "Pay with UPI app".</p>

      <form className="upi-proof-form" onSubmit={handleSubmit}>
        <label className="upi-field-label">UTR / Transaction reference number</label>
        <input
          type="text"
          className="upi-input"
          placeholder="e.g. 402812345678"
          value={utrNumber}
          onChange={(e) => setUtrNumber(e.target.value)}
        />

        <label className="upi-field-label">Payment screenshot (optional)</label>
        <input type="file" accept="image/*" className="upi-file-input" onChange={handleFileChange} />
        {proofFile && <span className="upi-file-name">{proofFile.name}</span>}

        {formError && <p className="upi-form-error">{formError}</p>}

        <button type="submit" className="upi-submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "I've paid — submit for verification"}
        </button>
      </form>
    </div>
  );
};

export default UpiQrPayment;
