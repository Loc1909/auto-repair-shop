package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.repository.NotificationConfigRepository;
import com.ou.autorepairshop.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationConfigRepository configRepo;
    private final NotificationLogRepository notificationLogRepository;
    private final EmailService emailService;

    public void send(NotificationConfig config,
                     String email,
                     Map<String, String> data,
                     Long appointmentId) {

        if (config.getStatus() != NotificationStatus.ACTIVE)
            return;

        int offset = config.getSendTimeOffset();

        boolean alreadySent = notificationLogRepository
                .existsByAppointmentIdAndEventTypeAndSendTimeOffset(
                        appointmentId,
                        config.getEventType(),
                        offset
                );

        if (alreadySent) {
            System.out.println("Already sent for appointment " + appointmentId + " offset " + offset);
            return;
        }

        String content = buildContent(config.getTemplate(), data);

        try {
            if (config.getChannels() != null &&
                    config.getChannels().contains(NotificationChannel.EMAIL)) {

                emailService.sendEmail(email, "Notification", content);
            }

            notificationLogRepository.save(
                    NotificationLog.builder()
                            .appointmentId(appointmentId)
                            .eventType(config.getEventType())
                            .sendTimeOffset(offset)
                            .sentAt(LocalDateTime.now())
                            .build()
            );

        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }

    private String buildContent(String template, Map<String, String> data) {
        String result = template;
        for (Map.Entry<String, String> entry : data.entrySet()) {
            result = result.replace("{" + entry.getKey() + "}", entry.getValue());
        }
        return result;
    }

    public void sendByEvent(NotificationEvent event,
                            String email,
                            Map<String, String> data,
                            Long appointmentId) {

        List<NotificationConfig> configs = configRepo.findAllByEventType(event);

        if (configs.isEmpty()) {
            System.out.println("No config for event: " + event);
            return;
        }

        for (NotificationConfig config : configs) {
            send(config, email, data, appointmentId);
        }
    }
}