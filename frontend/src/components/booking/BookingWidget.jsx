import { SERVICES } from "../../constants/services";
import { useState } from "react";

export default function BookingWidget({ heroVisible }) {

    const [bookingStep, setBookingStep] = useState(0);
    const [plate, setPlate] = useState("");
    const [service, setService] = useState("");
    const [date, setDate] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleBook = () => {
        if (bookingStep < 2) {
            setBookingStep(s => s + 1);
            return;
        }
        setSubmitted(true);
    };


    return (
        <div style={{ animation: heroVisible ? "fadeUp 0.8s ease 0.2s both" : "none" }}>
            <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24, padding: "2.5rem", backdropFilter: "blur(20px)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
            }}>
                {!submitted ? (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>Đặt Lịch Nhanh</h3>
                                <p style={{ fontSize: "0.8rem", color: "#7A7A9A", marginTop: "0.2rem" }}>Chỉ 30 giây để đặt lịch</p>
                            </div>
                            <div style={{ background: "rgba(255,107,43,0.1)", border: "1px solid rgba(255,107,43,0.2)", borderRadius: "50px", padding: "0.3rem 0.8rem", fontSize: "0.75rem", color: "#FF8C5A" }}>
                                Bước {bookingStep + 1}/3
                            </div>
                        </div>

                        {/* Progress */}
                        <div style={{ display: "flex", gap: "4px", marginBottom: "1.8rem" }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{ flex: 1, height: 3, borderRadius: 4, background: i <= bookingStep ? "linear-gradient(90deg, #FF6B2B, #FFB84D)" : "rgba(255,255,255,0.1)", transition: "background 0.4s" }} />
                            ))}
                        </div>

                        {bookingStep === 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#7A7A9A", display: "block", marginBottom: "0.5rem" }}>Biển số xe</label>
                                    <input placeholder="VD: 51F-123.45" value={plate} onChange={e => setPlate(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#7A7A9A", display: "block", marginBottom: "0.5rem" }}>Họ và tên</label>
                                    <input placeholder="Nguyễn Văn A" />
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#7A7A9A", display: "block", marginBottom: "0.5rem" }}>Số điện thoại</label>
                                    <input placeholder="0901 234 567" />
                                </div>
                            </div>
                        )}

                        {bookingStep === 1 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#7A7A9A", display: "block", marginBottom: "0.5rem" }}>Dịch vụ cần</label>
                                    <select value={service} onChange={e => setService(e.target.value)}>
                                        <option value="">Chọn dịch vụ...</option>
                                        {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#7A7A9A", display: "block", marginBottom: "0.5rem" }}>Mô tả vấn đề</label>
                                    <input placeholder="Mô tả ngắn về vấn đề xe..." />
                                </div>
                            </div>
                        )}

                        {bookingStep === 2 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#7A7A9A", display: "block", marginBottom: "0.5rem" }}>Ngày mong muốn</label>
                                    <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "#7A7A9A", display: "block", marginBottom: "0.5rem" }}>Khung giờ</label>
                                    <select>
                                        <option>7:00 - 9:00</option>
                                        <option>9:00 - 11:00</option>
                                        <option>13:00 - 15:00</option>
                                        <option>15:00 - 17:00</option>
                                    </select>
                                </div>
                                <div style={{ background: "rgba(255,107,43,0.08)", border: "1px solid rgba(255,107,43,0.15)", borderRadius: 12, padding: "1rem" }}>
                                    <p style={{ fontSize: "0.8rem", color: "#FF8C5A", marginBottom: "0.3rem" }}>✓ Sau khi đặt lịch</p>
                                    <p style={{ fontSize: "0.78rem", color: "#7A7A9A", lineHeight: 1.6 }}>Bạn sẽ nhận SMS xác nhận và có thể theo dõi tiến độ sửa chữa theo thời gian thực.</p>
                                </div>
                            </div>
                        )}

                        <button className="btn-primary" onClick={handleBook} style={{ width: "100%", marginTop: "1.5rem", fontSize: "1rem", padding: "1rem" }}>
                            {bookingStep < 2 ? "Tiếp Theo →" : "Xác Nhận Đặt Lịch ✓"}
                        </button>
                        {bookingStep > 0 && (
                            <button onClick={() => setBookingStep(s => s - 1)} style={{ width: "100%", marginTop: "0.6rem", background: "transparent", border: "none", color: "#7A7A9A", cursor: "pointer", fontSize: "0.85rem", padding: "0.5rem" }}>
                                ← Quay lại
                            </button>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "pulse 1s ease" }}>✅</div>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.8rem" }}>Đặt Lịch Thành Công!</h3>
                        <p style={{ fontSize: "0.9rem", color: "#7A7A9A", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                            Chúng tôi sẽ liên hệ xác nhận trong vòng <strong style={{ color: "#FF6B2B" }}>15 phút</strong>. Mã đặt lịch của bạn: <strong style={{ color: "#F0F0F8" }}>APG-2025-0847</strong>
                        </p>
                        <button className="btn-primary" style={{ padding: "0.7rem 1.5rem", fontSize: "0.85rem" }}>Theo Dõi Tiến Độ →</button>
                    </div>
                )}
            </div>
        </div>
    )
}