package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.NotificationEvent;
import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.repository.AppointmentRepository;
import com.ou.autorepairshop.repository.NotificationConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationSchedulerService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    private final NotificationConfigRepository configRepository;

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void sendUpcomingAppointments() {

        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        System.out.println("Scheduler running at: " + now);

        var configs = configRepository.findAllByEventType(NotificationEvent.APPOINTMENT_REMINDER);

        var appointments = appointmentRepository.findAllWithCustomerAndUserByStatus(
                AppointmentStatus.PENDING
        );

        for (var config : configs) {

            int offset = config.getSendTimeOffset();

            for (var a : appointments) {

                LocalDateTime appointmentTime = a.getAppointmentTime()
                        .withSecond(0)
                        .withNano(0);

                long secondsDiff = java.time.Duration
                        .between(now, appointmentTime)
                        .getSeconds();

                long targetSeconds = Math.abs(offset) * 60;

                // check đúng thời điểm gửi
                if (Math.abs(secondsDiff - targetSeconds) > 30) continue;

                // check user tồn tại
                if (a.getCustomer() == null ||
                        a.getCustomer().getUser() == null) continue;

                System.out.println("Send offset " + offset + " for appointment " + a.getId());
                notificationService.send(config, a);
            }
        }
    }
}