import React from "react";
import { C } from "../../constants/colors";

const ProgressSteps = ({ repairProgress, transformRepairProgress, expanded, setExpanded }) => {
    const steps = transformRepairProgress(repairProgress);

    return (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", marginBottom: "1.5rem", animation: "fadeUp .5s ease .1s both" }}>
            <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem" }}>Tiến Độ Sửa Chữa</h2>
            {repairProgress && repairProgress.length > 0 ? (
                steps.map((s, i) => (
                    <div key={i} style={{ position: "relative", paddingLeft: "3rem", paddingBottom: i < steps.length - 1 ? "1.5rem" : "0", cursor: s.note ? "pointer" : "default" }} onClick={() => s.note && setExpanded(expanded === i ? -1 : i)}>
                        {i < steps.length - 1 && <div style={{ position: "absolute", left: 17, top: 36, bottom: 0, width: 2, background: s.done ? "linear-gradient(to bottom,rgba(255,107,43,.4),rgba(255,107,43,.1))" : "rgba(255,255,255,.06)" }} />}
                        <div style={{ position: "absolute", left: 0, top: 2, width: 36, height: 36, borderRadius: "50%", background: s.done ? "linear-gradient(135deg,#FF6B2B,#FF3B00)" : s.active ? "rgba(255,107,43,.15)" : "rgba(255,255,255,.06)", border: s.active ? "2px solid rgba(255,107,43,.5)" : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", transition: "all .3s" }}>
                            {s.done ? "✓" : s.active ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.orange, animation: "pulse 1s infinite", display: "block" }} /> : ""}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontWeight: s.active ? 600 : 500, color: s.done ? C.text : s.active ? C.amber : "#4A4A6A", fontSize: ".9rem" }}>{s.label}</p>
                            <span style={{ fontSize: ".78rem", color: s.done ? C.green : s.active ? C.orange : C.textMuted, fontWeight: s.active ? 600 : 400 }}>{s.time}</span>
                        </div>
                        {expanded === i && s.note && <div style={{ marginTop: ".5rem", padding: ".7rem 1rem", background: "rgba(255,255,255,.03)", borderRadius: 10, fontSize: ".8rem", color: C.textSub, lineHeight: 1.6, animation: "fadeIn .3s ease" }}>{s.note}</div>}
                    </div>
                ))
            ) : (
                <p style={{ color: C.textMuted }}>Chưa có dữ liệu tiến độ</p>
            )}
        </div>
    );
};

export default ProgressSteps;