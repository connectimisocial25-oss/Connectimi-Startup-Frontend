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
      <div
        style={{
          width: "36px",
          height: "36px",
          backgroundColor: "var(--primary-green)",
          WebkitMaskImage: "url(/Connectimi_logo.png)",
          maskImage: "url(/Connectimi_logo.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
        aria-label="Connectimi Logo"
        role="img"
      />

      <p
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "var(--primary-green)",
          margin: 0,
          letterSpacing: "0.5px",
        }}
      >
        Connectimi
      </p>
    </div>
  );
};

export default Connectimi_logo;
