package com.ou.autorepairshop.dto;

import java.time.LocalDateTime;

public record RepairOrderResponse(
        Long id,
        String status,
        LocalDateTime createdDate,
        LocalDateTime completedDate,
        String notes,
        Long vehicleId,
        String vehicleLicensePlate,
        String vehicleBrand,
        String vehicleModel,
        Long employeeId,
        String employeeName,
        Long appointmentId
) {}
