package com.ou.autorepairshop.dto;

import java.time.LocalDateTime;
import java.util.List;

public record WorkScheduleResponse(
        Long employeeId,
        String employeeName,
        List<AppointmentSummary> appointments,
        List<RepairOrderSummary> activeOrders
) {
    public record AppointmentSummary(
            Long id,
            LocalDateTime appointmentTime,
            String status,
            String vehicleLicensePlate,
            String customerName
    ) {}

    public record RepairOrderSummary(
            Long id,
            String status,
            LocalDateTime createdDate,
            String vehicleLicensePlate
    ) {}
}
