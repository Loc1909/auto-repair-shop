package com.ou.autorepairshop.service;

import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Transactional
    public Appointment confirmAppointment(Long id) {
        Appointment appointment = findById(id);

        if (AppointmentStatus.PENDING != appointment.getStatus()) {
            throw new BusinessException(
                "Cannot confirm appointment with status: " + appointment.getStatus()
                + ". Only PENDING appointments can be confirmed."
            );
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment cancelAppointment(Long id, String reason) {
        Appointment appointment = findById(id);

        if (AppointmentStatus.RECEIVED == appointment.getStatus()) {
            throw new BusinessException("Cannot cancel an appointment that is already RECEIVED.");
        }
        if (AppointmentStatus.CANCELLED == appointment.getStatus()) {
            throw new BusinessException("Appointment is already cancelled.");
        }

        if (reason != null && !reason.isBlank()) {
            String updatedNote = (appointment.getNote() != null ? appointment.getNote() + " | " : "")
                    + "Hủy lịch: " + reason;
            appointment.setNote(updatedNote);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appointment);
    }

    private Appointment findById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
    }
}
