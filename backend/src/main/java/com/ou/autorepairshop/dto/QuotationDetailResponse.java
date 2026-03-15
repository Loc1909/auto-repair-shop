package com.ou.autorepairshop.dto;

public record QuotationDetailResponse(
        Long id,
        String itemType,
        Long itemId,
        String itemName,
        int quantity,
        double unitPrice,
        double subtotal
) {}
