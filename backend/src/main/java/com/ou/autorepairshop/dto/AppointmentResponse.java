package com.ou.autorepairshop.dto;

public record AppointmentResponse(
        Long id,
        String status,
        String customerName
) {}