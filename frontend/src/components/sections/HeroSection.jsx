import BookingWidget from "../booking/BookingWidget";

import { FaCar } from "react-icons/fa";

export default function HeroSection({ heroVisible }) {
    return (
        <section style={{
            minHeight: "100vh", display: "flex", alignItems: "center",
            padding: "8rem 5% 4rem",
            position: "relative", overflow: "hidden",
        }}>
            {/* BG effects */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "10%", right: "5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(255,107,43,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
                <div style={{ position: "absolute", bottom: "0%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(100,60,255,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
                <svg className="floating-gear" style={{ width: 300, top: "5%", right: "15%", animationDuration: "30s" }} viewBox="0 0 100 100">
                    <path fill="white" d="M43.3,5h13.4l2.5,9.8c2.5,1,4.9,2.3,7.1,3.9l9.6-2.9l9.5,9.5l-2.9,9.6c1.6,2.2,2.9,4.6,3.9,7.1l9.8,2.5v13.4l-9.8,2.5c-1,2.5-2.3,4.9-3.9,7.1l2.9,9.6l-9.5,9.5l-9.6-2.9c-2.2,1.6-4.6,2.9-7.1,3.9L56.7,95H43.3l-2.5-9.8c-2.5-1-4.9-2.3-7.1-3.9l-9.6,2.9l-9.5-9.5l2.9-9.6c-1.6-2.2-2.9-4.6-3.9-7.1L4,55.5V42.1l9.8-2.5c1-2.5,2.3-4.9,3.9-7.1l-2.9-9.6l9.5-9.5l9.6,2.9c2.2-1.6,4.6-2.9,7.1-3.9L43.3,5z M50,33c-9.4,0-17,7.6-17,17s7.6,17,17,17s17-7.6,17-17S59.4,33,50,33z" />
                </svg>
                <svg className="floating-gear" style={{ width: 180, bottom: "15%", left: "5%", animationDuration: "20s", animationDirection: "reverse" }} viewBox="0 0 100 100">
                    <path fill="white" d="M43.3,5h13.4l2.5,9.8c2.5,1,4.9,2.3,7.1,3.9l9.6-2.9l9.5,9.5l-2.9,9.6c1.6,2.2,2.9,4.6,3.9,7.1l9.8,2.5v13.4l-9.8,2.5c-1,2.5-2.3,4.9-3.9,7.1l2.9,9.6l-9.5,9.5l-9.6-2.9c-2.2,1.6-4.6,2.9-7.1,3.9L56.7,95H43.3l-2.5-9.8c-2.5-1-4.9-2.3-7.1-3.9l-9.6,2.9l-9.5-9.5l2.9-9.6c-1.6-2.2-2.9-4.6-3.9-7.1L4,55.5V42.1l9.8-2.5c1-2.5,2.3-4.9,3.9-7.1l-2.9-9.6l9.5-9.5l9.6,2.9c2.2-1.6,4.6-2.9,7.1-3.9L43.3,5z M50,33c-9.4,0-17,7.6-17,17s7.6,17,17,17s17-7.6,17-17S59.4,33,50,33z" />
                </svg>
            </div>

            <div style={{ maxWidth: 1300, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                {/* LEFT */}
                <div style={{ animation: heroVisible ? "fadeUp 0.8s ease both" : "none" }}>
                    <div
                        className="section-tag"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: ".5rem"
                        }}
                    >
                        <FaCar size={16} />
                        <span>Garage Thông Minh Số 1 HCM</span>
                    </div>
                    <h1
                        style={{
                            fontFamily: "'Kanit', sans-serif",
                            fontSize: "clamp(2.5rem, 5vw, 4rem)",
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: "-0.5px",
                            marginBottom: "1.5rem"
                        }}
                    >
                        <span className="gradient-text-white" style={{ display: "block" }}>
                            Sửa Xe Minh Bạch
                        </span>

                        <span className="gradient-text">
                            Theo Dõi <span style={{ whiteSpace: "nowrap" }}>Real-Time</span>
                        </span>
                    </h1>
                    <p style={{ fontSize: "1.05rem", color: "#A0A0B8", lineHeight: 1.8, maxWidth: 480, marginBottom: "2.5rem", fontWeight: 300 }}>
                        Không còn lo lắng khi đưa xe đi sửa. Đặt lịch, duyệt báo giá, theo dõi tiến độ và thanh toán — tất cả trên điện thoại của bạn.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
                        <button className="btn-primary" style={{ fontSize: "1rem", padding: "1rem 2.2rem" }}>Đặt Lịch Ngay →</button>
                        <button className="btn-outline" style={{ fontSize: "1rem", padding: "1rem 2.2rem" }}>Xem Tiến Độ Xe</button>
                    </div>
                    <div style={{ display: "flex", gap: "2rem" }}>
                        {[["✓ Báo giá trước khi sửa"], ["✓ Theo dõi live"], ["✓ Bảo hành rõ ràng"]].map(([t]) => (
                            <span key={t} style={{ fontSize: "0.85rem", color: "#7A7A9A", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <span style={{ color: "#FF6B2B" }}>{t.slice(0, 1)}</span>{t.slice(1)}
                            </span>
                        ))}
                    </div>
                </div>

                {/* RIGHT - Booking Widget */}
                <BookingWidget heroVisible={heroVisible} />
            </div>
        </section>
    )
}