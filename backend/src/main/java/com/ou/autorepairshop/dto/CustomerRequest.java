package com.ou.autorepairshop.dto;

public record CustomerRequest(
        String name,
        String address,
        String phone
) {
}
