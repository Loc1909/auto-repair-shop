package com.ou.autorepairshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateProgressRequest(
        @NotNull Long repairOrderId,
        @NotBlank String status,
        String note
) {}
