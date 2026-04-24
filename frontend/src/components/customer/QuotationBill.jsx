import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../../constants/colors";

const QuotationBill = ({ quotation, order, handleConfirmQuotation, confirmingQuotation }) => {
    const navigate = useNavigate();

    return (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", animation: "fadeUp .5s ease .2s both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <h2 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>Báo Giá</h2>
                <span className="status-badge" style={{
                    background: quotation.status === "PENDING" ? "rgba(255, 184, 77, 0.15)" : quotation.status === "APPROVED" ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
                    color: quotation.status === "PENDING" ? "#FFB84D" : quotation.status === "APPROVED" ? "#4CAF50" : "#F44336",
                    fontSize: ".75rem",
                    padding: ".3rem .7rem",
                    borderRadius: 6
                }}>
                    {quotation.status === "PENDING" ? "Chờ duyệt" : quotation.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
                </span>
            </div>

            {/* Details */}
            {quotation.details && quotation.details.length > 0 ? (
                quotation.details.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: ".7rem 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: ".87rem" }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ color: C.textSub }}>{item.itemName}</span>
                            <p style={{ fontSize: ".9rem", color: C.textMuted, marginTop: ".2rem" }}>
                                {item.quantity} × {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice)}
                            </p>
                        </div>
                        <span style={{ fontWeight: 600 }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.subtotal)}
                        </span>
                    </div>
                ))
            ) : (
                <p style={{ color: C.textMuted, fontSize: ".87rem" }}>Không có chi tiết báo giá</p>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: "2px solid rgba(255,255,255,.1)" }}>
                <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700 }}>Tổng cộng</span>
                <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, color: C.orange, fontSize: "1.1rem" }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(quotation.totalPrice)}
                </span>
            </div>

            {/* Action buttons */}
            {quotation.status === "PENDING" && (
                <div style={{ display: "flex", gap: ".8rem", marginTop: "1.2rem" }}>
                    <button
                        onClick={() => handleConfirmQuotation("REJECT")}
                        disabled={confirmingQuotation}
                        style={{
                            flex: 1,
                            padding: ".85rem",
                            background: "rgba(244, 67, 54, 0.1)",
                            color: "#F44336",
                            border: "1px solid rgba(244, 67, 54, 0.3)",
                            borderRadius: 12,
                            fontWeight: 600,
                            cursor: confirmingQuotation ? "not-allowed" : "pointer",
                            transition: "all .3s",
                            fontSize: ".9rem",
                            opacity: confirmingQuotation ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!confirmingQuotation) {
                                e.target.style.background = "rgba(244, 67, 54, 0.2)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!confirmingQuotation) {
                                e.target.style.background = "rgba(244, 67, 54, 0.1)";
                            }
                        }}
                    >
                        {confirmingQuotation ? "Đang xử lý..." : "Từ Chối"}
                    </button>
                    <button
                        onClick={() => handleConfirmQuotation("APPROVE")}
                        disabled={confirmingQuotation}
                        className="btn-p"
                        style={{
                            flex: 1,
                            padding: ".85rem",
                            opacity: confirmingQuotation ? 0.6 : 1,
                            cursor: confirmingQuotation ? "not-allowed" : "pointer"
                        }}
                    >
                        {confirmingQuotation ? "Đang xử lý..." : "Xác Nhận & Thanh Toán →"}
                    </button>
                </div>
            )}

            {quotation.status === "APPROVED" && order.status === "QUOTING" && (
                <button
                    onClick={() => navigate(`/payment/${order.id}`, { state: { order, quotation } })}
                    className="btn-p"
                    style={{ width: "100%", marginTop: "1.2rem", padding: ".85rem" }}
                >
                    Tiếp Tục Thanh Toán →
                </button>
            )}

            {quotation.status === "REJECTED" && (
                <div style={{ marginTop: "1.2rem", padding: "1rem", background: "rgba(244, 67, 54, 0.1)", borderRadius: 12, textAlign: "center" }}>
                    <p style={{ color: "#F44336", fontWeight: 600 }}>Báo giá đã bị từ chối</p>
                </div>
            )}
        </div>
    );
};

export default QuotationBill;