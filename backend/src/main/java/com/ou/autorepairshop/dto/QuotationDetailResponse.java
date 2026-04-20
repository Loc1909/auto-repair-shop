package com.ou.autorepairshop.dto;

import java.math.BigDecimal;

public record QuotationDetailResponse(
        Long id,
        String itemType,
        Long itemId, // id của Part và RepairService
        String itemName, // name của Part và RepairService
        int quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {}
