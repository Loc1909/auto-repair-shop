package com.ou.autorepairshop.enums;

public enum QuotationStatus {
    PENDING,    // Báo giá đã gửi, chờ khách phản hồi
    APPROVED,   // Khách đã chấp nhận báo giá
    REJECTED    // Khách từ chối, cần lập lại báo giá khác
}
