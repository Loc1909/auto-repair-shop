package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.entity.Role;

public record UserResponse(
        Long id,
        String username,
        String email,
        Role role,
        boolean active,
        EmployeeResponse employee,
        CustomerResponse customer
) {}