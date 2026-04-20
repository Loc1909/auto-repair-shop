import { useState } from "react";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import "../../styles/customer.css";

export default function PaymentPage({ setPage, showToast }) {
    const [method, setMethod] = useState("");
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const [done, setDone] = useState(false);
    const METHODS = [
        { id: "momo", icon: "🟣", label: "MoMo", desc: "Ví điện tử MoMo" },
        { id: "vnpay", icon: "🔵", label: "VNPay", desc: "QR Code / Thẻ ngân hàng" },
        { id: "zalopay", icon: "🔷", label: "ZaloPay", desc: "Ví ZaloPay" },
        { id: "card", icon: "💳", label: "Thẻ Quốc Tế", desc: "Visa / Mastercard" },
        { id: "transfer", icon: "🏦", label: "Chuyển Khoản", desc: "Ngân hàng nội địa" },
    ];
    const handlePay = () => {
        if (!method) { showToast("Chọn phương thức thanh toán", "error"); return; }
        setProcessing(true);
        setTimeout(() => { setProcessing(false); setDone(true); showToast("Thanh toán thành công! ✓", "success"); }, 2000);
    };

    if (done) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <BackgroundOrbs />
            <div style={{ maxWidth: 440, width: "100%", textAlign: "center", zIndex: 1, animation: "scaleIn .5s ease" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#4ADAA0,#2AB880)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 1.5rem", animation: "glow 2s infinite" }}>✓</div>
                <h2 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-1px", marginBottom: "1rem" }}>Thanh Toán Thành Công!</h2>
                <p style={{ color: C.textSub, lineHeight: 1.8, marginBottom: "1.5rem" }}>Hóa đơn điện tử đã được gửi về<br /><strong style={{ color: C.text }}>0901 234 567</strong></p>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
                    {[["Mã giao dịch", "TXN-" + Math.floor(Math.random() * 999999)], ["Số tiền", "675.000đ"], ["Phương thức", METHODS.find(m => m.id === method)?.label || "—"], ["Thời gian", new Date().toLocaleString("vi-VN")]].map(([l, v]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: ".4rem 0", fontSize: ".85rem", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                            <span style={{ color: C.textMuted }}>{l}</span><span style={{ fontWeight: 500, color: l === "Số tiền" ? C.orange : C.text }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: ".8rem", justifyContent: "center" }}>
                    <button className="btn-p" onClick={() => navigate("/review")} style={{ padding: ".85rem 1.8rem" }}>⭐ Đánh Giá Dịch Vụ</button>
                    <button className="btn-o" onClick={() => navigate("/dashboard")} style={{ padding: ".85rem 1.8rem" }}>Về Dashboard</button>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
            <BackgroundOrbs />
            <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
                <button className="btn-ghost" onClick={() => navigate("/dashboard")}>← Quay lại</button>
                    <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-1px" }}>Thanh Toán <span className="grad-text">Online</span></h1>

                {/* Bill summary */}
                <div style={{ background: "linear-gradient(135deg,rgba(255,107,43,.08),rgba(255,184,77,.04))", border: "1px solid rgba(255,107,43,.2)", borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem", animation: "fadeUp .5s ease" }}>
                    <p style={{ fontSize: ".78rem", color: C.textMuted, marginBottom: ".4rem" }}>Toyota Fortuner 51F-123.45 · APG-847</p>
                    <h2 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "2rem", color: C.orange, letterSpacing: "-1px" }}>675.000đ</h2>
                    <p style={{ fontSize: ".82rem", color: C.textSub, marginTop: ".3rem" }}>Bảo dưỡng định kỳ 10.000km</p>
                </div>

                {/* Methods */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", marginBottom: "1.2rem", animation: "fadeUp .5s ease .1s both" }}>
                    <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: "1.2rem" }}>Chọn Phương Thức Thanh Toán</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
                        {METHODS.map(m => (
                            <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.2rem", border: `1.5px solid ${method === m.id ? "rgba(255,107,43,.5)" : C.border}`, borderRadius: 14, background: method === m.id ? "rgba(255,107,43,.08)" : C.bgCard2, cursor: "pointer", transition: "all .25s", width: "100%", textAlign: "left" }}>
                                <span style={{ fontSize: "1.3rem", minWidth: 28 }}>{m.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 500, color: method === m.id ? C.orange : C.text, fontSize: ".9rem" }}>{m.label}</p>
                                    <p style={{ fontSize: ".78rem", color: C.textMuted }}>{m.desc}</p>
                                </div>
                                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${method === m.id ? C.orange : "rgba(255,255,255,.2)"}`, background: method === m.id ? "linear-gradient(135deg,#FF6B2B,#FF3B00)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", color: "#fff", flexShrink: 0 }}>
                                    {method === m.id ? "✓" : ""}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Voucher */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1.5rem", marginBottom: "1.2rem", animation: "fadeUp .5s ease .2s both" }}>
                    <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 600, fontSize: ".95rem", marginBottom: "1rem" }}>🎁 Mã Voucher</h3>
                    <div style={{ display: "flex", gap: ".7rem" }}>
                        <input placeholder="Nhập mã giảm giá..." style={{ flex: 1 }} />
                        <button className="btn-o" style={{ padding: ".7rem 1.2rem", fontSize: ".85rem", borderRadius: 12, whiteSpace: "nowrap" }}>Áp dụng</button>
                    </div>
                </div>

                <button className="btn-p" onClick={handlePay} disabled={processing} style={{ width: "100%", padding: "1.1rem", fontSize: "1rem", animation: "fadeUp .5s ease .3s both" }}>
                    {processing ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".7rem" }}><span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />Đang xử lý thanh toán...</span> : `Thanh Toán 675.000đ →`}
                </button>
                <p style={{ textAlign: "center", marginTop: "1rem", fontSize: ".78rem", color: C.textMuted }}>🔒 Giao dịch được mã hóa SSL · Bảo mật 256-bit</p>
            </div>
        </div>
    );
}