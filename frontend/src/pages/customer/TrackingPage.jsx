import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BackgroundOrbs from "../../components/effects/BackgroundOrbs";
import { C } from "../../constants/colors";
import "../../styles/customer.css";
import QuotationBill from "../../components/customer/QuotationBill";
import HeaderCard from "../../components/customer/TrackingHeaderCard";
import ProgressSteps from "../../components/customer/ProgressSteps";
import { useTrackingData } from "../../hooks/useTrackingData";
import { STATUS_ORDER, STATUS_LABELS } from "../../constants/repairStatus";
import { quotationAPI } from "../../api/quotationApi";

export default function TrackingPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const getStatusLabel = (status) => STATUS_LABELS[status] || status;
    const { order, repairProgress, quotation, loading, setQuotation } = useTrackingData(id, location.state?.order);
    const [expanded, setExpanded] = useState(3);
    const [confirmingQuotation, setConfirmingQuotation] = useState(false);

    const transformRepairProgress = (progressData) => {
        if (!progressData || progressData.length === 0) return [];

        const sorted = [...progressData].sort((a, b) =>
            new Date(a.updateTime) - new Date(b.updateTime)
        );

        return sorted.map((item, index) => ({
            label: getStatusLabel(item.status),
            time: new Date(item.updateTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            done: index < sorted.length - 1,
            active: index === sorted.length - 1,
            note: item.note || "",
        }));
    };

    const getStatusInfo = (status) => {
        const statusColorMap = {
            "PENDING": { bgColor: "rgba(107,114,128,.15)", color: "#9CA3AF" },
            "DIAGNOSING": { bgColor: "rgba(59,130,246,.15)", color: "#3B82F6" },
            "QUOTING": { bgColor: "rgba(168,85,247,.15)", color: "#A855F7" },
            "APPROVED": { bgColor: "rgba(34,197,94,.15)", color: "#22C55E" },
            "REPAIRING": { bgColor: "rgba(251,146,60,.15)", color: "#FB923C" },
            "COMPLETED": { bgColor: "rgba(34,197,94,.15)", color: "#22C55E" },
            "REJECTED": { bgColor: "rgba(239,68,68,.15)", color: "#EF4444" },
        };
        return {
            ...statusColorMap[status],
            label: STATUS_LABELS[status] || status
        };
    };

    const calculateProgress = (repairProgressData) => {
        if (!repairProgressData || repairProgressData.length === 0) {
            return { completedSteps: 0, totalSteps: 6, percentage: 0, currentStatus: "PENDING" };
        }

        const sorted = [...repairProgressData].sort((a, b) =>
            new Date(b.updateTime) - new Date(a.updateTime)
        );
        const currentStatus = sorted[0].status;

        const statusIndex = STATUS_ORDER.indexOf(currentStatus);
        const completedSteps = statusIndex >= 0 ? statusIndex + 1 : 0;
        const totalSteps = STATUS_ORDER.length;
        const percentage = Math.round((completedSteps / totalSteps) * 100);

        return { completedSteps, totalSteps, percentage, currentStatus };
    };

    const handleConfirmQuotation = async (action) => {
        if (!quotation || confirmingQuotation) return;

        setConfirmingQuotation(true);
        try {
            const response = await quotationAPI.confirmQuotation(order.id, action);
            setQuotation(response.data);

            alert(action === "APPROVE" ? "Xác nhận báo giá thành công!" : "Từ chối báo giá thành công!");

            if (action === "APPROVE") {
                setTimeout(() => {
                    // navigate(`/payment/${order.id}`, { state: { order, quotation: response.data } });
                }, 500);
            }
        } catch (error) {
            console.error("Lỗi khi xác nhận báo giá:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setConfirmingQuotation(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", color: C.textMuted }}>
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", color: C.textMuted }}>
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>❌</div>
                    <p>Không tìm thấy đơn sửa chữa</p>
                </div>
            </div>
        );
    }

    const statusInfo = {
        label: STATUS_LABELS[order.status] || order.status,
        ...getStatusInfo(order.status),
    };

    const { completedSteps, totalSteps, percentage } = calculateProgress(repairProgress);

    return (
        <div style={{ minHeight: "100vh", padding: "6rem 5% 3rem", position: "relative" }}>
            <BackgroundOrbs />
            <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
                <button className="btn-ghost" onClick={() => navigate("/tracking")} style={{ marginBottom: "1.5rem" }}>← Quay lại</button>

                {/* Header card */}
                {order && (
                    <HeaderCard
                        order={order}
                        statusInfo={statusInfo}
                        completedSteps={completedSteps}
                        totalSteps={totalSteps}
                        percentage={percentage}
                    />
                )}

                {/* Steps */}
                <ProgressSteps
                    repairProgress={repairProgress}
                    transformRepairProgress={transformRepairProgress}
                    expanded={expanded}
                    setExpanded={setExpanded}
                />

                {/* Quotation Bill */}
                {quotation ? (
                    <QuotationBill
                        quotation={quotation}
                        order={order}
                        handleConfirmQuotation={handleConfirmQuotation}
                        confirmingQuotation={confirmingQuotation}
                    />
                ) : (
                    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2rem", animation: "fadeUp .5s ease .2s both", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
                        <p style={{ color: C.textMuted }}>Chưa có báo giá cho đơn sửa chữa này</p>
                    </div>
                )}
            </div>
        </div>
    );
}