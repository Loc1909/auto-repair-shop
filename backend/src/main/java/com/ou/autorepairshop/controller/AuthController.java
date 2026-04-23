package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.AuthResponse;
import com.ou.autorepairshop.dto.LoginRequest;
import com.ou.autorepairshop.dto.UserRegisterRequest;
import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegisterRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        UserResponse user = authService.getCurrentUser(authentication);
        return ResponseEntity.ok(user);

    }
}
