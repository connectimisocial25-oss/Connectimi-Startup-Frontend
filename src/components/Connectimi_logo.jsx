import React from "react";

const Connectimi_logo = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        width: "fit-content",
        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <img
        src="/Connectimi_logo.png"
        alt="Connectimi Logo"
        style={{
          width: "36px",
          height: "36px",
          objectFit: "contain",
        }}
      />

      <p
        style={{
          fontSize: "22px",
          fontWeight: "800",
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "-0.5px",
        }}
      >
        Connect<span style={{ color: "var(--primary-green)" }}>imi</span>
      </p>
    </div>
  );
};

export default Connectimi_logo;