// src/pages/customer/BookingPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";

const SERVICES_LIST = [
  "Bảo dưỡng định kỳ",
  "Thay dầu máy",
  "Thay lốp",
  "Sửa điện",
  "Điều hòa xe",
  "Phanh ABS",
  "Chẩn đoán OBD",
  "Sửa động cơ",
  "Khác",
];

const TIMES = [
  "07:00–09:00",
  "09:00–11:00",
  "11:00–13:00",
  "13:00–15:00",
  "15:00–17:00",
  "17:00–19:00",
];

const STEP_LABELS = ["Chọn dịch vụ", "Chọn thời gian", "Xác nhận"];

export default function BookingPage() {
  const navigate = useNavigate();
  const { showToast } = useOutletContext();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ car: "", service: "", date: "", time: "", note: "" });
  const [submitted, setSubmitted] = useState(false);

  const upd = k => v => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.car && form.service;
    if (step === 1) return form.date && form.time;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    showToast("Đặt lịch thành công! Mã APG-" + Math.floor(Math.random() * 999 + 100), "success");
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center", zIndex: 1, animation: "scaleIn .5s ease" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1.2rem" }}>✅</div>
        <h2 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-1px", marginBottom: "1rem" }}>
          Đặt Lịch Thành Công!
        </h2>
        <p style={{ color: C.textSub, lineHeight: 1.8, marginBottom: "1.5rem" }}>
          Chúng tôi sẽ liên hệ xác nhận trong{" "}
          <strong style={{ color: C.orange }}>15 phút</strong>.<br />
          Bạn có thể theo dõi tiến độ xe trên app.
        </p>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
          {[
            ["🚗", "Xe", form.car],
            ["🔧", "Dịch vụ", form.service],
            ["📅", "Ngày", form.date],
            ["🕐", "Giờ", form.time],
          ].map(([ic, lb, v]) => (
            <div
              key={lb}
              style={{ display: "flex", justifyContent: "space-between", padding: ".35rem 0", fontSize: ".87rem", borderBottom: "1px solid rgba(255,255,255,.05)" }}
            >
              <span style={{ color: C.textMuted }}>{ic} {lb}</span>
              <span style={{ fontWeight: 500 }}>{v || "—"}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: ".8rem", justifyContent: "center" }}>
          <button className="btn-p" onClick={() => navigate("/tracking")} style={{ padding: ".85rem 1.8rem" }}>
            Theo Dõi Tiến Độ →
          </button>
          <button className="btn-o" onClick={() => navigate("/dashboard")} style={{ padding: ".85rem 1.8rem" }}>
            Về Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <button className="btn-ghost" onClick={() => navigate("/dashboard")}>
          ← Quay lại
        </button>
        <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-1px" }}>
          Đặt Lịch Bảo Dưỡng
        </h1>
        {/* Step progress */}
        <div style={{ display: "flex", gap: ".4rem", marginBottom: "2.5rem" }}>
          {STEP_LABELS.map((s, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".4rem" }}>
              <div style={{
                height: 3, borderRadius: 2,
                background: i <= step
                  ? "linear-gradient(90deg,#FF6B2B,#FFB84D)"
                  : "rgba(255,255,255,.08)",
                transition: "background .4s",
              }} />
              <span style={{ fontSize: ".72rem", color: i === step ? C.orange : C.textMuted }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2.5rem", animation: "fadeUp .5s ease" }}>

          {/* Step 0 — Chọn dịch vụ */}
          {step === 0 && (
            <div>
              <div className="input-wrap">
                <label>Xe của bạn</label>
                <select value={form.car} onChange={e => upd("car")(e.target.value)}>
                  <option value="">Chọn xe...</option>
                  <option value="Toyota Fortuner — 51F-123.45">Toyota Fortuner — 51F-123.45</option>
                  <option value="+ Thêm xe mới">+ Thêm xe mới</option>
                </select>
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ display: "block", fontSize: ".78rem", color: "#7A7A9A", marginBottom: ".45rem", fontWeight: 500, letterSpacing: ".3px", textTransform: "uppercase" }}>
                  Dịch vụ cần
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".6rem" }}>
                  {SERVICES_LIST.map(s => (
                    <button
                      key={s}
                      onClick={() => upd("service")(s)}
                      style={{
                        padding: ".65rem .8rem",
                        border: `1.5px solid ${form.service === s ? "rgba(255,107,43,.5)" : C.border}`,
                        borderRadius: 10,
                        background: form.service === s ? "rgba(255,107,43,.1)" : C.bgCard2,
                        color: form.service === s ? C.orange : C.textSub,
                        fontSize: ".8rem",
                        cursor: "pointer",
                        transition: "all .25s",
                        textAlign: "left",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-wrap" style={{ marginBottom: 0 }}>
                <label>Mô tả thêm (tuỳ chọn)</label>
                <textarea
                  placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
                  value={form.note}
                  onChange={e => upd("note")(e.target.value)}
                  style={{ minHeight: 80 }}
                />
              </div>
            </div>
          )}

          {/* Step 1 — Chọn thời gian */}
          {step === 1 && (
            <div>
              <div className="input-wrap">
                <label>Ngày mong muốn</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => upd("date")(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: ".78rem", color: "#7A7A9A", marginBottom: ".45rem", fontWeight: 500, letterSpacing: ".3px", textTransform: "uppercase" }}>
                  Khung giờ
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: ".7rem" }}>
                  {TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => upd("time")(t)}
                      style={{
                        padding: ".8rem",
                        border: `1.5px solid ${form.time === t ? "rgba(255,107,43,.5)" : C.border}`,
                        borderRadius: 12,
                        background: form.time === t ? "rgba(255,107,43,.1)" : C.bgCard2,
                        color: form.time === t ? C.orange : C.textSub,
                        fontSize: ".88rem",
                        cursor: "pointer",
                        transition: "all .25s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem",
                      }}
                    >
                      🕐 {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", padding: "1.2rem", background: "rgba(74,218,160,.06)", border: "1px solid rgba(74,218,160,.15)", borderRadius: 14 }}>
                <p style={{ fontSize: ".82rem", color: C.textMuted, lineHeight: 1.7 }}>
                  <strong style={{ color: C.green }}>✓ Chính sách đặt lịch:</strong>{" "}
                  Bạn có thể hủy hoặc đổi lịch miễn phí trước{" "}
                  <strong style={{ color: C.text }}>2 giờ</strong> so với giờ hẹn.
                </p>
              </div>
            </div>
          )}

          {/* Step 2 — Xác nhận */}
          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                Xác Nhận Thông Tin
              </h3>

              {[
                ["🚗", "Xe", form.car],
                ["🔧", "Dịch vụ", form.service],
                ["📅", "Ngày", form.date],
                ["🕐", "Giờ", form.time],
                ["📝", "Ghi chú", form.note || "Không có"],
              ].map(([ic, lb, v]) => (
                <div
                  key={lb}
                  style={{ display: "flex", justifyContent: "space-between", padding: ".7rem 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: ".88rem" }}
                >
                  <span style={{ color: C.textMuted }}>{ic} {lb}</span>
                  <span style={{ fontWeight: 500, color: C.text, maxWidth: "60%", textAlign: "right" }}>{v || "—"}</span>
                </div>
              ))}

              <div style={{ marginTop: "1.5rem", padding: "1.2rem", background: C.orangeDim, border: "1px solid rgba(255,107,43,.2)", borderRadius: 14 }}>
                <p style={{ fontSize: ".82rem", color: C.textSub, lineHeight: 1.7 }}>
                  Sau khi xác nhận, nhân viên sẽ liên hệ báo giá trước. Không có chi phí nào phát sinh ngoài báo giá đã duyệt.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: ".8rem", marginTop: "2rem" }}>
            {step > 0 && (
              <button
                className="btn-o"
                onClick={() => setStep(s => s - 1)}
                style={{ flex: 1, padding: ".9rem" }}
              >
                ← Quay lại
              </button>
            )}
            <button
              className="btn-p"
              onClick={
                step < 2
                  ? () => {
                    if (!canNext()) { showToast("Vui lòng điền đầy đủ", "error"); return; }
                    setStep(s => s + 1);
                  }
                  : handleSubmit
              }
              style={{ flex: 2, padding: ".9rem" }}
            >
              {step < 2 ? "Tiếp Theo →" : "Xác Nhận Đặt Lịch ✓"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}