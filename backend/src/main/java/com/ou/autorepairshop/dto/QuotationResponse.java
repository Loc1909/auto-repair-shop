package com.ou.autorepairshop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record QuotationResponse(
        Long id,
        String status,
        BigDecimal totalPrice,
        LocalDateTime createdAt,
        Long repairOrderId,
        List<QuotationDetailResponse> details
) {}
