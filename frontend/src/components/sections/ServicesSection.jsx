import React from "react";
import { SERVICES } from "../../constants/services";
export default function ServicesSection() {
    return (
        <section style={{ padding: "7rem 5%" }}>
            <div style={{ maxWidth: 1300, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <div className="section-tag">Dịch Vụ</div>
                    <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "1rem" }}>
                        Đầy Đủ Dịch Vụ<br /><span className="gradient-text">Cho Mọi Loại Xe</span>
                    </h2>
                    <p style={{ color: "#7A7A9A", maxWidth: 500, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
                        Từ bảo dưỡng định kỳ đến sửa chữa phức tạp — đội ngũ kỹ thuật viên chuyên nghiệp với trang thiết bị hiện đại
                    </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                    {SERVICES.map((s, i) => {
                        const Icon = s.icon;

                        return (
                            <div
                                key={s.title}
                                className="service-card"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div
                                    style={{
                                        
                                        width: 52,
                                        height: 52,
                                        borderRadius: 14,
                                        background: s.color + "15",
                                        border: `1px solid ${s.accent}20`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "1.2rem",
                                    }}
                                >
                                    {/* FIX ICON */}
                                    <Icon size={22} style={{ color: s.accent }} />
                                </div>

                                <h3
                                    style={{
                                        fontFamily: "'Kanit', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        marginBottom: "0.6rem",
                                        letterSpacing: "-0.3px"
                                    }}
                                >
                                    {s.title}
                                </h3>

                                <p
                                    style={{
                                        color: "#7A7A9A",
                                        fontSize: "0.88rem",
                                        lineHeight: 1.7,
                                        marginBottom: "1.2rem",
                                        fontWeight: 300
                                    }}
                                >
                                    {s.desc}
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <span style={{ color: "#FF6B2B", fontSize: "0.9rem", fontWeight: 600 }}>
                                        {s.price}
                                    </span>

                                    <span
                                        style={{
                                            fontSize: "0.8rem",
                                            color: "#5A5A7A",
                                            transition: "color 0.3s"
                                        }}
                                    >
                                        Xem chi tiết →
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}