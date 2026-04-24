import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";
import { repairOrderAPI } from "../../api/repairOrderApi";

export default function VehicleTrackingPage() {
    const navigate = useNavigate();
    const [repairOrders, setRepairOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        const fetchRepairOrders = async () => {
            try {
                const response = await repairOrderAPI.getMine();
                setRepairOrders(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy repair orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRepairOrders();
    }, []);

    const getStatusDisplay = (status) => {
        const statusMap = {
            PENDING: { label: "Chờ tiếp nhận", color: "#9E9E9E", bgColor: "rgba(158, 158, 158, 0.1)" },
            DIAGNOSING: { label: "Đang chẩn đoán", color: "#2196F3", bgColor: "rgba(33, 150, 243, 0.1)" },
            APPROVED: { label: "Đã duyệt báo giá", color: "#4CAF50", bgColor: "rgba(76, 175, 80, 0.1)" },
            REJECTED: { label: "Từ chối", color: "#F44336", bgColor: "rgba(244, 67, 54, 0.1)" },
            QUOTING: { label: "Chờ duyệt báo giá", color: "#FFB84D", bgColor: "rgba(255, 184, 77, 0.1)" },
            REPAIRING: { label: "Đang sửa chữa", color: "#FF6B2B", bgColor: "rgba(255, 107, 43, 0.1)" },
            COMPLETED: { label: "Hoàn thành", color: "#4CAF50", bgColor: "rgba(76, 175, 80, 0.1)" },
            CANCELLED: { label: "Hủy", color: "#FF6B6B", bgColor: "rgba(255, 107, 107, 0.1)" },
        };
        return statusMap[status] || { label: status, color: C.textMuted, bgColor: "rgba(255,255,255,.05)" };
    };

    const getStatusIcon = (status) => {
        const icons = {
            PENDING: "⏳",
            DIAGNOSING: "🩺",
            QUOTING: "📋",
            APPROVED: "✓",
            REJECTED: "✕",
            REPAIRING: "🔧",
            COMPLETED: "✓",
            CANCELLED: "✕",
        };
        return icons[status] || "•";
    };

    const filteredOrders = filter === "ALL" ? repairOrders : repairOrders.filter(order => order.status === filter);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", { month: "2-digit", day: "2-digit", year: "numeric" });
    };

    const handleViewDetails = (order) => {
        navigate(`/tracking/${order.id}`, { state: { order } });
    };

    const handlePayment = (order, e) => {
        e.stopPropagation();
        navigate(`/payment/${order.id}`, { state: { order } });
    };

    return (
        <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative", background: "linear-gradient(135deg, rgba(15,15,35,1) 0%, rgba(20,20,40,1) 100%)" }}>
            <BackgroundOrbs />
            <div style={{ maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: "2.5rem" }}>
                    <button className="btn-ghost" onClick={() => navigate("/dashboard")} style={{ marginBottom: "1.5rem" }}>← Quay lại</button>
                    <h1 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "2rem", letterSpacing: "-1px", marginBottom: ".5rem" }}>Theo Dõi Sửa Chữa</h1>
                    <p style={{ color: C.textSub, fontSize: ".95rem" }}>Quản lý tất cả đơn sửa chữa của bạn</p>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: "flex", gap: ".8rem", marginBottom: "2rem", overflowX: "auto", paddingBottom: ".5rem" }}>
                    {["ALL", "PENDING", "DIAGNOSING", "QUOTING", "APPROVED", "REJECTED", "REPAIRING", "COMPLETED",].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                padding: ".6rem 1.2rem",
                                border: "none",
                                borderRadius: 12,
                                background: filter === status ? "linear-gradient(135deg, #FF6B2B, #FF8C42)" : "rgba(255,255,255,.05)",
                                color: filter === status ? "#FFF" : C.textSub,
                                fontSize: ".85rem",
                                fontWeight: filter === status ? 600 : 500,
                                cursor: "pointer",
                                transition: "all .3s",
                                whiteSpace: "nowrap",
                                fontFamily: "'Kanit',sans-serif",
                            }}
                        >
                            {status === "ALL" && "Tất cả"}
                            {status === "PENDING" && "Chờ duyệt"}
                            {status === "DIAGNOSING" && "Chuẩn đoán"}
                            {status === "QUOTING" && "Đang báo giá"}
                            {status === "APPROVED" && "Đã duyệt"}
                            {status === "REJECTED" && "Từ chối"}
                            {status === "REPAIRING" && "Đang sửa"}
                            {status === "COMPLETED" && "Hoàn thành"}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "3rem", color: C.textMuted }}>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredOrders.length === 0 && (
                    <div style={{ textAlign: "center", padding: "3rem", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, color: C.textMuted }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
                        <p style={{ fontSize: ".95rem" }}>Không có đơn sửa chữa nào</p>
                    </div>
                )}

                {/* Repair Orders List */}
                <div style={{ display: "grid", gap: "1.2rem", animation: "fadeUp .5s ease" }}>
                    {filteredOrders.map((order, index) => {
                        const statusInfo = getStatusDisplay(order.status);
                        return (
                            <div
                                key={order.id}
                                onClick={() => handleViewDetails(order)}
                                style={{
                                    background: C.bgCard,
                                    border: `1px solid ${C.border}`,
                                    borderRadius: 20,
                                    padding: "1.5rem",
                                    cursor: "pointer",
                                    transition: "all .3s cubic-bezier(0.23, 1, 0.320, 1)",
                                    animation: `fadeUp .5s ease ${index * 0.08}s both`,
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 107, 43, 0.05)";
                                    e.currentTarget.style.borderColor = "rgba(255, 107, 43, 0.3)";
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = C.bgCard;
                                    e.currentTarget.style.borderColor = C.border;
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                {/* Status Badge Background */}
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: "120px",
                                    height: "120px",
                                    background: statusInfo.bgColor,
                                    borderRadius: "0 20px 0 200px",
                                    opacity: 0.5,
                                }} />

                                <div style={{ position: "relative", zIndex: 1 }}>
                                    {/* Top Row */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem", gap: "1rem" }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 className="gradient-text-white" style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".3rem" }}>
                                                {order.vehicleBrand} {order.vehicleModel}
                                            </h3>
                                            <p style={{ color: C.textMuted, fontSize: ".8rem" }}>
                                                {order.vehicleLicensePlate}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div
                                                className="status-badge"
                                                style={{
                                                    background: statusInfo.bgColor,
                                                    color: statusInfo.color,
                                                    fontSize: ".75rem",
                                                    padding: ".5rem .8rem",
                                                    borderRadius: 10,
                                                    fontWeight: 600,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: ".4rem",
                                                    marginBottom: ".5rem",
                                                }}
                                            >
                                                <span>{getStatusIcon(order.status)}</span>
                                                <span>{statusInfo.label}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Row - Info */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.2rem", paddingBottom: "1.2rem", borderBottom: `1px solid rgba(255,255,255,.05)` }}>
                                        <div>
                                            <p style={{ fontSize: ".7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: ".3rem" }}>Người thợ</p>
                                            <p style={{ fontSize: ".9rem", color: C.text, fontWeight: 500 }}>{order.employeeName}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: ".7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: ".3rem" }}>Ngày tiếp nhận</p>
                                            <p style={{ fontSize: ".9rem", color: C.text, fontWeight: 500 }}>{formatDate(order.createdDate)}</p>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {order.notes && (
                                        <div style={{ marginBottom: "1rem" }}>
                                            <p style={{ fontSize: ".75rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: ".3rem" }}>Ghi chú</p>
                                            <p style={{ fontSize: ".85rem", color: C.textSub, fontStyle: "italic", maxHeight: "60px", overflow: "hidden", textOverflow: "ellipsis" }}>"{order.notes}"</p>
                                        </div>
                                    )}

                                    {/* Bottom Actions */}
                                    <div style={{ display: "flex", gap: ".8rem" }}>
                                        <button
                                            onClick={() => handleViewDetails(order)}
                                            style={{
                                                flex: 1,
                                                padding: ".7rem 1rem",
                                                background: "linear-gradient(135deg, #FF6B2B, #FF8C42)",
                                                border: "none",
                                                borderRadius: 10,
                                                color: "#FFF",
                                                fontSize: ".85rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                transition: "all .3s",
                                                fontFamily: "'Kanit',sans-serif",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "scale(1.02)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "scale(1)";
                                            }}
                                        >
                                            Xem Chi Tiết →
                                        </button>

                                        {order.status === "QUOTING" && (
                                            <button
                                                onClick={(e) => handlePayment(order, e)}
                                                style={{
                                                    flex: 1,
                                                    padding: ".7rem 1rem",
                                                    background: "rgba(76, 175, 80, 0.15)",
                                                    border: "1.5px solid rgba(76, 175, 80, 0.4)",
                                                    borderRadius: 10,
                                                    color: "#4CAF50",
                                                    fontSize: ".85rem",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    transition: "all .3s",
                                                    fontFamily: "'Kanit',sans-serif",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = "rgba(76, 175, 80, 0.25)";
                                                    e.currentTarget.style.borderColor = "rgba(76, 175, 80, 0.6)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = "rgba(76, 175, 80, 0.15)";
                                                    e.currentTarget.style.borderColor = "rgba(76, 175, 80, 0.4)";
                                                }}
                                            >
                                                💳 Thanh Toán
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Animations */}
                <style>{`
                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.5;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}
