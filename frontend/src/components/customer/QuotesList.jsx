import React from "react";
import QuoteCard from "./QuoteCard";
import ErrorState from "../ui/ErrorState";

export default function QuotesList({
    quotes,
    loading,
    error,
    activeQuote,
    onToggle,
    onApprove,
    onReject,
    onRetry,
}) {
    return (
        <div>
            {/* Loading state */}
            {loading && quotes.length === 0 && (<div
                style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "#999",
                }}
            >
                <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>Đang tải báo giá...</p>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        border: `2px solid rgba(255,255,255,.1)`,
                        borderTop: `2px solid rgba(255,255,255,.5)`,
                        borderRadius: "50%",
                        margin: "0 auto",
                        animation: "spin 1s linear infinite",
                    }}
                />
            </div>)}

            {/* Error state */}
            {error && !loading && <ErrorState error={error} onRetry={onRetry} />}

            {/* Empty state */}
            {!loading && !error && quotes.length === 0 && (
                <div
                    style={{
                        textAlign: "center", padding: "3rem 1rem",
                        color: "#999", fontSize: ".95rem",
                    }} >
                    <p style={{ marginBottom: ".5rem" }}>📭 Không có báo giá nào để duyệt.</p>
                    <p style={{ fontSize: ".85rem" }}>
                        Khi có báo giá mới, chúng sẽ xuất hiện ở đây.
                    </p>
                </div>
            )}

            {/* Quotes list */}
            {!loading &&
                quotes.map((quote, index) => (
                    <QuoteCard
                        key={quote.id}
                        quote={quote}
                        index={index}
                        isActive={activeQuote?.id === quote.id}
                        onToggle={() => onToggle(quote)}
                        onApprove={() => onApprove(quote)}
                        onReject={() => onReject(quote)}
                        isLoading={loading}
                    />
                ))}
        </div>
    );
}