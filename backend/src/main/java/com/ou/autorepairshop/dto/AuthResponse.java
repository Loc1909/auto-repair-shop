package com.ou.autorepairshop.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expires,
        UserResponse user
) {
    public AuthResponse {
        if (tokenType == null || tokenType.isBlank()) {
            tokenType = "Bearer";
        }
    }

    public static AuthResponse of(
            String accessToken,
            String refreshToken,
            String tokenType,
            Long expires,
            UserResponse user
    ) {
        return new AuthResponse(accessToken, refreshToken, tokenType, expires, user);
    }
}
