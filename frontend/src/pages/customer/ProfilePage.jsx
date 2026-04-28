// src/pages/customer/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";
import { getCurrentCustomerInfo } from "../../api/customerApi";

const FIELDS = [
  ["name", "👤", "Họ và tên", "Nguyễn Văn A"],
  ["phone", "📱", "Số điện thoại", "0901 234 567"],
  ["email", "📧", "Email", "email@example.com"],
  ["address", "📍", "Địa chỉ", "123 Đường ABC"],
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, showToast } = useOutletContext();
  const [customerData, setCustomerData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: customerData?.name || "",
    phone: customerData?.phone || "",
    email: user?.email || "",
    address: customerData?.address || "",
  });

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = () => {
    setEditing(false);
    showToast("Cập nhật thông tin thành công ✓", "success");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCurrentCustomerInfo();
        setCustomerData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setForm({
      name: customerData?.name || "",
      phone: customerData?.phone || "",
      email: user?.email || "",
      address: customerData?.address || "",
    });
  }, [customerData]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
        <BackgroundOrbs />
        Chưa đăng nhập!
      </div>
    );
  }
  if (!customerData) {
    return (
      <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
        <BackgroundOrbs />
        Đang tải...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <button className="btn-ghost" onClick={() => navigate("/dashboard")} style={{ marginBottom: "1.5rem" }}>
          ← Quay lại
        </button>

        <div style={{ marginBottom: "2rem" }}>
          <div className="tag" style={{ marginBottom: ".7rem" }}>Hồ Sơ</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-1px" }}>
            Thông Tin <span className="grad-text">Cá Nhân</span>
          </h1>
        </div>

        {/* Avatar card */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", animation: "fadeUp .5s ease" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 70, height: 70, borderRadius: "50%",
              background: "linear-gradient(135deg,#FF6B2B,#FF3B00)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.8rem", fontWeight: 800, fontFamily: "'Syne',sans-serif",
            }}>
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: 22, height: 22, borderRadius: "50%",
              background: "#1A1A2E",
              border: `2px solid ${C.bg}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: ".7rem",
            }}>
              📷
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".2rem" }}>
              {form.name}
            </h3>
            <p style={{ fontSize: ".82rem", color: C.textSub }}>
              Khách hàng AutoPro · ID: {user?.id}
            </p>
            <p style={{ fontSize: ".78rem", color: C.textMuted, marginTop: ".3rem" }}>
              Thành viên từ Tháng 1/2024
            </p>
          </div>

          <button
            onClick={() => editing ? save() : setEditing(true)}
            className={editing ? "btn-p" : "btn-o"}
            style={{ marginLeft: "auto", padding: ".6rem 1.3rem", fontSize: ".85rem" }}
          >
            {editing ? "💾 Lưu" : "✏️ Chỉnh sửa"}
          </button>
        </div>

        {/* Contact info card */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", marginBottom: "1.5rem", animation: "fadeUp .5s ease .1s both" }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "1.5rem" }}>
            Thông Tin Liên Hệ
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {FIELDS.map(([k, ic, lb]) => (
              <div key={k} className="input-wrap" style={{ marginBottom: 0 }}>
                <label>{ic} {lb}</label>
                {editing
                  ? <input value={form[k] || ""} onChange={upd(k)} />
                  : (
                    <div style={{
                      padding: ".85rem 1.1rem",
                      background: "rgba(255,255,255,.03)",
                      border: "1px solid rgba(255,255,255,.06)",
                      borderRadius: 12,
                      fontSize: ".9rem",
                      color: C.text,
                    }}>
                      {form[k] || <span style={{ color: C.textMuted }}>—</span>}
                    </div>
                  )
                }
              </div>
            ))}
          </div>

          {editing && (
            <button className="btn-p" onClick={save} style={{ marginTop: "1.5rem", padding: ".85rem 2rem" }}>
              Lưu Thay Đổi ✓
            </button>
          )}
        </div>

        {/* Security card */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", animation: "fadeUp .5s ease .2s both" }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "1.2rem" }}>
            🔒 Bảo Mật
          </h3>

          {/* Change password */}
          <button
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "1rem",
              background: "rgba(255,255,255,.03)",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              color: C.textSub, fontSize: ".88rem",
              cursor: "pointer", marginBottom: ".8rem",
              transition: "all .25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,107,43,.3)"; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
          >
            <span>Đổi mật khẩu</span>
            <span>→</span>
          </button>

          {/* 2FA */}
          <button
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "1rem",
              background: "rgba(255,255,255,.03)",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              color: C.textSub, fontSize: ".88rem",
              cursor: "pointer",
              transition: "all .25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,107,43,.3)"; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
          >
            <span>Xác thực 2 lớp (2FA)</span>
            <span style={{ color: C.amber, fontSize: ".78rem" }}>Chưa bật →</span>
          </button>
        </div>

      </div>
    </div>
  );
}