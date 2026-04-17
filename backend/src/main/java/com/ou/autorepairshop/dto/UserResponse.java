package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.entity.Role;
import com.ou.autorepairshop.entity.User;

import java.util.List;

public record UserResponse(
        Long id,
        String username,
        String email,
        Role role,
        boolean active
) {
    public static UserResponse fromEntity(User user) {
        if (user == null) return null;

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isActive()
        );
    }

    public static List<UserResponse> fromEntities(List<User> users) {
        return users.stream()
                .map(UserResponse::fromEntity)
                .toList();
    }
}