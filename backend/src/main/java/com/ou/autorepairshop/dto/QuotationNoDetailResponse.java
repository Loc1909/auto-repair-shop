package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.enums.QuotationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record QuotationNoDetailResponse(
        Long id,
        QuotationStatus status,
        BigDecimal totalPrice,
        LocalDateTime createdAt,
        Long repairOrderId
) {
}
