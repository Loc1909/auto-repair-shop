package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserAdminRequest {

    @NotBlank(message = "Username không được để trống")
    @Pattern(
            regexp = "^[a-z0-9]+$",
            message = "Username chỉ chứa chữ thường và số"
    )
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password phải >= 6 ký tự")
    private String password;

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotNull(message = "Role không được để trống")
    private Role role;
}