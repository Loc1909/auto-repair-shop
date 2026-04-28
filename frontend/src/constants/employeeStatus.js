export const APPOINTMENT_STATUS_META = {
  PENDING: { color: "warning", label: "Chờ xác nhận" },
  CONFIRMED: { color: "success", label: "Đã xác nhận" },
  CANCELLED: { color: "error", label: "Đã hủy" },
  RECEIVED: { color: "info", label: "Đã tiếp nhận" },
};

export const REPAIR_ORDER_STATUS_META = {
  PENDING: { color: "warning", label: "Chờ xử lý" },
  DIAGNOSING: { color: "secondary", label: "Đang chẩn đoán" },
  QUOTING: { color: "info", label: "Đang làm báo giá" },
  APPROVED: { color: "primary", label: "Khách đã duyệt" },
  REPAIRING: { color: "success", label: "Đang sửa chữa" },
  COMPLETED: { color: "success", label: "Hoàn thành" },
  CANCELLED: { color: "error", label: "Đã hủy" },
};

export const getAppointmentStatusMeta = (status) =>
  APPOINTMENT_STATUS_META[status] || { color: "default", label: status };

export const getRepairOrderStatusMeta = (status) =>
  REPAIR_ORDER_STATUS_META[status] || { color: "default", label: status };
