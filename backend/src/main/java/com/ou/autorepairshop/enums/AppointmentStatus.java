package com.ou.autorepairshop.enums;

public enum AppointmentStatus {
    PENDING,    // Khách vừa đặt lịch, chờ nhân viên xác nhận
    CONFIRMED,  // Nhân viên đã xác nhận, chờ khách mang xe đến
    RECEIVED,   // Xe đã được tiếp nhận, đã tạo Phiếu sửa chữa
    CANCELLED   // Lịch hẹn đã bị hủy
}
