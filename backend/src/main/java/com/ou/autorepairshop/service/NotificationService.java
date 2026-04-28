package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.repository.NotificationConfigRepository;
import com.ou.autorepairshop.repository.NotificationLogRepository;
import com.ou.autorepairshop.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationConfigRepository configRepo;
    private final NotificationLogRepository notificationLogRepository;
    private final EmailService emailService;
    private final PushNotificationService pushNotificationService;

    // ================= MAIN ENTRY =================
    @Transactional
    public void send(NotificationConfig config, Appointment appointment) {

        if (!isConfigActive(config))
            return;
        if (!shouldSend(config, appointment))
            return;
        if (isDuplicate(config, appointment))
            return;

        boolean sent = dispatch(config, appointment);

        if (sent) {
            logNotification(config, appointment);
        }
    }

    // ================= VALIDATION =================

    private boolean isConfigActive(NotificationConfig config) {
        return config.getStatus() == NotificationStatus.ACTIVE;
    }

    private boolean shouldSend(NotificationConfig config, Appointment appointment) {

        // Không gửi nếu CANCELLED ( chỉ gửi push cho khách hàng)
        if (appointment.getStatus() == AppointmentStatus.CANCELLED &&
                config.getEventType() != NotificationEvent.APPOINTMENT_CANCELLED) {

            log.info("Skip: appointment {} is CANCELLED", appointment.getId());
            return false;
        }

        // REMINDER chỉ khi CONFIRMED
        if (config.getEventType() == NotificationEvent.APPOINTMENT_REMINDER &&
                appointment.getStatus() != AppointmentStatus.CONFIRMED) {

            log.info("Skip reminder: appointment {} not CONFIRMED", appointment.getId());
            return false;
        }

        // CONFIRMED phải có employee
        if (config.getEventType() == NotificationEvent.APPOINTMENT_CONFIRMED &&
                appointment.getAssignedEmployee() == null) {

            log.info("Skip confirmed: no employee assigned for {}", appointment.getId());
            return false;
        }

        // Template rỗng
        if (isTemplateEmpty(config)) {
            log.warn("Skip: empty template for event {}", config.getEventType());
            return false;
        }

        return true;
    }

    private boolean isTemplateEmpty(NotificationConfig config) {
        return (isBlank(config.getTemplateEmail()) && isBlank(config.getTemplatePush()));
    }

    private boolean isDuplicate(NotificationConfig config, Appointment appointment) {

        boolean exists = notificationLogRepository
                .existsByAppointmentIdAndEventTypeAndSendTimeOffset(
                        appointment.getId(),
                        config.getEventType(),
                        config.getSendTimeOffset());

        if (exists) {
            log.info("Skip duplicate for appointment {}", appointment.getId());
        }

        return exists;
    }

    // ================= DISPATCH =================

    private boolean dispatch(NotificationConfig config, Appointment appointment) {
        boolean emailSent = sendEmail(config, appointment);
        boolean pushSent = sendPush(config, appointment);
        return emailSent || pushSent;
    }

    // ================= EMAIL =================

    private boolean sendEmail(NotificationConfig config, Appointment appointment) {

        if (!isChannelEnabled(config, NotificationChannel.EMAIL))
            return false;

        String email = extractEmail(appointment);
        if (isBlank(email)) {
            log.warn("Skip email: missing email");
            return false;
        }

        String content = buildContent(config.getTemplateEmail(), appointment);
        if (content.isBlank())
            return false;

        try {
            emailService.sendEmail(email, "Thông báo lịch hẹn", content);
            return true;
        } catch (Exception e) {
            log.error("Email failed", e);
            return false;
        }
    }

    private String extractEmail(Appointment appointment) {
        return (appointment.getCustomer() != null &&
                appointment.getCustomer().getUser() != null)
                        ? appointment.getCustomer().getUser().getEmail()
                        : null;
    }

    // ================= PUSH =================

    private boolean sendPush(NotificationConfig config, Appointment appointment) {

        if (!isChannelEnabled(config, NotificationChannel.PUSH))
            return false;

        User user = extractUser(appointment);
        if (user == null)
            return false;

        String content = buildContent(config.getTemplatePush(), appointment);
        if (content.isBlank())
            return false;

        return sendPushToUser(user, "Thông báo lịch hẹn", content);
    }

    private User extractUser(Appointment appointment) {
        return (appointment.getCustomer() != null)
                ? appointment.getCustomer().getUser()
                : null;
    }

    private boolean sendPushToUser(User user, String title, String body) {

        List<DeviceToken> tokens = user.getDeviceTokens().stream()
                .filter(DeviceToken::isActive)
                .toList();

        if (tokens.isEmpty()) {
            log.warn("User {} has no active tokens", user.getId());
            return false;
        }

        boolean success = false;

        for (DeviceToken dt : tokens) {
            try {
                pushNotificationService.sendPush(
                        dt.getToken(),
                        dt.getDeviceType(),
                        title,
                        body);
                success = true;
            } catch (Exception e) {
                log.error("Push failed for token {}", dt.getToken(), e);
            }
        }

        return success;
    }

    // ================= COMMON =================

    private boolean isChannelEnabled(NotificationConfig config, NotificationChannel channel) {
        return config.getChannels() != null && config.getChannels().contains(channel);
    }

    private void logNotification(NotificationConfig config, Appointment appointment) {
        notificationLogRepository.save(
                NotificationLog.builder()
                        .appointmentId(appointment.getId())
                        .eventType(config.getEventType())
                        .sendTimeOffset(config.getSendTimeOffset())
                        .sentAt(java.time.LocalDateTime.now())
                        .build());
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    // ================= TEMPLATE =================

    private String buildContent(String template, Appointment appointment) {
        if (template == null)
            return "";

        String content = template
                .replace("{name}", resolveName(appointment))
                .replace("{date}", resolveDate(appointment));

        if (content.contains("{reason}")) {
            String note = appointment.getNote();
            String reason = "Không rõ lý do";
            if (note != null && note.contains("Hủy lịch: ")) {
                reason = note.substring(note.lastIndexOf("Hủy lịch: ") + 10).trim();
            } else if (note != null && !note.isBlank()) {
                reason = note;
            }
            content = content.replace("{reason}", reason);
        }

        if (content.contains("{minutes}")) {
            long minutes = 0;
            if (appointment.getAppointmentTime() != null) {
                minutes = ChronoUnit.MINUTES.between(
                        LocalDateTime.now(),
                        appointment.getAppointmentTime());
            }
            content = content.replace("{minutes}", String.valueOf(Math.max(0, minutes)));
        }

        if (content.contains("{licensePlate}")) {
            String plate = (appointment.getVehicle() != null)
                    ? appointment.getVehicle().getLicensePlate()
                    : "Không rõ";
            content = content.replace("{licensePlate}", plate);
        }

        if (content.contains("{vehicleInfo}")) {
            String info = "Xe của bạn";
            if (appointment.getVehicle() != null) {
                String brand = appointment.getVehicle().getBrand() != null ? appointment.getVehicle().getBrand() : "";
                String model = appointment.getVehicle().getModel() != null ? appointment.getVehicle().getModel() : "";
                info = (brand + " " + model).trim();
                if (info.isEmpty())
                    info = "Xe của bạn";
            }
            content = content.replace("{vehicleInfo}", info);
        }

        return content;
    }

    private String resolveName(Appointment appointment) {
        if (appointment.getCustomer() != null)
            return appointment.getCustomer().getName();
        if (appointment.getAssignedEmployee() != null)
            return appointment.getAssignedEmployee().getName();
        return "Khách";
    }

    private String resolveDate(Appointment appointment) {
        return appointment.getAppointmentTime() != null
                ? appointment.getAppointmentTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "";
    }

    // ================= ENTRY BY EVENT =================

    public void sendByEvent(NotificationEvent event, Appointment appointment) {

        List<NotificationConfig> configs = configRepo.findAllByEventType(event);

        if (configs.isEmpty()) {
            log.warn("No config for event {}", event);
            return;
        }

        configs.forEach(config -> send(config, appointment));
    }
}