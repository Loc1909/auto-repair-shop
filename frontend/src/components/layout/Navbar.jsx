import React from "react";

export default function Navbar({ scrolled, NAV_LINKS }) {
    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
            padding: "1.2rem 5%",
            background: scrolled ? "rgba(13,13,20,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
            transition: "all 0.4s",
            display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                    width: 36, height: 36,
                    background: "linear-gradient(135deg, #FF6B2B, #FF3B00)",
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem",
                }}>🔧</div>

                <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.15rem",
                    letterSpacing: "-0.5px"
                }}>
                    Auto<span style={{ color: "#FF6B2B" }}>Pro</span>
                </span>
            </div>

            <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
                {NAV_LINKS.map(l => (
                    <a key={l} href="#" className="nav-link">{l}</a>
                ))}
            </div>

            <div style={{ display: "flex", gap: "0.8rem" }}>
                <button className="btn-outline">Đăng Nhập</button>
                <button className="btn-primary">Đặt Lịch Ngay</button>
            </div>
        </nav>
    );
}