import React, { useState, useEffect } from "react";
import { FiX, FiDownload, FiSmartphone, FiMonitor } from "react-icons/fi";
import { FaApple, FaAndroid, FaWindows } from "react-icons/fa";
import "./DownloadAppModal.css";

export default function DownloadAppModal({ isOpen, onClose, deferredPrompt, onSuccessfulInstall }) {
  const [activeTab, setActiveTab] = useState("android");
  const [installing, setInstalling] = useState(false);

  // Detect platform and set default tab
  useEffect(() => {
    if (isOpen) {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setActiveTab("ios");
      } else if (/android/.test(ua)) {
        setActiveTab("android");
      } else {
        setActiveTab("desktop");
      }
      setInstalling(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Only show instant-install button when browser actually supports it
  const canInstallInstantly = !!deferredPrompt;

  const handleInstallInstantly = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        if (onSuccessfulInstall) onSuccessfulInstall();
        onClose();
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="download-modal-overlay" onClick={onClose}>
      <div className="download-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="download-modal-header">
          <div className="download-title-wrapper">
            <FiDownload className="download-header-icon" />
            <h3>Get Connectimi App</h3>
          </div>
          <button className="download-modal-close" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className="download-modal-body">
          <p className="download-intro">
            Install Connectimi on your device for a full-screen, native experience with fast loading times.
          </p>

          {/* Instant install button — only shown when the browser supports it (Chrome Android/Desktop) */}
          {canInstallInstantly && (
            <button
              className="install-instantly-btn"
              onClick={handleInstallInstantly}
              disabled={installing}
            >
              <FiSmartphone className="btn-device-icon" />
              <span>{installing ? "Installing…" : "Install App Instantly"}</span>
            </button>
          )}

          {/* Separator */}
          <div className="download-separator">
            <span className="separator-line"></span>
            <span className="separator-text">
              {canInstallInstantly ? "or follow manual steps below" : "follow the steps below"}
            </span>
            <span className="separator-line"></span>
          </div>

          {/* Platform Tabs */}
          <div className="platform-tabs">
            <button
              className={`platform-tab ${activeTab === "ios" ? "active" : ""}`}
              onClick={() => setActiveTab("ios")}
            >
              <FaApple className="tab-icon" />
              <span>iPhone / iOS</span>
            </button>
            <button
              className={`platform-tab ${activeTab === "android" ? "active" : ""}`}
              onClick={() => setActiveTab("android")}
            >
              <FaAndroid className="tab-icon" />
              <span>Android</span>
            </button>
            <button
              className={`platform-tab ${activeTab === "desktop" ? "active" : ""}`}
              onClick={() => setActiveTab("desktop")}
            >
              <FiMonitor className="tab-icon" />
              <span>Windows / Mac</span>
            </button>
          </div>

          {/* Platform Instructions */}
          <div className="platform-instructions">
            {activeTab === "ios" && (
              <ol className="steps-list">
                <li>
                  <span className="step-number">1</span>
                  <span className="step-text">Open this website in <strong>Safari</strong>.</span>
                </li>
                <li>
                  <span className="step-number">2</span>
                  <span className="step-text">Tap the <strong>Share</strong> button (square with an upward arrow) at the bottom.</span>
                </li>
                <li>
                  <span className="step-number">3</span>
                  <span className="step-text">Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </li>
                <li>
                  <span className="step-number">4</span>
                  <span className="step-text">Confirm by tapping <strong>Add</strong> in the top-right corner.</span>
                </li>
              </ol>
            )}

            {activeTab === "android" && (
              <ol className="steps-list">
                <li>
                  <span className="step-number">1</span>
                  <span className="step-text">Open this website in <strong>Google Chrome</strong>.</span>
                </li>
                <li>
                  <span className="step-number">2</span>
                  <span className="step-text">Tap the <strong>Menu</strong> icon (three vertical dots) in the top-right.</span>
                </li>
                <li>
                  <span className="step-number">3</span>
                  <span className="step-text">Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
                </li>
                <li>
                  <span className="step-number">4</span>
                  <span className="step-text">Confirm the prompt by clicking <strong>Install</strong>.</span>
                </li>
              </ol>
            )}

            {activeTab === "desktop" && (
              <ol className="steps-list">
                <li>
                  <span className="step-number">1</span>
                  <span className="step-text">Open this website in <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, or <strong>Brave</strong>.</span>
                </li>
                <li>
                  <span className="step-number">2</span>
                  <span className="step-text">Look at the right side of the address bar and click the <strong>Install icon</strong> (monitor with down arrow, or the "+" sign).</span>
                </li>
                <li>
                  <span className="step-number">3</span>
                  <span className="step-text">Confirm the dialog by clicking <strong>Install</strong>.</span>
                </li>
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
