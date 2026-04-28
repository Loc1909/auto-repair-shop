import React from "react";

export default function OtpVerification({ otp, handleOtp, otpRefs }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📱</div>
      <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".5rem" }}>
        Xác Thực Số Điện Thoại
      </h3>
      <p style={{ color: "#A0A0B8", fontSize: ".85rem", marginBottom: "2rem", lineHeight: 1.7 }}>
        Nhập mã OTP 6 chữ số đã gửi đến<br />
        <strong style={{ color: "#F0F0F8" }}>Số điện thoại của bạn</strong>
      </p>
      <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => (otpRefs.current[i] = el)}
            value={d}
            onChange={(e) => handleOtp(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus();
            }}
            style={{
              width: 48,
              height: 54,
              textAlign: "center",
              fontSize: "1.3rem",
              fontWeight: 700,
              fontFamily: "'Kanit',sans-serif",
              borderRadius: 12,
              padding: 0,
            }}
            maxLength={1}
          />
        ))}
      </div>
      <p style={{ fontSize: ".82rem", color: "#5A5A7A" }}>
        Không nhận được mã? {" "}
        <button
          style={{
            background: "none",
            border: "none",
            color: "#FF8C5A",
            cursor: "pointer",
            fontSize: ".82rem",
          }}
        >
          Gửi lại (60s)
        </button>
      </p>
    </div>
  );
}