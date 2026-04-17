package com.ou.autorepairshop.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public record AddServiceRequest(
        @NotNull Long repairOrderId,
        @NotNull Long serviceId,
        @NotNull @Min(1) Integer quantity
) {}