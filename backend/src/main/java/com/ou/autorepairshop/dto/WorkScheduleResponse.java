package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.enums.RepairStatus;
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
            AppointmentStatus status,
            String vehicleLicensePlate,
            String customerName
    ) {}

    public record RepairOrderSummary(
            Long id,
            RepairStatus status,
            LocalDateTime createdDate,
            String vehicleLicensePlate
    ) {}
}
