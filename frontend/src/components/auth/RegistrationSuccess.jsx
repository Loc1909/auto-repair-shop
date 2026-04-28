import React from "react";

export default function RegistrationSuccess({ form, finish, loading }) {
  return (
    <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
      <h3
        style={{
          fontFamily: "'Kanit',sans-serif",
          fontWeight: 800,
          fontSize: "1.4rem",
          marginBottom: ".8rem",
        }}
      >
        Đăng Ký Thành Công!
      </h3>
      <p style={{ color: "#A0A0B8", lineHeight: 1.8, fontSize: ".9rem", marginBottom: "2rem" }}>
        Tài khoản của <strong style={{ color: "#F0F0F8" }}>{form.name}</strong> đã được tạo.<br />
        Bắt đầu đặt lịch bảo dưỡng ngay hôm nay!
      </p>
      <div
        style={{
          background: "rgba(74,218,160,.08)",
          border: "1px solid rgba(74,218,160,.2)",
          borderRadius: 14,
          padding: "1.2rem",
          marginBottom: "1.5rem",
          textAlign: "left",
        }}
      >
        {[
          ["👤", "Tên", form.name],
          ["📱", "SĐT", form.phone],
          form.plate ? ["🚗", "Biển số", form.plate] : null,
        ]
          .filter(Boolean)
          .map(([ic, lb, v]) => (
            <div
              key={lb}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: ".3rem 0",
                fontSize: ".85rem",
              }}
            >
              <span style={{ color: "#A0A0B8" }}>{ic} {lb}</span>
              <span style={{ color: "#F0F0F8", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
      </div>
      <button
        className="btn-p"
        onClick={finish}
        disabled={loading}
        style={{ width: "100%", padding: "1rem" }}
      >
        {loading ? "Đang xử lý..." : "Vào Trang Cá Nhân →"}
      </button>
    </div>
  );
}