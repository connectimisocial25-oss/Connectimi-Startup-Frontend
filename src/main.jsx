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
  if (navigator.serviceWorker.controller) {
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => {
        console.log("Service Worker registered scope:", reg.scope);
        // The browser only re-checks sw.js on a real navigation. This is an
        // SPA — client-side routing isn't one — so an open tab or a resumed
        // PWA can go days without ever noticing a deploy. Poke it when the
        // tab becomes visible, at most hourly.
        let lastCheck = Date.now();
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState !== "visible") return;
          if (Date.now() - lastCheck < 60 * 60 * 1000) return;
          lastCheck = Date.now();
          reg.update();
        });
      })
      .catch((err) => console.error("Service Worker registration failed:", err));
  });
}

