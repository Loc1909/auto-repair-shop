package com.ou.autorepairshop.dto;

import java.time.LocalDateTime;
import java.util.List;

public record QuotationResponse(
        Long id,
        String status,
        double totalPrice,
        LocalDateTime createdAt,
        Long repairOrderId,
        List<QuotationDetailResponse> details
) {}
