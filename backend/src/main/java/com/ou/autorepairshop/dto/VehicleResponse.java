package com.ou.autorepairshop.dto;

public record VehicleResponse(
        Long id,
        String licensePlate,
        String brand,
        String model,
        Integer year,
        Long customerId
) {
}
