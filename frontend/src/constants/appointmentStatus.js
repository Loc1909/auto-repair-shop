export const getAppointmentStatusDisplay = (status) => {
    const statusMap = {
        PENDING: { label: "Chờ tiếp nhận", color: "#9E9E9E", bgColor: "rgba(158, 158, 158, 0.1)" },
        CONFIRM: { label: "Nhân viên đã duyệt", color: "#4CAF50", bgColor: "rgba(76, 175, 80, 0.1)" },
        RECEIVED: { label: "Đã nhận xe", color: "#4CAF50", bgColor: "rgba(76, 175, 80, 0.1)" },
        CANCELLED: { label: "Hủy", color: "#FF6B6B", bgColor: "rgba(255, 107, 107, 0.1)" },
    };
    return statusMap[status] || { label: status, color: C.textMuted, bgColor: "rgba(255,255,255,.05)" };
};