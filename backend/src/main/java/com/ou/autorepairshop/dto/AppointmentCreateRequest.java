package com.ou.autorepairshop.dto;

import java.time.LocalDateTime;

public record AppointmentCreateRequest(
        LocalDateTime appointmentTime,
        String note,
        String status,
        Long customerId,
        Long vehicleId
) {
}
