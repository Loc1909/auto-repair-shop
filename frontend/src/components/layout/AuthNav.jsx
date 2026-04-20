// src/components/layout/AuthNav.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import "../../styles/auth.css";

export default function AuthNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

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
     <div style={{ display: "flex", gap: "0.8rem" }}>
                <button
                    className="btn-outline"
                    onClick={() => navigate("/login")}
                >
                    Đăng Nhập
                </button>

                <button
                    className="btn-primary"
                    onClick={() => navigate("/register")}
                >
                    Đăng Ký
                </button>
            </div>
    </nav>
  );
}