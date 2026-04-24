package com.ou.autorepairshop.dto;

public record VehicleRequest(
        String licensePlate,
        String brand,
        String model,
        Integer year,
        Long customerId
) {
}
