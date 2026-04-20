package com.ou.autorepairshop.dto;

public record EmployeeResponse(
        Long id,
        String name,
        String phone,
        String position,
        Double salary,
        String username
) {}