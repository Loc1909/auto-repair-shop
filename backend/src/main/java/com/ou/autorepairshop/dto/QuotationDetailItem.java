package com.ou.autorepairshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuotationDetailItem(
        @NotBlank String itemType,  // PART or SERVICE
        @NotNull Long itemId,
        @Min(1) int quantity
) {}
