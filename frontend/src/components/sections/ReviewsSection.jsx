import { REVIEWS } from "../../constants/reviews";
export default function ReviewsSection() {
    return (
        <section style={{ padding: "7rem 5%", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ maxWidth: 1300, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <div className="section-tag">Đánh Giá</div>
                    <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px" }}>
                        Khách Hàng <span className="gradient-text">Nói Gì</span>
                    </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                    {REVIEWS.map((r, i) => (
                        <div key={r.name} className="review-card">
                            <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1.2rem" }}>
                                {[...Array(r.rating)].map((_, j) => <span key={j} style={{ color: "#FF6B2B", fontSize: "0.9rem" }}>★</span>)}
                            </div>
                            <p style={{ color: "#B0B0C8", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1.5rem", fontStyle: "italic", fontWeight: 300 }}>"{r.text}"</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${["#FF6B2B", "#6440FF", "#00C87A"][i]}, ${["#FF3B00", "#4020CC", "#008C55"][i]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700 }}>
                                    {r.name.charAt(0)}
                                </div>
                                <div>
                                    <p style={{ fontSize: "0.88rem", fontWeight: 500 }}>{r.name}</p>
                                    <p style={{ fontSize: "0.78rem", color: "#5A5A7A" }}>{r.car}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}