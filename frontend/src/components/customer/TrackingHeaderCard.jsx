import React from "react";
import { useNavigate } from "react-router-dom";
import BackgroundOrbs from "../effects/BackgroundOrbs";
import { C } from "../../constants/colors";

const HeaderCard = ({ order, statusInfo, completedSteps, totalSteps, percentage }) => {
    const navigate = useNavigate();

    return (
        <div style={{ background: "linear-gradient(135deg,rgba(255,107,43,.1),rgba(255,184,77,.05))", border: "1px solid rgba(255,107,43,.2)", borderRadius: 24, padding: "2rem", marginBottom: "1.5rem", animation: "fadeUp .5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <div className="tag" style={{ marginBottom: ".6rem" }}>Theo Dõi Live</div>
                    <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-1px", marginBottom: ".4rem" }}>
                        {order.vehicleBrand} {order.vehicleModel}
                    </h1>
                    <p style={{ color: C.textSub, fontSize: ".9rem" }}>
                        {order.vehicleLicensePlate} · Mã APG-{order.id} · {order.serviceType || "Bảo dưỡng định kỳ"}
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <span className="status-badge" style={{ background: statusInfo.bgColor, color: statusInfo.color, fontSize: ".82rem", marginBottom: ".5rem", display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".4rem .8rem", borderRadius: 8 }}>
                        <span className="notification-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: statusInfo.color }} />
                        {statusInfo.label}
                    </span>
                    <p style={{ fontSize: ".8rem", color: C.textMuted, marginTop: ".3rem" }}>KTV: {order.employeeName}</p>
                    <p style={{ fontSize: ".8rem", color: C.textMuted }}>Xưởng: Số 1</p>
                </div>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", color: C.textMuted, marginBottom: ".5rem" }}>
                    <span>Tiến độ tổng thể</span>
                    <span style={{ color: C.orange, fontWeight: 600 }}>
                        {completedSteps}/{totalSteps} bước · ~{percentage}%
                    </span>
                </div>
                <div className="progress-bar" style={{ height: 8, background: "rgba(255,255,255,.06)", borderRadius: 10, overflow: "hidden" }}>
                    <div className="progress-fill" style={{
                        width: `${percentage}%`,
                        background: "linear-gradient(90deg, #FF6B2B, #FFB84D)",
                        height: "100%",
                        transition: "width .5s ease"
                    }} />
                </div>
            </div>
        </div>
    );
};

export default HeaderCard;