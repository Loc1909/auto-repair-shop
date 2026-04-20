package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.enums.AppointmentStatus;

import java.time.LocalDateTime;

public record AppointmentResponseForEmployee(
        Long id,
        LocalDateTime appointmentTime,
        AppointmentStatus status,
        String note,
        Long customerId,
        String customerName,
        Long vehicleId,
        String licensePlate,
        Long assignedEmployeeId,
        String assignedEmployeeName
) {}
