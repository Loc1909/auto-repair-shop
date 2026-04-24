export default function CTASection() {
    return (
        <section style={{ padding: "7rem 5%" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                <div style={{
                    background: "linear-gradient(135deg, rgba(255,107,43,0.12) 0%, rgba(100,60,255,0.08) 100%)",
                    border: "1px solid rgba(255,107,43,0.2)", borderRadius: 32, padding: "5rem 3rem",
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(255,107,43,0.06) 0%, transparent 70%)" }} />
                    <div className="section-tag" style={{ position: "relative" }}>Bắt Đầu Ngay</div>
                    <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "1.2rem", position: "relative" }}>
                        Xe Của Bạn Xứng Đáng<br /><span className="gradient-text">Được Chăm Sóc Tốt Nhất</span>
                    </h2>
                    <p style={{ color: "#7A7A9A", fontSize: "1rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 500, margin: "0 auto 2.5rem", fontWeight: 300, position: "relative" }}>
                        Đăng ký tài khoản miễn phí, nhận ngay <strong style={{ color: "#FF8C5A" }}>ưu đãi 20%</strong> cho lần bảo dưỡng đầu tiên.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", position: "relative" }}>
                        <button className="btn-primary" style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}>Đặt Lịch Miễn Phí →</button>
                        <button className="btn-outline" style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}>Gọi: 1800 6789</button>
                    </div>
                </div>
            </div>
        </section>
    )
}