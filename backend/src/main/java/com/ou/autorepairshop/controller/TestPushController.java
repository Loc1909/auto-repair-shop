package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.entity.DeviceToken;
import com.ou.autorepairshop.enums.DeviceType;
import com.ou.autorepairshop.repository.DeviceTokenRepository;
import com.ou.autorepairshop.service.PushNotificationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestPushController {

    private final PushNotificationService pushNotificationService;
    private final DeviceTokenRepository deviceTokenRepository;

    // ================= 1. GỬI CHO 1 USER =================
    @GetMapping("/push/user/{userId}")
    @Transactional
    public String pushToUser(@PathVariable Long userId) {

        List<String> tokens = deviceTokenRepository
                .findByUserIdAndActiveTrue(userId)
                .stream()
                .map(DeviceToken::getToken)
                .toList();

        if (tokens.isEmpty()) {
            return "User không có token!";
        }

        pushNotificationService.sendPushToMultiple(
                tokens,
                DeviceType.WEB,
                "Test 🚀",
                "Hello từ backend (user)"
        );

        return "Sent push to user!";
    }

    // ================= 2. GỬI CHO TẤT CẢ =================
    @PostMapping("/push/all")
    @Transactional
    public String pushToAll() {

        List<String> tokens = deviceTokenRepository
                .findByActiveTrue()
                .stream()
                .map(DeviceToken::getToken)
                .toList();

        if (tokens.isEmpty()) {
            return "Không có token nào!";
        }

        pushNotificationService.sendPushToMultiple(
                tokens,
                DeviceType.WEB,
                "Broadcast",
                "Hello tất cả user"
        );

        return "Sent push to all!";
    }

    // ================= 3. GỬI TRỰC TIẾP TOKEN =================

    @PostMapping("/push/custom")
    @Transactional
    public String pushCustom(@RequestBody WebPushRequest request) {

        pushNotificationService.sendPush(
                request.getToken(),
                DeviceType.WEB,
                request.getTitle(),
                request.getBody()
        );

        return "Sent custom push!";
    }

    // ================= DTO =================
    @Data
    public static class WebPushRequest {
        private String token;
        private String title;
        private String body;
    }
}