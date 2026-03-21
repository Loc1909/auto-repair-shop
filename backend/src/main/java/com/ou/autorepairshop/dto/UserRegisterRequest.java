package com.ou.autorepairshop.dto;

public record UserRegisterRequest(
        String username,
        String email,
        String password
) {
}
