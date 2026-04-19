import { STEPS } from "../../constants/steps";

export default function ProcessSection(){
    return (
        <section style={{ padding: "7rem 5%", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
            <div>
              <div className="section-tag">Quy Trình</div>
              <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "1.2rem" }}>
                Minh Bạch Từng<br /><span className="gradient-text">Bước Một</span>
              </h2>
              <p style={{ color: "#7A7A9A", lineHeight: 1.8, maxWidth: 400, fontWeight: 300, marginBottom: "2rem" }}>
                Chúng tôi loại bỏ mọi lo lắng khi sửa xe với quy trình rõ ràng, có thể theo dõi online.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ background: "rgba(255,107,43,0.1)", border: "1px solid rgba(255,107,43,0.2)", borderRadius: 16, padding: "1.2rem 1.5rem", flex: 1 }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>📱</div>
                  <p style={{ fontSize: "0.82rem", color: "#A0A0B8", lineHeight: 1.6 }}>Thông báo SMS/App tự động mỗi khi có cập nhật tiến độ</p>
                </div>
                <div style={{ background: "rgba(100,60,255,0.08)", border: "1px solid rgba(100,60,255,0.15)", borderRadius: 16, padding: "1.2rem 1.5rem", flex: 1 }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>🔒</div>
                  <p style={{ fontSize: "0.82rem", color: "#A0A0B8", lineHeight: 1.6 }}>Không bao giờ sửa khi chưa được khách duyệt báo giá</p>
                </div>
              </div>
            </div>
            <div>
              {STEPS.map((step, i) => (
                <div key={step.n} style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", position: "relative" }}>
                  {i < STEPS.length - 1 && <div className="step-line" />}
                  <div style={{
                    width: 56, height: 56, minWidth: 56, borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF6B2B22, #FF3B0011)",
                    border: "1.5px solid rgba(255,107,43,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#FF6B2B", fontSize: "0.85rem",
                    position: "relative", zIndex: 1,
                  }}>
                    {step.n}
                  </div>
                  <div style={{ paddingTop: "0.8rem" }}>
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem" }}>{step.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#7A7A9A", lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    )
}