package com.ou.autorepairshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PartRequestCreate(
        @NotNull Long repairOrderId,
        @NotNull Long partId,
        @Min(1) int requestedQuantity
) {}
