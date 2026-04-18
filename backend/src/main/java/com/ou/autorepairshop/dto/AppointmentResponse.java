package com.ou.autorepairshop.dto;

import java.time.LocalDateTime;

public record AppointmentResponse(
        Long id,
        LocalDateTime appointmentTime,
        String note,
        String status,
        Long employeeId,
        Long customerId,
        Long vehicleId
) {
}
