import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ── Capture install prompt as early as possible (before React renders) ─────
// The beforeinstallprompt event can fire very early. We save it globally so
// the Landing page can always access it, even if it mounts after the event.
window.__deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__deferredPrompt = e;
  // Dispatch a custom event so any already-mounted component can react
  window.dispatchEvent(new Event('pwa-prompt-ready'));
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => console.log("Service Worker registered scope:", reg.scope))
      .catch((err) => console.error("Service Worker registration failed:", err));
  });
}

