package com.ou.autorepairshop.service;

import com.ou.autorepairshop.enums.DeviceType;
import com.google.firebase.messaging.*;
import com.ou.autorepairshop.repository.DeviceTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PushNotificationService {

    private final DeviceTokenRepository deviceTokenRepository;

    private static final int BATCH_SIZE = 500;

    // ================= GỬI 1 DEVICE =================
    public void sendPush(String token, DeviceType deviceType, String title, String body) {
        if (token == null || token.isBlank()) {
            log.warn("Token is null or empty");
            return;
        }

        switch (deviceType) {
            case WEB -> sendWebPush(token, title, body);
            case ANDROID, IOS -> sendMobilePush(token, title, body);
        }
    }

    // ================= GỬI NHIỀU DEVICE =================
    @Transactional
    public void sendPushToMultiple(List<String> tokens, DeviceType deviceType, String title, String body) {
        if (tokens == null || tokens.isEmpty()) {
            log.warn("Token list is empty");
            return;
        }

        List<String> validTokens = tokens.stream()
                .filter(t -> t != null && !t.isBlank())
                .toList();

        if (validTokens.isEmpty()) {
            log.warn("No valid tokens to send");
            return;
        }

        if (deviceType == DeviceType.WEB) {
            validTokens.forEach(token -> sendWebPush(token, title, body));
        } else {
            // Mobile batch <= 500
            for (int i = 0; i < validTokens.size(); i += BATCH_SIZE) {
                int end = Math.min(i + BATCH_SIZE, validTokens.size());
                List<String> batch = validTokens.subList(i, end);
                sendMobileBatch(batch, title, body);
            }
        }
    }

    // ================= PRIVATE METHODS =================

    /** Gửi push cho Android/iOS */
    private void sendMobilePush(String token, String title, String body) {
        try {
            Message message = buildMessage(token, title, body);

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Mobile push sent successfully: {}", response);

        } catch (FirebaseMessagingException e) {
            handleFirebaseError(token, e);
        }
    }

    /** Gửi batch mobile push */
    private void sendMobileBatch(List<String> tokens, String title, String body) {
        try {
            MulticastMessage message = MulticastMessage.builder()
                    .addAllTokens(tokens)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putData("type", "GENERAL")
                    .build();

            BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);

            log.info("Batch sent: success={} fail={}",
                    response.getSuccessCount(),
                    response.getFailureCount());

            for (int i = 0; i < response.getResponses().size(); i++) {
                SendResponse r = response.getResponses().get(i);

                if (!r.isSuccessful()) {
                    FirebaseMessagingException ex = r.getException();
                    handleFirebaseError(tokens.get(i), ex);
                }
            }

        } catch (FirebaseMessagingException e) {
            log.error("Error sending mobile batch push", e);
        }
    }

    /** Gửi Web push */
    private void sendWebPush(String token, String title, String body) {
        try {
            Message message = buildMessage(token, title, body);

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Web push sent successfully: {}", response);

        } catch (FirebaseMessagingException e) {
            handleFirebaseError(token, e);
        }
    }

    // ================= COMMON BUILDER =================

    private Message buildMessage(String token, String title, String body) {
        return Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .setWebpushConfig(WebpushConfig.builder()
                        .putHeader("Urgency", "high")
                        .setNotification(WebpushNotification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .setIcon("/icon.png")
                                .build())
                        .build())
                .putData("type", "GENERAL")
                .putData("click_action", "/admin")
                .build();
    }

    // ================= ERROR HANDLER =================

    private void handleFirebaseError(String token, FirebaseMessagingException e) {
        log.error("Push error for token={}", token, e);

        if (e.getMessagingErrorCode() != null) {
            String code = e.getMessagingErrorCode().name();

            if (code.equals("UNREGISTERED") || code.equals("INVALID_ARGUMENT")) {
                log.warn("Removing invalid token: {}", token);

                try {
                    deviceTokenRepository.deleteByToken(token);
                } catch (Exception ex) {
                    log.error("Failed to delete invalid token: {}", token, ex);
                }
            }
        }
    }
}