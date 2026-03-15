package com.ou.autorepairshop.dto;

import java.time.LocalDateTime;

public record PartRequestResponse(
        Long id,
        String status,
        int requestedQuantity,
        LocalDateTime requestedAt,
        Long repairOrderId,
        Long partId,
        String partName,
        int partStockQuantity
) {}
