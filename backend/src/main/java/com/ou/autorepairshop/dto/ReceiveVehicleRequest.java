package com.ou.autorepairshop.dto;

import jakarta.validation.constraints.NotNull;

public record ReceiveVehicleRequest(
        @NotNull Long appointmentId,
        @NotNull Long employeeId,
        String notes
) {}
