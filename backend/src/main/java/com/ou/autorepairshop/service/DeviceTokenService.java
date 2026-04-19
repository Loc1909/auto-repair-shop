package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.DeviceToken;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.enums.DeviceType;
import com.ou.autorepairshop.repository.DeviceTokenRepository;
import com.ou.autorepairshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeviceTokenService {

    private final DeviceTokenRepository deviceTokenRepository;
    private final UserRepository userRepository;

    public void saveToken(Long userId, String token, DeviceType deviceType, String deviceName) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        try {
            DeviceToken existing = deviceTokenRepository.findByToken(token).orElse(null);

            if (existing != null) {
                existing.setUser(user);
                existing.setDeviceType(deviceType);
                existing.setDeviceName(deviceName);
                existing.setActive(true);

                deviceTokenRepository.save(existing);
                log.info("Updated existing token for user {}: {}", userId, token);

            } else {
                DeviceToken dt = DeviceToken.builder()
                        .user(user)
                        .token(token)
                        .deviceType(deviceType)
                        .deviceName(deviceName)
                        .active(true)
                        .build();

                deviceTokenRepository.save(dt);
                log.info("Saved new token for user {}: {}", userId, token);
            }

        } catch (Exception e) {
            log.warn("Duplicate token detected, retry update: {}", token);

            DeviceToken existing = deviceTokenRepository.findByToken(token)
                    .orElseThrow(() -> new RuntimeException("Token exists but cannot fetch"));

            existing.setUser(user);
            existing.setDeviceType(deviceType);
            existing.setDeviceName(deviceName);
            existing.setActive(true);

            deviceTokenRepository.save(existing);
        }
    }

    public void deleteByToken(String token) {
        deviceTokenRepository.deleteByToken(token);
    }
}