
export function QuoteDetails({ quote, onApprove, onReject, isLoading }) {
  return (
    <div
      style={{
        marginTop: "1.2rem", borderTop: "1px solid rgba(255,255,255,.07)",
        paddingTop: "1.2rem", animation: "fadeIn .3s ease",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Line items */}
      {quote.items.map(([name, price]) => (
        <div
          key={name}
          style={{
            display: "flex", justifyContent: "space-between", padding: ".4rem 0",
            fontSize: ".85rem", borderBottom: "1px solid rgba(255,255,255,.04)",
          }}
        >
          <span style={{ color: "#aaa" }}>{name}</span>
          <span style={{ color: "#fff", fontWeight: 500 }}>{price}</span>
        </div>
      ))}

      {/* Technician note */}
      {quote.note && (
        <div
          style={{
            marginTop: "1rem", padding: "1rem",
            background: "rgba(255,184,77,.08)",
            border: "1px solid rgba(255,184,77,.15)",
            borderRadius: 12, fontSize: ".82rem",
            color: "#aaa", lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "#FFB84D" }}>💡 Đề xuất thêm từ KTV:</strong>
          <br />
          {quote.note}
        </div>
      )}

      {quote.status === "pending" && (
        <div style={{ display: "flex", gap: ".8rem", marginTop: "1.2rem", }} >
          <button
            className="btn-o"
            onClick={() => onReject(quote)}
            disabled={isLoading}
            style={{
              flex: 1, padding: ".8rem", color: "#FF5B6B",
              borderColor: "rgba(255,91,107,.3)", opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer", transition: "all 0.2s",
            }}
          >
            {isLoading ? "⏳ Đang xử lý..." : "✕ Từ chối"}
          </button>
          <button
            className="btn-p"
            onClick={() => onApprove(quote)}
            disabled={isLoading}
            style={{
              flex: 2, padding: ".8rem", opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer", transition: "all 0.2s",
            }}
          >
            {isLoading ? "⏳ Đang xử lý..." : "✓ Duyệt & Thanh Toán"}
          </button>
        </div>
      )}

      {/* Status badge for approved/rejected */}
      {quote.status !== "pending" && (
        <div
          style={{
            marginTop: "1rem", padding: "0.8rem", textAlign: "center",
            background:
              quote.status === "approved"
                ? "rgba(76,175,80,.1)"
                : "rgba(255,91,107,.1)",
            border:
              quote.status === "approved"
                ? "1px solid rgba(76,175,80,.3)"
                : "1px solid rgba(255,91,107,.3)",
            borderRadius: 8,
            fontSize: ".85rem",
            color:
              quote.status === "approved" ? "#4CAF50" : "#FF5B6B",
            fontWeight: 600,
          }}
        >
          {quote.status === "approved"
            ? "✓ Báo giá đã chấp nhận"
            : "✕ Báo giá đã bị từ chối"}
        </div>
      )}
    </div>
  );
}