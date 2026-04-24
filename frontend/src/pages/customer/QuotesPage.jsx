// src/pages/customer/QuotesPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";

const QUOTES_DATA = [
  {
    id: "BG-2025-047",
    date: "18/04/2025",
    car: "Toyota Fortuner 51F-123.45",
    service: "Bảo dưỡng định kỳ 10.000km",
    status: "pending",
    items: [
      ["Dầu nhớt Shell 5W-30 4L", "320.000đ"],
      ["Lọc dầu Denso",           "85.000đ"],
      ["Lọc gió NGK",             "120.000đ"],
      ["Công thay dầu & lọc",     "150.000đ"],
    ],
    total: "675.000đ",
    note: "Kỹ thuật viên phát hiện cao su phớt dầu có dấu hiệu rỉ nhẹ, đề xuất thay để tránh rò rỉ sau này (90.000đ).",
  },
  {
    id: "BG-2025-031",
    date: "15/03/2025",
    car: "Toyota Fortuner 51F-123.45",
    service: "Thay 4 lốp Bridgestone",
    status: "approved",
    items: [
      ["Lốp Bridgestone x4", "980.000đ"],
      ["Công thay lốp",       "80.000đ"],
      ["Cân bằng động",       "140.000đ"],
    ],
    total: "1.200.000đ",
    note: null,
  },
];

const STATUS_CFG = {
  pending:  { label: "Chờ duyệt", color: C.amber, bg: C.amberDim },
  approved: { label: "Đã duyệt",  color: C.green, bg: C.greenDim },
  rejected: { label: "Từ chối",   color: C.red,   bg: C.redDim   },
};

export default function QuotesPage() {
  const navigate = useNavigate();
  const { showToast } = useOutletContext();

  const [activeQuote, setActiveQuote] = useState(null);

  const handleApprove = (id) => {
    showToast("Đã duyệt báo giá " + id + " ✓", "success");
    setActiveQuote(null);
    navigate("/payment");
  };

  const handleReject = (id) => {
    showToast("Đã từ chối báo giá " + id, "info");
    setActiveQuote(null);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <button className="btn-ghost" onClick={() => navigate("/dashboard")}>
          ← Quay lại
        </button>

          <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-1px" }}>
            Duyệt báo giá online
          </h1>

        {QUOTES_DATA.map((q, i) => (
          <div
            key={q.id}
            className="card"
            style={{ padding: "1.5rem", marginBottom: "1.2rem", cursor: "pointer", animation: `fadeUp .5s ease ${i * 0.1}s both` }}
            onClick={() => setActiveQuote(activeQuote?.id === q.id ? null : q)}
          >
            {/* Quote header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontSize: ".78rem", color: C.textMuted, marginBottom: ".3rem" }}>
                  {q.id} · {q.date}
                </p>
                <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: ".2rem" }}>
                  {q.service}
                </h3>
                <p style={{ fontSize: ".82rem", color: C.textSub }}>{q.car}</p>
              </div>
              <span
                className="status-badge"
                style={{ background: STATUS_CFG[q.status].bg, color: STATUS_CFG[q.status].color }}
              >
                {STATUS_CFG[q.status].label}
              </span>
            </div>

            {/* Quote summary */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: ".82rem", color: C.textMuted }}>{q.items.length} hạng mục</span>
              <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, color: C.orange, fontSize: "1rem" }}>
                {q.total}
              </span>
            </div>

            {/* Expanded detail */}
            {activeQuote?.id === q.id && (
              <div
                style={{ marginTop: "1.2rem", borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: "1.2rem", animation: "fadeIn .3s ease" }}
                onClick={e => e.stopPropagation()}
              >
                {/* Line items */}
                {q.items.map(([name, price]) => (
                  <div
                    key={name}
                    style={{ display: "flex", justifyContent: "space-between", padding: ".4rem 0", fontSize: ".85rem", borderBottom: "1px solid rgba(255,255,255,.04)" }}
                  >
                    <span style={{ color: C.textSub }}>{name}</span>
                    <span>{price}</span>
                  </div>
                ))}

                {/* KTV note */}
                {q.note && (
                  <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(255,184,77,.08)", border: "1px solid rgba(255,184,77,.15)", borderRadius: 12, fontSize: ".82rem", color: C.textSub, lineHeight: 1.7 }}>
                    <strong style={{ color: C.amber }}>💡 Đề xuất thêm từ KTV:</strong>
                    <br />
                    {q.note}
                  </div>
                )}

                {/* Action buttons — only for pending */}
                {q.status === "pending" && (
                  <div style={{ display: "flex", gap: ".8rem", marginTop: "1.2rem" }}>
                    <button
                      className="btn-o"
                      onClick={() => handleReject(q.id)}
                      style={{ flex: 1, padding: ".8rem", color: C.red, borderColor: "rgba(255,91,107,.3)" }}
                    >
                      ✕ Từ chối
                    </button>
                    <button
                      className="btn-p"
                      onClick={() => handleApprove(q.id)}
                      style={{ flex: 2, padding: ".8rem" }}
                    >
                      ✓ Duyệt & Thanh Toán
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}