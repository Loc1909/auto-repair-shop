import React from "react";
import StatCard from "../common/StatCard";
export default function StatsSection({ statsRef, statsVisible, STATS }) {
    return (

        <section ref={statsRef} style={{ padding: "4rem 5%", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
            {STATS.map((s, i) => <StatCard key={s.label} {...s} index={i} visible={statsVisible} />)}
          </div>
        </section>
    )
}