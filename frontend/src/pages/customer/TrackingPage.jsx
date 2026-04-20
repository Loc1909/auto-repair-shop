import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";

export default function TrackingPage() {
    const navigate = useNavigate();
    const steps = [
        { label: "Tiếp nhận xe", time: "08:30", done: true, note: "Xe được tiếp nhận bởi KTV Minh Hùng. Đã chụp ảnh hiện trạng." },
        { label: "Chẩn đoán & lập báo giá", time: "09:15", done: true, note: "Hoàn thành chẩn đoán. Báo giá đã gửi cho khách." },
        { label: "Khách duyệt báo giá", time: "09:40", done: true, note: "Khách hàng đã duyệt báo giá qua app." },
        { label: "Thay lọc dầu & lọc gió", time: "10:20", done: true, note: "Hoàn thành. Dầu 5W-30 Shell Helix, lọc gió NGK." },
        { label: "Kiểm tra hệ thống phanh", time: "Đang thực hiện", done: false, active: true },
        { label: "Kiểm tra tổng thể", time: "Chờ", done: false },
        { label: "Vệ sinh xe & bàn giao", time: "Dự kiến 14:00", done: false },
    ];
    const [expanded, setExpanded] = useState(3);

    return (
        <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
            <BackgroundOrbs />
            <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
                <button className="btn-ghost" onClick={() => navigate("/dashboard")} style={{ marginBottom: "1.5rem" }}>← Quay lại</button>

                {/* Header card */}
                <div style={{ background: "linear-gradient(135deg,rgba(255,107,43,.1),rgba(255,184,77,.05))", border: "1px solid rgba(255,107,43,.2)", borderRadius: 24, padding: "2rem", marginBottom: "1.5rem", animation: "fadeUp .5s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                            <div className="tag" style={{ marginBottom: ".6rem" }}>Theo Dõi Live</div>
                            <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-1px", marginBottom: ".4rem" }}>Toyota Fortuner</h1>
                            <p style={{ color: C.textSub, fontSize: ".9rem" }}>51F-123.45 · Mã APG-847 · Bảo dưỡng định kỳ</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <span className="status-badge" style={{ background: C.amberDim, color: C.amber, fontSize: ".82rem", marginBottom: ".5rem", display: "inline-flex" }}>
                                <span className="notification-dot" style={{ width: 6, height: 6 }} /> Đang sửa chữa
                            </span>
                            <p style={{ fontSize: ".78rem", color: C.textMuted, marginTop: ".3rem" }}>KTV: Trần Minh Hùng</p>
                            <p style={{ fontSize: ".78rem", color: C.textMuted }}>Xưởng: Bay số 3</p>
                        </div>
                    </div>
                    <div style={{ marginTop: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", color: C.textMuted, marginBottom: ".5rem" }}>
                            <span>Tiến độ tổng thể</span><span style={{ color: C.orange, fontWeight: 600 }}>4/7 bước · ~57%</span>
                        </div>
                        <div className="progress-bar" style={{ height: 8 }}><div className="progress-fill" style={{ width: "57%" }} /></div>
                    </div>
                </div>

                {/* Steps */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", marginBottom: "1.5rem", animation: "fadeUp .5s ease .1s both" }}>
                    <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem" }}>Tiến Độ Sửa Chữa</h2>
                    {steps.map((s, i) => (
                        <div key={i} style={{ position: "relative", paddingLeft: "3rem", paddingBottom: i < steps.length - 1 ? "1.5rem" : "0", cursor: s.note ? "pointer" : "default" }} onClick={() => s.note && setExpanded(expanded === i ? -1 : i)}>
                            {i < steps.length - 1 && <div style={{ position: "absolute", left: 17, top: 36, bottom: 0, width: 2, background: s.done ? "linear-gradient(to bottom,rgba(255,107,43,.4),rgba(255,107,43,.1))" : "rgba(255,255,255,.06)" }} />}
                            <div style={{ position: "absolute", left: 0, top: 2, width: 36, height: 36, borderRadius: "50%", background: s.done ? "linear-gradient(135deg,#FF6B2B,#FF3B00)" : s.active ? "rgba(255,107,43,.15)" : "rgba(255,255,255,.06)", border: s.active ? "2px solid rgba(255,107,43,.5)" : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", transition: "all .3s" }}>
                                {s.done ? "✓" : s.active ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.orange, animation: "pulse 1s infinite", display: "block" }} /> : ""}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <p style={{ fontWeight: s.active ? 600 : 500, color: s.done ? C.text : s.active ? C.amber : "#4A4A6A", fontSize: ".9rem" }}>{s.label}</p>
                                <span style={{ fontSize: ".78rem", color: s.done ? C.green : s.active ? C.orange : C.textMuted, fontWeight: s.active ? 600 : 400 }}>{s.time}</span>
                            </div>
                            {expanded === i && s.note && <div style={{ marginTop: ".5rem", padding: ".7rem 1rem", background: "rgba(255,255,255,.03)", borderRadius: 10, fontSize: ".8rem", color: C.textSub, lineHeight: 1.6, animation: "fadeIn .3s ease" }}>{s.note}</div>}
                        </div>
                    ))}
                </div>

                {/* Bill */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", animation: "fadeUp .5s ease .2s both" }}>
                    <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.2rem" }}>Báo Giá Đã Duyệt</h2>
                    {[["Dầu nhớt Shell 5W-30 4L", "320.000đ"], ["Lọc dầu Denso", "85.000đ"], ["Lọc gió NGK", "120.000đ"], ["Công thay dầu & lọc", "150.000đ"]].map(([n, p]) => (
                        <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: ".87rem" }}>
                            <span style={{ color: C.textSub }}>{n}</span><span>{p}</span>
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".8rem", paddingTop: ".8rem" }}>
                        <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700 }}>Tổng cộng</span>
                        <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, color: C.orange, fontSize: "1.1rem" }}>675.000đ</span>
                    </div>
                    <button className="btn-p" onClick={() => navigate("/payment")} style={{ width: "100%", marginTop: "1.2rem", padding: ".85rem" }}>Thanh Toán Online →</button>
                </div>
            </div>
        </div>
    );
}