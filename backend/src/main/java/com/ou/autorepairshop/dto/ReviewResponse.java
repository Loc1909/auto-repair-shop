package com.ou.autorepairshop.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        int rating,
        String comment,
        LocalDateTime createdDate,
        Long customerId,
        String customerName,
        Long repairOrderId
) {
}
