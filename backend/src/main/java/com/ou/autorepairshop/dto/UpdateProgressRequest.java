package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.enums.RepairStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateProgressRequest(
        @NotNull Long repairOrderId,
        @NotNull RepairStatus status,
        String note
) {}
