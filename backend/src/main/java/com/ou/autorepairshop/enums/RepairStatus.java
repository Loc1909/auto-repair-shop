package com.ou.autorepairshop.enums;

public enum RepairStatus {
    PENDING,    // Vừa tiếp nhận xe, chưa bắt đầu xử lý
    DIAGNOSING, // Đang chẩn đoán, kiểm tra lỗi xe
    QUOTING,    // Đang lập / chờ khách duyệt báo giá
    APPROVED,   // Khách đã duyệt báo giá, chuẩn bị tiến hành sửa
    REPAIRING,  // Đang tiến hành sửa chữa
    COMPLETED   // Hoàn thành, sẵn sàng bàn giao xe
}
