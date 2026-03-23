package com.ou.autorepairshop.enums;

public enum PartRequestStatus {
    PENDING,    // Thợ vừa gửi yêu cầu, chờ kho xét duyệt
    APPROVED,   // Kho đã duyệt và xuất phụ tùng
    REJECTED    // Kho từ chối (hết hàng, không phù hợp...)
}
