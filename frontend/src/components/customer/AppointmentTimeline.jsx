import AppointmentCard from "./AppointmentCard";
import { C } from "../../constants/colors";

export default function AppointmentTimeline({
  appointments,
  loading,
  error,
  onReview,
  onRetry,
}) {
  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: C.textMuted }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          background: "rgba(244, 67, 54, 0.1)",
          border: "1px solid #F44336",
          borderRadius: 8,
          padding: "1.2rem",
          color: "#F44336",
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <strong>❌ Lỗi:</strong> {error}
        </div>
        <button
          onClick={onRetry}
          style={{
            padding: ".5rem 1rem",
            border: "1px solid #F44336",
            background: "transparent",
            color: "#F44336",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 600,
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F44336";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#F44336";
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state
  if (appointments.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: C.textMuted }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📋</div>
        <p style={{ fontSize: "1.1rem" }}>Không có lịch sử dịch vụ</p>
      </div>
    );
  }

  // Timeline
  return (
    <div style={{ position: "relative" }}>
      {appointments.map((appointment, index) => (
        <AppointmentCard
          key={appointment.appointmentId}
          appointment={appointment}
          index={index}
          totalItems={appointments.length}
          onReview={onReview}
        />
      ))}
    </div>
  );
}