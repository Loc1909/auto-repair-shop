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

        var configs = configRepository.findAllByEventType(NotificationEvent.APPOINTMENT_REMINDER);

        for (var config : configs) {

            int offset = config.getSendTimeOffset();

            LocalDateTime targetTime = now.minusMinutes(offset);

            LocalDateTime start = targetTime.minusMinutes(1);
            LocalDateTime end = targetTime.plusMinutes(1);

            var appointments = appointmentRepository.findAppointmentsForReminder(
                    AppointmentStatus.CONFIRMED,
                    start,
                    end
            );

            for (var a : appointments) {

                if (a.getCustomer() == null || a.getCustomer().getUser() == null) continue;

                System.out.println("Send reminder for appointment " + a.getId());

                notificationService.send(config, a);
            }
        }
    }
}