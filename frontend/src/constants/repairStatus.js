import { C } from "./colors";

export const STATUS_ORDER = [
    "PENDING",
    "DIAGNOSING",
    "QUOTING",
    "APPROVED",
    "REPAIRING",
    "COMPLETED"
];

export const STATUS_LABELS = {
    PENDING: "Chờ tiếp nhận",
    DIAGNOSING: "Chẩn đoán",
    QUOTING: "Lập báo giá",
    APPROVED: "Đã duyệt báo giá",
    REPAIRING: "Đang sửa",
    COMPLETED: "Hoàn thành",
    REJECTED: "Từ chối",
};

export const getStatusDisplay = (status) => {
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

export const getStatusInfo = (status) => {
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