package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.entity.NotificationEvent;
import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationSchedulerService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    // Chạy mỗi phút
    @Scheduled(fixedRate = 60_000)
    @Transactional  //  cần để session mở và lazy fetch được
    public void sendUpcomingAppointments() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowEnd = now.plusMinutes(1);

        System.out.println("Scheduler running at: " + now);

        // Dùng query join fetch để tránh LazyInitializationException
        List<Appointment> upcomingAppointments = appointmentRepository
                .findAllWithCustomerAndUserByStatusAndTimeBetween(
                        AppointmentStatus.PENDING, now, windowEnd
                );

        System.out.println("Upcoming appointments found: " + upcomingAppointments.size());

        for (Appointment a : upcomingAppointments) {
            String email = a.getCustomer().getUser().getEmail();
            if (email == null) {
                System.err.println("Skipping appointment " + a.getId() + " due to missing email");
                continue;
            }

            System.out.println("Sending notification to: " + email + " for appointment ID: " + a.getId());

            try {
                notificationService.send(
                        NotificationEvent.APPOINTMENT_REMINDER,
                        email,
                        Map.of(
                                "customer_name", a.getCustomer().getName(),
                                "appointment_time", a.getAppointmentTime().toString()
                        )
                );
            } catch (Exception e) {
                System.err.println("Failed to send reminder: " + e.getMessage());
            }
        }
    }
}