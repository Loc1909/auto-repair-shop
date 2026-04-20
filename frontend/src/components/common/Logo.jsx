import { FaCar } from "react-icons/fa";

export default function Logo({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".7rem",
        cursor: "pointer"
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: "linear-gradient(135deg,#FF6B2B,#FF3B00)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(255,107,43,.35)"
        }}
      >
        <FaCar size={16} style={{ color: "#fff" }} />
      </div>

      <span style={{
        fontFamily: "'Kanit',sans-serif",
        fontWeight: 800,
        fontSize: "1.15rem"
      }}>
        Auto<span style={{ color: "#FF6B2B" }}>Pro</span>
      </span>
    </div>
  );
}