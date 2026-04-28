import { useNavigate } from "react-router-dom";
import DashBoardAppointmentCard from "../dashboard/DashBoardAppointmentCard";

const DAYS_MS = 86_400_000;

function isVisible(appointment) {
  return (
    appointment.status !== "CANCELLED" &&
    new Date(appointment.appointmentTime) > new Date(Date.now() - (90 * DAYS_MS))
  );
}

export default function AppointmentList({ appointments }) {
  const navigate = useNavigate();
  const visible = appointments.filter(isVisible);

  return (
    <div>
      <h2
        className="gradient-text-white"
        style={{
          fontFamily: "'Kanit',sans-serif",
          fontWeight: 700,
          fontSize: "1.1rem",
          marginBottom: "1rem",
        }}
      >
        Lịch Hẹn Của Tôi
      </h2>

      {visible.map((a) => (
        <DashBoardAppointmentCard
          key={a.id}
          appointment={a}
        />
      ))}

      <button
        className="btn-p"
        onClick={() => navigate("/booking")}
        style={{ width: "100%", padding: ".85rem" }}
      >
        + Đặt Lịch Mới
      </button>
    </div>
  );
}