package com.ou.autorepairshop.dto;

public record CustomerResponse(
        Long id,
        String name,
        String address,
        String phone
) {}