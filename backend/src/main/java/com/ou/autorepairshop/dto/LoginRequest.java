package com.ou.autorepairshop.dto;

public record LoginRequest(
        String emailOrUsername,
        String password
) {
}
