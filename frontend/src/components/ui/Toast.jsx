// src/components/ui/Toast.jsx
import { useEffect } from "react";

const COLORS = {
    success: { dot: "#4ADAA0", border: "rgba(74,218,160,.25)" },
    error: { dot: "#FF5B6B", border: "rgba(255,91,107,.25)" },
    info: { dot: "#5B9EFF", border: "rgba(91,158,255,.25)" },
};

export default function Toast({ msg, type = "success", onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const { dot, border } = COLORS[type] ?? COLORS.success;

    return (
        <div style={{
            position: "fixed", top: "5rem", right: "1.5rem", zIndex: 9999,
            animation: "slideDown .3s ease",
            background: "rgba(13,13,20,.95)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${border}`,
            borderRadius: 14,
            padding: ".9rem 1.3rem",
            display: "flex", alignItems: "center", gap: ".8rem",
            minWidth: 260,
            boxShadow: "0 8px 40px rgba(0,0,0,.4)",
        }}>
            <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: dot, flexShrink: 0,
            }} />
            <span style={{ fontSize: ".88rem", color: "#F0F0F8" }}>{msg}</span>
            <button
                onClick={onClose}
                style={{
                    marginLeft: "auto", background: "none", border: "none",
                    color: "#5A5A7A", fontSize: "1rem", cursor: "pointer", lineHeight: 1,
                }}
            >
                ×
            </button>
        </div>
    );
}