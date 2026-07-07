import React, { useEffect, useRef } from "react";
import "./LoadingScreen.css";
import gsap from "gsap";

function LoadingScreen() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Elegant entry animation for the loading card using GSAP
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="loading-screen-container">
      <div className="loading-card" ref={containerRef}>
        <div className="logo-spinner-wrapper">
          <div className="spinner-outer-ring"></div>
          <div className="spinner-inner-logo" aria-label="Loading logo"></div>
        </div>
        <div className="loading-text">
          Loading
          <div className="loading-dots" style={{ display: 'flex', gap: '3px', marginLeft: '2px', alignItems: 'center' }}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
