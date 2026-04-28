import React from "react";

export default function RegisterForm({ form, setForm, upd, toggleShowPassword, showPassword }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="input-wrap" style={{ marginBottom: 0 }}>
        <label>Họ và tên </label>
        <input placeholder="Nguyễn Văn A" value={form.name} onChange={upd("name")} />
      </div>
      <div className="input-wrap" style={{ marginBottom: 0 }}>
        <label>Tên người dùng</label>
        <input placeholder="username" value={form.username} onChange={upd("username")} />
      </div>
      <div className="input-wrap" style={{ marginBottom: 0 }}>
        <label>Email</label>
        <input placeholder="email@example.com" value={form.email} onChange={upd("email")} />
      </div>
      <div className="input-wrap" style={{ marginBottom: 0 }}>
        <label>Số điện thoại (tùy chọn)</label>
        <input placeholder="0901 234 567" value={form.phone} onChange={upd("phone")} />
      </div>
      <div className="input-wrap" style={{ marginBottom: 0 }}>
        <label>Địa chỉ (tùy chọn)</label>
        <input placeholder="97 Võ Văn Tần, Xuân Hòa, Hồ Chí Minh" value={form.address} onChange={upd("address")} />
      </div>
      <div className="input-wrap" style={{ marginBottom: 0, position: "relative" }}>
        <label>Mật khẩu</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Tối thiểu 8 ký tự"
          value={form.password}
          onChange={upd("password")}
        />
        <div
          onClick={toggleShowPassword}
          style={{
            position: "absolute",
            right: "1rem",
            top: "65%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#A0A0B8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </div>
      </div>
      <div className="input-wrap" style={{ marginBottom: 0, position: "relative" }}>
        <label>Xác nhận mật khẩu</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          value={form.confirm}
          onChange={upd("confirm")}
        />
      </div>
      <p style={{ fontSize: ".78rem", color: "#5A5A7A", lineHeight: 1.6 }}>
        Bằng cách đăng ký, bạn đồng ý với {" "}
        <span style={{ color: "#FF8C5A", cursor: "pointer" }}>Điều khoản sử dụng</span>
        {" "}và {" "}
        <span style={{ color: "#FF8C5A", cursor: "pointer" }}>Chính sách bảo mật</span>.
      </p>
    </div>
  );
}