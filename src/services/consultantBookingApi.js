/**
 * API client for the Consultant Booking feature.
 *
 * Talks to the real backend (express-backend/src/routes/consultantBooking.routes.js
 * mounted at /api/v1/consultants, and publicBooking.routes.js at /api/v1/public).
 * Every function here unwraps the backend's response envelope so the page
 * components in src/pages/consultant/* can consume plain data shapes.
 */

import API from "./api";
import { parseApiError } from "../utils/adapters";

async function unwrap(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    throw new Error(parseApiError(err));
  }
}

function proofFormData(utrNumber, proofFile) {
  const form = new FormData();
  form.append("utrNumber", utrNumber);
  if (proofFile) form.append("proof", proofFile);
  return form;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Consultant management (authenticated) ─────────────────────────────────

export async function applyAsConsultant(profileData) {
  const data = await unwrap(API.post("/consultants/apply", profileData));
  return data.consultant;
}

export async function getMyConsultantProfile() {
  try {
    const res = await API.get("/consultants/me");
    return res.data.consultant;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(parseApiError(err));
  }
}

export async function updateMyConsultantProfile(patch) {
  const data = await unwrap(API.put("/consultants/me", patch));
  return data.consultant;
}

export async function getMyBookings({ paymentStatus, bookingStatus } = {}) {
  const data = await unwrap(
    API.get("/consultants/me/bookings", { params: { paymentStatus, bookingStatus } }),
  );
  return data.bookings;
}

export async function verifyBookingPayment(bookingId) {
  const data = await unwrap(API.put(`/consultants/me/bookings/${bookingId}/verify`));
  return data.booking;
}

export async function rejectBookingPayment(bookingId) {
  const data = await unwrap(API.put(`/consultants/me/bookings/${bookingId}/reject`));
  return data.booking;
}

export async function getMyCommission() {
  return unwrap(API.get("/consultants/me/commission"));
}

export async function settleCommission({ utrNumber, proofFile }) {
  const data = await unwrap(
    API.post("/consultants/me/commission/settle", proofFormData(utrNumber, proofFile), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
  return data.settlement;
}

// ─── Public marketplace (no auth) ───────────────────────────────────────────

export async function listPublicConsultants({ specialization, minFee, maxFee, search } = {}) {
  const data = await unwrap(
    API.get("/public/consultants", { params: { specialization, minFee, maxFee, search } }),
  );
  return data.consultants;
}

export async function getPublicConsultant(id) {
  try {
    const res = await API.get(`/public/consultants/${id}`);
    return res.data.consultant;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(parseApiError(err));
  }
}

export async function getAvailableSlots(consultantId, dateStr) {
  const data = await unwrap(
    API.get(`/public/consultants/${consultantId}/slots`, { params: { date: dateStr } }),
  );
  return data.slots;
}

export async function createBooking(payload) {
  return unwrap(API.post("/public/bookings", payload));
}

export async function uploadPaymentProof(bookingRef, { utrNumber, proofFile }) {
  const data = await unwrap(
    API.post(`/public/bookings/${bookingRef}/payment-proof`, proofFormData(utrNumber, proofFile), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
  return data.booking;
}

export async function getBookingStatus(bookingRef) {
  try {
    const res = await API.get(`/public/bookings/${bookingRef}`);
    return res.data.booking;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw new Error(parseApiError(err));
  }
}

export function buildUpiDeepLink({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams({
    pa: upiId || "",
    pn: payeeName || "",
    am: String(amount ?? ""),
    cu: "INR",
    tn: note || "",
  });
  return `upi://pay?${params.toString()}`;
}

// Platform's own UPI ID — where consultants pay their commission settlements.
// Display-only on the frontend; the backend doesn't need to know it since
// settlement verification is manual in v1 (see CommissionSettlement model).
export const PLATFORM_UPI_ID = "connectimi@okhdfcbank";
export const PLATFORM_UPI_NAME = "Connectimi";

export const SPECIALIZATIONS = [
  "Corporate Law",
  "Family Law",
  "Criminal Law",
  "Contract Law",
  "Startup Advisory",
  "Mediation",
  "Property Law",
  "Labour Law",
  "Intellectual Property",
  "Tax Law",
];

export { DAY_NAMES };
