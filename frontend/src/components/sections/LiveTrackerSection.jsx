export default function LiveTrackerSection() {
    return(
        <section style={{ padding: "7rem 5%" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="section-tag">Live Demo</div>
              <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px" }}>
                Giao Diện Theo Dõi <span className="gradient-text">Tiến Độ</span>
              </h2>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24, overflow: "hidden", maxWidth: 800, margin: "0 auto",
            }}>
              {/* Top bar */}
              <div style={{ background: "rgba(255,107,43,0.1)", borderBottom: "1px solid rgba(255,107,43,0.15)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#FF8C5A", marginBottom: "0.15rem" }}>Mã tiếp nhận APG-2025-0847</p>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem" }}>Toyota Fortuner — 51F-123.45</h4>
                </div>
                <div style={{ background: "rgba(0,200,100,0.15)", border: "1px solid rgba(0,200,100,0.3)", borderRadius: "50px", padding: "0.3rem 0.8rem", fontSize: "0.75rem", color: "#4ADAA0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADAA0", animation: "pulse 1.5s infinite" }} />
                  Đang sửa chữa
                </div>
              </div>
              {/* Progress track */}
              <div style={{ padding: "2rem 1.5rem" }}>
                {[
                  { label: "Tiếp nhận xe", time: "08:30", done: true },
                  { label: "Chẩn đoán & báo giá", time: "09:15", done: true },
                  { label: "Khách duyệt báo giá", time: "09:40", done: true },
                  { label: "Thay lọc dầu, lọc gió", time: "10:20", done: true },
                  { label: "Kiểm tra hệ thống phanh", time: "Đang thực hiện...", done: false, active: true },
                  { label: "Kiểm tra tổng thể & vệ sinh xe", time: "Chờ xử lý", done: false },
                  { label: "Bàn giao xe", time: "Dự kiến 14:00", done: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.6rem 0", borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{
                      width: 24, height: 24, minWidth: 24, borderRadius: "50%",
                      background: item.done ? "linear-gradient(135deg, #FF6B2B, #FF3B00)" : item.active ? "rgba(255,107,43,0.15)" : "rgba(255,255,255,0.06)",
                      border: item.active ? "1.5px solid rgba(255,107,43,0.5)" : "1.5px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem",
                    }}>
                      {item.done ? "✓" : item.active ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B2B", animation: "pulse 1s infinite" }} /> : ""}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.88rem", color: item.done ? "#F0F0F8" : item.active ? "#FFB84D" : "#5A5A7A", fontWeight: item.active ? 500 : 400 }}>{item.label}</p>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: item.done ? "#4ADAA0" : item.active ? "#FF8C5A" : "#3A3A5A", fontWeight: item.active ? 500 : 400 }}>{item.time}</span>
                  </div>
                ))}
              </div>
              {/* Bill preview */}
              <div style={{ margin: "0 1.5rem 1.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "1.2rem" }}>
                <p style={{ fontSize: "0.78rem", color: "#7A7A9A", marginBottom: "0.8rem" }}>Báo giá đã duyệt</p>
                {[["Thay dầu máy 5W-30", "320.000đ"], ["Lọc dầu", "85.000đ"], ["Lọc gió", "120.000đ"], ["Công thay", "150.000đ"]].map(([n, p]) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", fontSize: "0.83rem" }}>
                    <span style={{ color: "#A0A0B8" }}>{n}</span>
                    <span>{p}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "0.6rem", paddingTop: "0.6rem", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Tổng cộng</span>
                  <span style={{ color: "#FF6B2B", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>675.000đ</span>
                </div>
              </div>
            </div>
          </div>
        </section>
    )
}