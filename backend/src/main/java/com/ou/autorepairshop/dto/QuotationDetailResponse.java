package com.ou.autorepairshop.dto;

import java.math.BigDecimal;

public record QuotationDetailResponse(
        Long id,
        String itemType,
        Long itemId,
        String itemName,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {}
