import React from "react";
import { getStatusConfigByKey } from "../../hooks/useQuotations";
import { QuoteDetails } from "./QuoteDetail";

export default function QuoteCard({
    quote,
    index,
    isActive,
    onToggle,
    onApprove,
    onReject,
    isLoading,
}) {
    const statusConfig = getStatusConfigByKey(quote.status);

    return (
        <div
            className={`
                rounded-2xl border backdrop-blur-md
                duration-200 hover:-translate-y-px
                ${isActive ? "bg-white/6 border-orange-500/30"
                    : "bg-white/4.5 border-white/9 hover:bg-white/[0.07] hover:border-white/16"
                } `}
            style={{
                padding: "1.5rem",
                marginBottom: "1.2rem",
                cursor: "pointer",
                animation: `fadeUp .5s ease ${index * 0.1}s both`,
                transition: "all 0.2s",
            }}
            onClick={onToggle}
        >
            {/* Quote header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: ".78rem",
                            color: "#999",
                            marginBottom: ".3rem",
                        }}
                    >
                        {quote.id} · {quote.date}
                    </p>
                    <h3 className="font-[Kanit] font-bold text-base text-white mb-0.5">
                        {quote.car}
                    </h3>
                    <p className="text-sm text-neutral-400">
                        {quote.service}
                    </p>
                </div>
                <span
                    className="status-badge"
                    style={{
                        background: statusConfig.bg,
                        color: statusConfig.color,
                        padding: ".4rem .8rem",
                        borderRadius: 6,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >
                    {statusConfig.label}
                </span>
            </div>

            {/* Quote summary */}
            {quote.isEmpty ?
                (
                    <span style={{ fontSize: ".82rem", color: "#999" }}>
                        Chưa có báo giá
                    </span>
                ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }} >
                        <span style={{ fontSize: ".82rem", color: "#999" }}>
                            {quote.items.length} hạng mục
                        </span>
                        <span
                            style={{
                                fontFamily: "'Kanit',sans-serif",
                                fontWeight: 700,
                                color: "#FFB84D",
                                fontSize: "1rem",
                            }}
                        >
                            {quote.total}
                        </span>
                    </div>
                )}

            {/* Expanded detail section */}
            {isActive && !quote.isEmpty && <QuoteDetails quote={quote} onApprove={onApprove} onReject={onReject} isLoading={isLoading} />}
        </div>
    );
}