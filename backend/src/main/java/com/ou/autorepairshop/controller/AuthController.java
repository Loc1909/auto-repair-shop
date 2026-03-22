package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.AuthResponse;
import com.ou.autorepairshop.dto.LoginRequest;
import com.ou.autorepairshop.dto.UserRegisterRequest;
import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRegisterRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request));
    }
}
