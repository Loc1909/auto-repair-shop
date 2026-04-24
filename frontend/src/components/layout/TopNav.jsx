// src/components/layout/TopNav.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../common/Logo";

const NAV_ITEMS = [
  ["/dashboard", "Dashboard"],
  ["/booking", "Đặt Lịch"],
  ["/tracking", "Theo Dõi"],
  ["/history", "Lịch Sử"],
  ["/quotes", "Báo Giá"],
];

export default function TopNav({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleLogout = () => {
    setDropOpen(false);
    onLogout();           // xóa user ở App/context
    navigate("/login");
  };

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

      <Logo onClick={() => navigate("/")} />

      {/* Nav links */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {NAV_ITEMS.map(([path, label]) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`nav-link${location.pathname === path ? " active" : ""}`}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* User dropdown */}
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setDropOpen(d => !d)}
          style={{
            display: "flex", alignItems: "center", gap: ".7rem",
            cursor: "pointer", padding: ".4rem .8rem", borderRadius: 50,
            background: dropOpen ? "rgba(255,107,43,.1)" : "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.08)",
            transition: "all .3s",
          }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg,#FF6B2B,#FF3B00)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: ".85rem", fontWeight: 700,
          }}>
            {user?.name?.charAt(0) ?? "U"}
          </div>
          <span style={{ fontSize: ".85rem", fontWeight: 500 }}>
            {user?.name ?? "Khách"}
          </span>
          <span style={{ fontSize: ".65rem", color: "#5A5A7A" }}>
            {dropOpen ? "▲" : "▼"}
          </span>
        </div>

        {dropOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + .6rem)", right: 0,
            background: "rgba(20,20,30,.97)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,.08)", borderRadius: 16,
            padding: ".5rem", minWidth: 180,
            animation: "scaleIn .2s ease",
            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
          }}>
            {[
              ["👤", "Hồ sơ", "/profile"],
              ["🚗", "Xe của tôi", "/mycars"],
              ["⚙️", "Cài đặt", "/settings"],
            ].map(([ic, lb, path]) => (
              <button
                key={path}
                onClick={() => { navigate(path); setDropOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: ".7rem",
                  width: "100%", padding: ".65rem .9rem",
                  background: "transparent", border: "none",
                  color: "#A0A0B8", fontSize: ".85rem",
                  borderRadius: 10, cursor: "pointer",
                  transition: "all .2s", textAlign: "left",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span>{ic}</span>{lb}
              </button>
            ))}

            <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", margin: ".4rem 0" }} />

            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: ".7rem",
                width: "100%", padding: ".65rem .9rem",
                background: "transparent", border: "none",
                color: "#FF5B6B", fontSize: ".85rem",
                borderRadius: 10, cursor: "pointer",
              }}
            >
              <span>🚪</span>Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}