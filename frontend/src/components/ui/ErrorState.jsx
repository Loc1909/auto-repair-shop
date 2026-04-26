import React from "react";

export default function ErrorState({ error, onRetry }) {
  return (
    <div
      style={{
        padding: "1.5rem",
        background: "rgba(255,91,107,.1)",
        border: "1px solid rgba(255,91,107,.3)",
        borderRadius: 12,
        color: "#FF5B6B",
        marginBottom: "1.5rem",
        fontSize: ".95rem",
        lineHeight: 1.6,
      }}
    >
      <strong>⚠ Lỗi tải dữ liệu:</strong>
      <br />
      {error}
      <br />
      <button
        onClick={onRetry}
        style={{
          marginTop: "1rem",
          padding: ".5rem 1rem",
          background: "rgba(255,91,107,.2)",
          border: "1px solid rgba(255,91,107,.3)",
          color: "#FF5B6B",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: ".9rem",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "rgba(255,91,107,.3)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "rgba(255,91,107,.2)";
        }}
      >
        Thử lại
      </button>
    </div>
  );
}