package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.entity.NotificationEvent;
import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.repository.AppointmentRepository;
import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.mapper.AppointmentMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    private final AppointmentMapper appointmentMapper;

    // ================= CONFIRM =================
    @Transactional
    public AppointmentResponse confirmAppointment(Long id) {
        Appointment appointment = findById(id);

        if (AppointmentStatus.PENDING != appointment.getStatus()) {
            throw new BusinessException(
                    "Cannot confirm appointment with status: " + appointment.getStatus()
                            + ". Only PENDING appointments can be confirmed."
            );
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        Appointment saved = appointmentRepository.save(appointment);

        // Gửi notification
        sendNotificationSafe(NotificationEvent.APPOINTMENT_CONFIRMED, saved);

        return appointmentMapper.toResponse(saved);
    }

    // ================= CANCEL =================
    @Transactional
    public AppointmentResponse cancelAppointment(Long id, String reason) {
        Appointment appointment = findById(id);

        if (AppointmentStatus.RECEIVED == appointment.getStatus()) {
            throw new BusinessException("Cannot cancel an appointment that is already RECEIVED.");
        }

        if (AppointmentStatus.CANCELLED == appointment.getStatus()) {
            throw new BusinessException("Appointment is already cancelled.");
        }

        // Ghi lý do vào note
        if (reason != null && !reason.isBlank()) {
            String updatedNote = (appointment.getNote() != null ? appointment.getNote() + " | " : "")
                    + "Hủy lịch: " + reason;
            appointment.setNote(updatedNote);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);

        // Gửi notification
        sendNotificationSafe(NotificationEvent.APPOINTMENT_CANCELLED, saved);

        return appointmentMapper.toResponse(saved);
    }

    // ================= HELPER SEND =================
    private void sendNotificationSafe(NotificationEvent event, Appointment appointment) {
        try {
            // Kiểm tra có user để push/email không
            if (appointment.getCustomer() == null ||
                    appointment.getCustomer().getUser() == null) {

                System.err.println("Skip sending notification: missing user");
                return;
            }

            // Gửi notification (email + push)
            notificationService.sendByEvent(event, appointment);

        } catch (Exception e) {
            System.err.println("Send notification failed: " + e.getMessage());
        }
    }

    // ================= FIND =================
    private Appointment findById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
    }
}