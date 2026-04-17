package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.DeviceTokenRequest;
import com.ou.autorepairshop.enums.DeviceType;
import com.ou.autorepairshop.service.DeviceTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/device-token")
@RequiredArgsConstructor
public class DeviceTokenController {

    private final DeviceTokenService deviceTokenService;

    @PostMapping
    public void saveToken(@RequestBody DeviceTokenRequest request) {

        if (request.getToken() == null || request.getToken().isBlank()) {
            throw new RuntimeException("Token must not be empty");
        }

        DeviceType type;
        try {
            type = DeviceType.valueOf(request.getDeviceType().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid device type");
        }

        deviceTokenService.saveToken(
                request.getUserId(), // 👈 dùng lại Long
                request.getToken(),
                type,
                request.getDeviceName()
        );
    }
}