package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.entity.Role;
import com.ou.autorepairshop.entity.User;

public record UserResponse(
        Long id,
        String username,
        String email,
        Role role,
        boolean active
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isActive()
        );
    }
}
