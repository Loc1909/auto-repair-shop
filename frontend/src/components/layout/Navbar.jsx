import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../common/Logo";

export default function Navbar({ scrolled, NAV_LINKS }) {
    const navigate = useNavigate();

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
            
            {/* LOGO */}
            <Logo onClick={() => navigate("/")} />

            {/* NAV LINKS */}
            <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
                {NAV_LINKS.map((l) => (
                    <button
                        key={l.label}
                        onClick={() => navigate(l.path)}
                        className="nav-link"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: "0.8rem" }}>
                <button
                    className="btn-outline"
                    onClick={() => navigate("/login")}
                >
                    Đăng Nhập
                </button>

                <button
                    className="btn-primary"
                    onClick={() => navigate("/booking")}
                >
                    Đặt Lịch Ngay
                </button>
            </div>
        </nav>
    );
}