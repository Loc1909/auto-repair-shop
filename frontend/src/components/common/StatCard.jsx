import useCountUp from "../../hooks/useCountUp";

function StatCard({ value, label, index, visible }) {
  const displayed = useCountUp(value, 1800 + index * 200, visible);
  return (
    <div style={{
      textAlign: "center",
      padding: "2rem 1rem",
      animation: visible ? `fadeUp 0.6s ease ${index * 0.15}s both` : "none",
    }}>
      <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "#FF6B2B", fontFamily: "'Kanit', sans-serif", letterSpacing: "-1px", lineHeight: 1 }}>
        {displayed}
      </div>
      <div style={{ fontSize: "0.85rem", color: "#8A8A9A", marginTop: "0.5rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}
export default StatCard;