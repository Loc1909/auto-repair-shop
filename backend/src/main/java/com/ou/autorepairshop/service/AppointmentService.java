package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.*;

import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.mapper.AppointmentMapper;
import com.ou.autorepairshop.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;

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

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByCustomer(Long customerId) {

        List<Appointment> appointments =
                appointmentRepository.findByCustomerIdOrderByAppointmentTimeDesc(customerId);

        return appointmentMapper.toResponseList(appointments);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getMyAppointments() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return appointmentMapper.toResponseList(
                appointmentRepository.findByCustomerUserId(user.getId())
        );
    }

    // ================= CONFIRM (CUSTOMER FLOW) =================
    @Transactional
    public AppointmentResponse confirmAppointment(Long id) {

        Appointment appointment = findById(id);

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BusinessException(
                    "Cannot confirm appointment with status: " + appointment.getStatus()
                            + ". Only PENDING appointments can be confirmed."
            );
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        Appointment saved = appointmentRepository.save(appointment);

        sendNotificationSafe(NotificationEvent.APPOINTMENT_CONFIRMED, saved);

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
                saved
        );

        return appointmentMapper.toResponseForEmployee(saved);
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long id, String reason) {

        Appointment appointment = findById(id);

        if (appointment.getStatus() == AppointmentStatus.RECEIVED) {
            throw new BusinessException("Cannot cancel an appointment that is already RECEIVED.");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new BusinessException("Appointment is already cancelled.");
        }

        if (reason != null && !reason.isBlank()) {
            String updatedNote = (appointment.getNote() != null ? appointment.getNote() + " | " : "")
                    + "Hủy lịch: " + reason;
            appointment.setNote(updatedNote);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);

        sendNotificationSafe(NotificationEvent.APPOINTMENT_CANCELLED, saved);

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
                saved
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

    private void sendNotificationSafe(NotificationEvent event, Appointment appointment) {
        try {
            if (appointment.getCustomer() == null ||
                    appointment.getCustomer().getUser() == null) {

                System.err.println("Skip notification: missing user");
                return;
            }

            notificationService.sendByEvent(event, appointment);

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