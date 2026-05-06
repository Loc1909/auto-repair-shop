import { C } from "../../../constants/colors";
import { formatDateTime } from "../../../utils/utils";

const STATUS_CONFIG = {
    PENDING: { label: "Chờ xác nhận", color: C.blue, bg: C.blueDim },
    CONFIRMED: { label: "Đã xác nhận lịch hẹn", color: C.green, bg: C.greenDim },
    RECEIVED: { label: "Đã nhận xe", color: C.amber, bg: C.amberDim },
    CANCELLED: { label: "Đã hủy", color: C.red, bg: C.redDim },
};

export default function DashBoardAppointmentCard({ appointment: a }) {
    const cfg = STATUS_CONFIG[a.status];
    return (
        <div
            className="card"
            style={{ marginBottom: "1rem", padding: "1.5rem", cursor: "pointer" }}
        >
            <div
                style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: "1rem",
                }} >
                <div>
                    <p
                        style={{
                            fontFamily: "'Kanit',sans-serif", fontWeight: 700,
                            fontSize: "1rem", marginBottom: ".2rem",
                        }} >
                        {a.note}
                    </p>
                    <p style={{ fontSize: ".82rem", color: C.textSub }}>{a.car}</p>
                </div>

                <span className="status-badge"
                    style={{ background: cfg.bg, color: cfg.color }} >
                    {a.status === "RECEIVED" && (
                        <span className="notif-dot" style={{ width: 6, height: 6 }} />
                    )}
                    {cfg.label}
                </span>
            </div>

            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }} >
                <span style={{ fontSize: ".9rem", color: C.textMuted }}>
                    📅 {formatDateTime(a.appointmentTime)}
                </span>
                <span style={{
                    fontFamily: "'Kanit',sans-serif", fontWeight: 500,
                    color: C.textSub, fontSize: ".9rem",
                }} >
                    KTV: {a.employeeName}
                </span>
            </div>
        </div>
    );
}