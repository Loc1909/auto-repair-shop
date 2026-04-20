import { useState } from "react";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import "../../styles/customer.css";

export default function ReviewPage({ showToast }) {
  const [ratings, setRatings] = useState({ overall: 0, quality: 0, speed: 0, price: 0, attitude: 0 });
  const [hover, setHover] = useState({});
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const labels = { overall: "Đánh giá chung", quality: "Chất lượng sửa chữa", speed: "Tốc độ xử lý", price: "Giá cả hợp lý", attitude: "Thái độ nhân viên" };
  const handleSubmit = () => {
    if (!ratings.overall) { showToast("Vui lòng đánh giá tổng thể", "error"); return; }
    setSubmitted(true);
    showToast("Cảm ơn bạn đã đánh giá! 🙏", "success");
  };

  const QUICK = ["Dịch vụ tuyệt vời!", "Kỹ thuật viên chuyên nghiệp", "Giao xe đúng hẹn", "Giá cả hợp lý", "Sẽ quay lại lần sau", "Báo giá rõ ràng, minh bạch"];

  if (submitted) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <BackgroundOrbs />
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center", zIndex: 1, animation: "scaleIn .5s ease" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1.2rem" }}>🙏</div>
        <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-1px", marginBottom: "1rem" }}>Cảm Ơn Bạn!</h2>
        <p style={{ color: C.textSub, lineHeight: 1.8, marginBottom: "2rem" }}>Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn mỗi ngày.</p>
        <div style={{ display: "flex", gap: ".8rem", justifyContent: "center" }}>
          <button className="btn-p" onClick={() => setPage("booking")} style={{ padding: ".85rem 1.8rem" }}>Đặt Lịch Tiếp →</button>
          <button className="btn-o" onClick={() => setPage("dashboard")} style={{ padding: ".85rem 1.8rem" }}>Về Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <button className="btn-ghost" onClick={() => navigate("/dashboard")}>← Quay lại</button>
          <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-1px" }}>Đánh Giá Dịch Vụ</h1>

        {/* Service info */}
        <div style={{ background: "linear-gradient(135deg,rgba(255,107,43,.07),rgba(255,184,77,.03))", border: "1px solid rgba(255,107,43,.15)", borderRadius: 20, padding: "1.3rem", marginBottom: "1.5rem", animation: "fadeUp .5s ease" }}>
          <p style={{ fontSize: ".78rem", color: C.textMuted, marginBottom: ".3rem" }}>APG-812 · 15/03/2025</p>
          <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: ".2rem" }}>Thay 4 lốp Bridgestone</h3>
          <p style={{ fontSize: ".82rem", color: C.textSub }}>Toyota Fortuner · KTV: Quang Vinh</p>
        </div>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2.5rem", animation: "fadeUp .5s ease .1s both" }}>
          {/* Star ratings */}
          {Object.entries(ratings).map(([key, val]) => (
            <div key={key} style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".6rem" }}>
                <label style={{ fontSize: ".85rem", fontWeight: 500, color: key === "overall" ? C.text : C.textSub }}>{labels[key]}</label>
                {val > 0 && <span style={{ fontSize: ".78rem", color: C.orange, fontWeight: 600 }}>{["", "Tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Xuất sắc"][val]}</span>}
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRatings(r => ({ ...r, [key]: n }))}
                    onMouseEnter={() => setHover(h => ({ ...h, [key]: n }))}
                    onMouseLeave={() => setHover(h => ({ ...h, [key]: 0 }))}
                    style={{ fontSize: key === "overall" ? "2.2rem" : "1.5rem", background: "none", border: "none", cursor: "pointer", transition: "transform .2s", transform: (hover[key] || val) >= n ? "scale(1.15)" : "scale(1)", color: (hover[key] || val) >= n ? C.orange : "#2A2A3A", lineHeight: 1 }}>★</button>
                ))}
              </div>
            </div>
          ))}

          {/* Quick tags */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: ".78rem", color: "#7A7A9A", marginBottom: ".7rem", fontWeight: 500, letterSpacing: ".3px", textTransform: "uppercase" }}>Chọn nhanh</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
              {QUICK.map(t => (
                <button key={t} onClick={() => setComment(c => c ? c + ", " + t : t)} style={{ padding: ".4rem .9rem", border: `1px solid ${C.border}`, borderRadius: 50, background: "transparent", color: C.textSub, fontSize: ".8rem", cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}>+ {t}</button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="input-wrap" style={{ marginBottom: "1.5rem" }}>
            <label>Nhận xét chi tiết (tuỳ chọn)</label>
            <textarea placeholder="Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện hơn..." value={comment} onChange={e => setComment(e.target.value)} />
          </div>

          {/* Photo upload */}
          <div style={{ marginBottom: "1.5rem", padding: "1.2rem", border: `2px dashed ${C.border}`, borderRadius: 14, textAlign: "center", cursor: "pointer", transition: "all .3s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,107,43,.4)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <p style={{ fontSize: "1.5rem", marginBottom: ".4rem" }}>📸</p>
            <p style={{ fontSize: ".85rem", color: C.textMuted }}>Thêm ảnh (tuỳ chọn)</p>
          </div>

          <button className="btn-p" onClick={handleSubmit} style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}>Gửi Đánh Giá ✓</button>
        </div>
      </div>
    </div>
  );
}