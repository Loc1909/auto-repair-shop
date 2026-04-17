package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.repository.NotificationConfigRepository;
import com.ou.autorepairshop.repository.NotificationLogRepository;
import com.ou.autorepairshop.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationConfigRepository configRepo;
    private final NotificationLogRepository notificationLogRepository;
    private final EmailService emailService;
    private final PushNotificationService pushNotificationService;
    private final UserRepository userRepository;

    // ================= MAIN SEND =================
    @Transactional
    public void send(NotificationConfig config, Appointment appointment) {
        if (config.getStatus() != NotificationStatus.ACTIVE) return;

        int offset = config.getSendTimeOffset();

        // Check duplicate
        boolean alreadySent = notificationLogRepository
                .existsByAppointmentIdAndEventTypeAndSendTimeOffset(
                        appointment.getId(),
                        config.getEventType(),
                        offset
                );

        if (alreadySent) {
            log.info("Skip duplicate notification for appointment {}", appointment.getId());
            return;
        }

        // SEND CHANNELS
        sendEmailIfNeeded(config, appointment);
        sendPushIfNeeded(config, appointment);

        // LOG
        notificationLogRepository.save(
                NotificationLog.builder()
                        .appointmentId(appointment.getId())
                        .eventType(config.getEventType())
                        .sendTimeOffset(offset)
                        .sentAt(java.time.LocalDateTime.now())
                        .build()
        );
    }

    // ================= SEND EMAIL =================
    private void sendEmailIfNeeded(NotificationConfig config, Appointment appointment) {
        if (config.getChannels() == null || !config.getChannels().contains(NotificationChannel.EMAIL)) return;

        String email = appointment.getCustomer() != null &&
                appointment.getCustomer().getUser() != null
                ? appointment.getCustomer().getUser().getEmail()
                : null;

        if (email == null || email.isBlank()) {
            log.warn("Skip sending email: missing email");
            return;
        }

        String content = buildContent(config.getTemplateEmail(), appointment);

        try {
            emailService.sendEmail(email, "Thông báo lịch hẹn", content);
        } catch (Exception e) {
            log.error("Email failed", e);
        }
    }

    // ================= SEND PUSH =================
    private void sendPushIfNeeded(NotificationConfig config, Appointment appointment) {
        if (config.getChannels() == null || !config.getChannels().contains(NotificationChannel.PUSH)) return;

        if (appointment.getCustomer() == null || appointment.getCustomer().getUser() == null) return;

        User user = appointment.getCustomer().getUser();
        String content = buildContent(config.getTemplatePush(), appointment);

        sendPushToUser(user, "Thông báo lịch hẹn", content);
    }

    private void sendPushToUser(User user, String title, String body) {
        List<DeviceToken> tokens = user.getDeviceTokens().stream()
                .filter(DeviceToken::isActive)
                .toList();

        if (tokens.isEmpty()) {
            log.warn("User {} has no active tokens", user.getId());
            return;
        }

        for (DeviceToken dt : tokens) {
            try {
                pushNotificationService.sendPush(
                        dt.getToken(),
                        dt.getDeviceType(),
                        title,
                        body
                );
            } catch (Exception e) {
                log.error("Push failed for token {}", dt.getToken(), e);
            }
        }
    }

    // ================= TEMPLATE =================
    private String buildContent(String template, Appointment appointment) {
        if (template == null) return "";

        String result = template;

        // Lấy tên: ưu tiên Customer, nếu trống thì Employee
        String name = appointment.getCustomer() != null
                ? appointment.getCustomer().getName()
                : appointment.getAssignedEmployee() != null
                ? appointment.getAssignedEmployee().getName()
                : "Khách";

        // Lấy ngày giờ lịch hẹn
        String date = appointment.getAppointmentTime() != null
                ? appointment.getAppointmentTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "";

        // Thay placeholder
        result = result.replace("{name}", name)
                .replace("{date}", date);

        return result;
    }

    // ================= SEND BY EVENT =================
    public void sendByEvent(NotificationEvent event, Appointment appointment) {
        List<NotificationConfig> configs = configRepo.findAllByEventType(event);

        if (configs.isEmpty()) {
            log.warn("No config for event {}", event);
            return;
        }

        for (NotificationConfig config : configs) {
            send(config, appointment);
        }
    }
}