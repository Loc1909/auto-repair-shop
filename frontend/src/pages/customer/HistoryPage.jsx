// src/pages/customer/HistoryPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";

const RECORDS = [
  { id: "APG-847", date: "20/04/2025", service: "Bảo dưỡng định kỳ 10.000km", status: "inprogress", km: 87450, price: "675.000đ", tech: "Minh Hùng", rating: null },
  { id: "APG-812", date: "15/03/2025", service: "Thay 4 lốp Bridgestone", status: "done", km: 85200, price: "1.200.000đ", tech: "Quang Vinh", rating: 5 },
  { id: "APG-768", date: "10/01/2025", service: "Sửa điều hòa", status: "done", km: 80100, price: "550.000đ", tech: "Thành Long", rating: 4 },
  { id: "APG-701", date: "25/10/2024", service: "Bảo dưỡng 5.000km", status: "done", km: 75000, price: "420.000đ", tech: "Minh Hùng", rating: 5 },
  { id: "APG-654", date: "08/08/2024", service: "Thay má phanh", status: "done", km: 70200, price: "320.000đ", tech: "Quang Vinh", rating: 5 },
];

const STATUS_CFG = {
  inprogress: { label: "Đang sửa", color: C.amber, bg: C.amberDim },
  done: { label: "Hoàn thành", color: C.green, bg: C.greenDim },
};

const FILTERS = [
  ["all", "Tất cả"],
  ["inprogress", "Đang sửa"],
  ["done", "Hoàn thành"],
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? RECORDS : RECORDS.filter(r => r.status === filter);

  return (
    <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <button className="btn-ghost" onClick={() => navigate("/dashboard")}>
          ← Quay lại
        </button>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-1px" }}>
            Hồ sơ lịch sử xe
          </h1>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: ".4rem", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 50, padding: ".3rem" }}>
            {FILTERS.map(([v, l]) => (
              <button
                key={v}
                className={`tab-btn${filter === v ? " active" : ""}`}
                onClick={() => setFilter(v)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {filtered.map((r, i) => (
            <div
              key={r.id}
              style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", animation: `fadeUp .5s ease ${i * 0.08}s both` }}
            >
              {/* Timeline dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 16 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: r.status === "done" ? C.orange : "rgba(255,184,77,.6)",
                  border: "2px solid rgba(255,107,43,.3)",
                  flexShrink: 0,
                }} />
                {i < filtered.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: "rgba(255,107,43,.1)", margin: ".3rem 0" }} />
                )}
              </div>

              {/* Card */}
              <div className="card" style={{ flex: 1, padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".8rem", flexWrap: "wrap", gap: ".5rem" }}>
                  <div>
                    <p style={{ fontSize: ".75rem", color: C.textMuted, marginBottom: ".2rem" }}>
                      {r.date} · {r.id}
                    </p>
                    <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1rem" }}>
                      {r.service}
                    </h3>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: STATUS_CFG[r.status].bg, color: STATUS_CFG[r.status].color, height: "fit-content" }}
                  >
                    {STATUS_CFG[r.status].label}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "1.5rem", fontSize: ".82rem", color: C.textSub, marginBottom: "1rem", flexWrap: "wrap" }}>
                  <span>🔧 KTV: {r.tech}</span>
                  <span>📊 Số km: {r.km.toLocaleString()} km</span>
                  <span style={{ color: C.orange, fontWeight: 600 }}>💰 {r.price}</span>
                </div>

                {/* Rating stars */}
                {r.rating && (
                  <div style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                    {[...Array(5)].map((_, j) => (
                      <span key={j} style={{ color: j < r.rating ? C.orange : "#3A3A5A", fontSize: ".9rem" }}>★</span>
                    ))}
                  </div>
                )}

                {/* Rate button */}
                {r.status === "done" && !r.rating && (
                  <button
                    onClick={() => navigate("/review")}
                    style={{
                      background: "none",
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: ".4rem .8rem",
                      color: C.textSub,
                      fontSize: ".78rem",
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
                  >
                    ⭐ Đánh giá dịch vụ này
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}