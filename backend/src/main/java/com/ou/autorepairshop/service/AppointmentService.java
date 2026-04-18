package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.*;
import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.mapper.AppointmentMapper;
import com.ou.autorepairshop.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;

    // ================= CREATE =================
    @Transactional
    public AppointmentResponse makeAppointment(AppointmentCreateRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", request.customerId()));

        Vehicle vehicle = vehicleRepository.findById(request.vehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", request.vehicleId()));

        Appointment appointment = new Appointment();
        appointment.setAppointmentTime(request.appointmentTime());
        appointment.setNote(request.note());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setCustomer(customer);
        appointment.setVehicle(vehicle);
        appointment.setAssignedEmployee(null);

        appointmentRepository.save(appointment);
        return appointmentMapper.toResponse(appointment);
    }

    // ================= CONFIRM (CUSTOMER FLOW) =================
    @Transactional
    public AppointmentResponse confirmAppointment(Long id) {
        Appointment appointment = findById(id);

        if (AppointmentStatus.PENDING != appointment.getStatus()) {
            throw new BusinessException(
                    "Cannot confirm appointment with status: " + appointment.getStatus()
            );
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        Appointment saved = appointmentRepository.save(appointment);

        sendNotificationSafe(
                NotificationEvent.APPOINTMENT_CONFIRMED,
                saved,
                Map.of()
        );

        return appointmentMapper.toResponse(saved);
    }

    // ================= CONFIRM (EMPLOYEE FLOW) =================
    @Transactional
    public AppointmentResponseForEmployee confirmAppointmentByEmployee(Long id, Long employeeId) {
        Appointment appointment = findById(id);

        if (AppointmentStatus.PENDING != appointment.getStatus()) {
            throw new BusinessException(
                    "Cannot confirm appointment with status: " + appointment.getStatus()
            );
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", employeeId));

        appointment.setAssignedEmployee(employee);
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        Appointment saved = appointmentRepository.save(appointment);

        sendNotificationSafe(
                NotificationEvent.APPOINTMENT_CONFIRMED,
                saved,
                Map.of(
                        "customer_name", safe(saved.getCustomer().getName()),
                        "appointment_time", safe(saved.getAppointmentTime())
                )
        );

        return appointmentMapper.toResponseForEmployee(saved);
    }

    // ================= CANCEL (CUSTOMER FLOW) =================
    @Transactional
    public AppointmentResponse cancelAppointment(Long id, String reason) {
        Appointment appointment = findById(id);

        validateCancelable(appointment);

        appendCancelReason(appointment, reason);

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);

        sendNotificationSafe(
                NotificationEvent.APPOINTMENT_CANCELLED,
                saved,
                Map.of("reason", safe(reason))
        );

        return appointmentMapper.toResponse(saved);
    }

    // ================= CANCEL (EMPLOYEE FLOW) =================
    @Transactional
    public AppointmentResponseForEmployee cancelAppointmentByEmployee(Long id, String reason) {
        Appointment appointment = findById(id);

        validateCancelable(appointment);

        appendCancelReason(appointment, reason);

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);

        sendNotificationSafe(
                NotificationEvent.APPOINTMENT_CANCELLED,
                saved,
                Map.of(
                        "customer_name", safe(saved.getCustomer().getName()),
                        "reason", safe(reason)
                )
        );

        return appointmentMapper.toResponseForEmployee(saved);
    }

    // ================= GET =================
    @Transactional(readOnly = true)
    public List<AppointmentResponseForEmployee> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(appointmentMapper::toResponseForEmployee)
                .toList();
    }

    // ================= HELPER =================

    private void validateCancelable(Appointment appointment) {
        if (AppointmentStatus.RECEIVED == appointment.getStatus()) {
            throw new BusinessException("Cannot cancel an appointment that is already RECEIVED.");
        }
        if (AppointmentStatus.CANCELLED == appointment.getStatus()) {
            throw new BusinessException("Appointment is already cancelled.");
        }
    }

    private void appendCancelReason(Appointment appointment, String reason) {
        if (reason != null && !reason.isBlank()) {
            String updatedNote = (appointment.getNote() != null ? appointment.getNote() + " | " : "")
                    + "Hủy lịch: " + reason;
            appointment.setNote(updatedNote);
        }
    }

    private void sendNotificationSafe(NotificationEvent event,
                                      Appointment appointment,
                                      Map<String, String> data) {
        try {
            if (appointment.getCustomer() == null ||
                    appointment.getCustomer().getUser() == null ||
                    appointment.getCustomer().getUser().getEmail() == null) {

                System.err.println("Skip sending notification: missing email");
                return;
            }

            notificationService.sendByEvent(
                    event,
                    appointment.getCustomer().getUser().getEmail(),
                    data,
                    appointment.getId()
            );

        } catch (Exception e) {
            System.err.println("Send notification failed: " + e.getMessage());
        }
    }

    private String safe(Object value) {
        return value != null ? value.toString() : "";
    }

    private Appointment findById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
    }
}