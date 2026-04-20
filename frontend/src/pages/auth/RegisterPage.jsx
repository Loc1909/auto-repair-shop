// src/pages/auth/RegisterPage.jsx
import { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Logo from "../../components/common/Logo";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import "../../styles/auth.css";
import "../../styles/global.css"

const C = {
  bg: "#0D0D14", bgCard: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.07)",
  orange: "#FF6B2B", orangeLight: "#FF8C5A",
  text: "#F0F0F8", textSub: "#A0A0B8", textMuted: "#5A5A7A",
  green: "#4ADAA0",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, showToast } = useOutletContext();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    password: "", confirm: "",
    plate: "", brand: "", model: "", year: ""
  });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const steps = ["Thông tin", "Xác thực OTP", "Thêm xe", "Hoàn tất"];

  const handleOtp = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const next = () => {
    if (step === 0) {
      if (!form.name || !form.phone || !form.password) {
        showToast("Vui lòng điền đầy đủ", "error"); return;
      }
      if (form.password !== form.confirm) {
        showToast("Mật khẩu không khớp", "error"); return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(1);
        showToast("Đã gửi OTP đến " + form.phone, "info");
      }, 1000);
    } else if (step === 1) {
      if (otp.join("").length < 6) {
        showToast("Nhập đủ 6 chữ số OTP", "error"); return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const finish = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        name: form.name,
        phone: form.phone,
        email: form.email,
        id: "KH" + Math.floor(Math.random() * 999)
      });
      showToast("Đăng ký thành công! Chào mừng đến AutoPro 🎉", "success");
      navigate("/dashboard"); // ← fix: dùng navigate thay vì setPage
    }, 1500);
  };

  return (
    <div style={{backgroundColor: "rgba(13,13,20,.92)", minHeight: "100vh", padding: "6rem 1rem 3rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 1, animation: "fadeUp .6s ease" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-1px", marginTop: "2rem", marginBottom: ".4rem" }}>
            Tạo Tài Khoản
          </h1>
          <p style={{ color: C.textSub, fontSize: ".88rem", fontWeight: 300 }}>
            {steps[step]} — Bước {step + 1}/{steps.length}
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: ".5rem", marginBottom: "2rem", justifyContent: "center" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".8rem", fontWeight: 700,
                background: i < step ? "linear-gradient(135deg,#FF6B2B,#FF3B00)" : i === step ? "rgba(255,107,43,.2)" : "rgba(255,255,255,.06)",
                border: i === step ? "1.5px solid rgba(255,107,43,.5)" : "1.5px solid transparent",
                color: i < step ? "#fff" : i === step ? C.orange : C.textMuted,
                transition: "all .4s"
              }}>
                {i < step ? "✓" : (i + 1)}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 30, height: 2, background: i < step ? "#FF6B2B" : "rgba(255,255,255,.08)", borderRadius: 1, transition: "background .4s" }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2.5rem", backdropFilter: "blur(20px)" }}>

          {/* Step 0: Thông tin */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="input-wrap" style={{ marginBottom: 0 }}>
                <label>Họ và tên</label>
                <input placeholder="Nguyễn Văn A" value={form.name} onChange={upd("name")} />
              </div>
              <div className="input-wrap" style={{ marginBottom: 0 }}>
                <label>Số điện thoại</label>
                <input placeholder="0901 234 567" value={form.phone} onChange={upd("phone")} />
              </div>
              <div className="input-wrap" style={{ marginBottom: 0 }}>
                <label>Email (tuỳ chọn)</label>
                <input placeholder="email@example.com" value={form.email} onChange={upd("email")} />
              </div>
              <div className="input-wrap" style={{ marginBottom: 0 }}>
                <label>Mật khẩu</label>
                <input type="password" placeholder="Tối thiểu 8 ký tự" value={form.password} onChange={upd("password")} />
              </div>
              <div className="input-wrap" style={{ marginBottom: 0 }}>
                <label>Xác nhận mật khẩu</label>
                <input type="password" placeholder="Nhập lại mật khẩu" value={form.confirm} onChange={upd("confirm")} />
              </div>
              <p style={{ fontSize: ".78rem", color: C.textMuted, lineHeight: 1.6 }}>
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <span style={{ color: C.orangeLight, cursor: "pointer" }}>Điều khoản sử dụng</span>
                {" "}và{" "}
                <span style={{ color: C.orangeLight, cursor: "pointer" }}>Chính sách bảo mật</span>.
              </p>
            </div>
          )}

          {/* Step 1: OTP */}
          {step === 1 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📱</div>
              <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".5rem" }}>
                Xác Thực Số Điện Thoại
              </h3>
              <p style={{ color: C.textSub, fontSize: ".85rem", marginBottom: "2rem", lineHeight: 1.7 }}>
                Nhập mã OTP 6 chữ số đã gửi đến<br />
                <strong style={{ color: C.text }}>{form.phone}</strong>
              </p>
              <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", marginBottom: "1.5rem" }}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    value={d}
                    onChange={e => handleOtp(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Backspace" && !d && i > 0)
                        otpRefs.current[i - 1]?.focus();
                    }}
                    style={{ width: 48, height: 54, textAlign: "center", fontSize: "1.3rem", fontWeight: 700, fontFamily: "'Kanit',sans-serif", borderRadius: 12, padding: 0 }}
                    maxLength={1}
                  />
                ))}
              </div>
              <p style={{ fontSize: ".82rem", color: C.textMuted }}>
                Không nhận được mã?{" "}
                <button style={{ background: "none", border: "none", color: C.orangeLight, cursor: "pointer", fontSize: ".82rem" }}>
                  Gửi lại (60s)
                </button>
              </p>
            </div>
          )}

          {/* Step 2: Thêm xe */}
          {step === 2 && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>🚗</div>
                <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".3rem" }}>
                  Thêm Xe Của Bạn
                </h3>
                <p style={{ color: C.textSub, fontSize: ".82rem" }}>Tuỳ chọn — có thể thêm sau</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="input-wrap" style={{ marginBottom: 0 }}>
                  <label>Biển số xe</label>
                  <input placeholder="VD: 51F-123.45" value={form.plate} onChange={upd("plate")} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="input-wrap" style={{ marginBottom: 0 }}>
                    <label>Hãng xe</label>
                    <select value={form.brand} onChange={upd("brand")}>
                      <option value="">Chọn hãng...</option>
                      {["Toyota","Honda","Mazda","Ford","Hyundai","Kia","Mitsubishi","Suzuki"].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-wrap" style={{ marginBottom: 0 }}>
                    <label>Năm sản xuất</label>
                    <select value={form.year} onChange={upd("year")}>
                      <option value="">Năm...</option>
                      {Array.from({ length: 15 }, (_, i) => 2025 - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="input-wrap" style={{ marginBottom: 0 }}>
                  <label>Model</label>
                  <input placeholder="VD: Fortuner 2.7V" value={form.model} onChange={upd("model")} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Hoàn tất */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
              <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.4rem", marginBottom: ".8rem" }}>
                Đăng Ký Thành Công!
              </h3>
              <p style={{ color: C.textSub, lineHeight: 1.8, fontSize: ".9rem", marginBottom: "2rem" }}>
                Tài khoản của <strong style={{ color: C.text }}>{form.name}</strong> đã được tạo.<br />
                Bắt đầu đặt lịch bảo dưỡng ngay hôm nay!
              </p>
              <div style={{ background: "rgba(74,218,160,.08)", border: "1px solid rgba(74,218,160,.2)", borderRadius: 14, padding: "1.2rem", marginBottom: "1.5rem", textAlign: "left" }}>
                {[
                  ["👤", "Tên", form.name],
                  ["📱", "SĐT", form.phone],
                  form.plate ? ["🚗", "Biển số", form.plate] : null
                ].filter(Boolean).map(([ic, lb, v]) => (
                  <div key={lb} style={{ display: "flex", justifyContent: "space-between", padding: ".3rem 0", fontSize: ".85rem" }}>
                    <span style={{ color: C.textSub }}>{ic} {lb}</span>
                    <span style={{ color: C.text, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn-p" onClick={finish} disabled={loading} style={{ width: "100%", padding: "1rem" }}>
                {loading ? "Đang xử lý..." : "Vào Trang Cá Nhân →"}
              </button>
            </div>
          )}

          {/* Next button (step 0–2) */}
          {step < 3 && (
            <button className="btn-p" onClick={next} disabled={loading}
              style={{ width: "100%", marginTop: "1.5rem", padding: "1rem" }}>
              {loading ? "Đang xử lý..." : step === 2 ? "Bỏ qua & Hoàn tất →" : "Tiếp Theo →"}
            </button>
          )}
        </div>

        {/* Footer link */}
        {step === 0 && (
          <p style={{ textAlign: "center", marginTop: "1.5rem", color: C.textMuted, fontSize: ".88rem" }}>
            Đã có tài khoản?{" "}
            <button onClick={() => navigate("/login")}
              style={{ background: "none", border: "none", color: C.orangeLight, cursor: "pointer", fontWeight: 500, fontSize: ".88rem" }}>
              Đăng nhập
            </button>
          </p>
        )}
      </div>
    </div>
  );
}