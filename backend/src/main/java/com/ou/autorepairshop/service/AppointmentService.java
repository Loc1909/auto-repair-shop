package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.AppointmentCreateRequest;
import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.dto.AppointmentResponseForEmployee;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.entity.Vehicle;
import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.mapper.AppointmentMapper;
import com.ou.autorepairshop.repository.AppointmentRepository;
import com.ou.autorepairshop.repository.CustomerRepository;
import com.ou.autorepairshop.repository.EmployeeRepository;
import com.ou.autorepairshop.repository.VehicleRepository;
import com.ou.autorepairshop.entity.NotificationEvent;
import com.ou.autorepairshop.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.mapper.AppointmentMapper;

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

    @Transactional
    public AppointmentResponse makeAppointment(AppointmentCreateRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Vehicle vehicle = vehicleRepository.findById(request.vehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

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

    @Transactional
    public AppointmentResponseForEmployee confirmAppointment(Long id, Long employeeId) {
        Appointment appointment = findById(id);

        if (AppointmentStatus.PENDING != appointment.getStatus()) {
            throw new BusinessException(
                    "Cannot confirm appointment with status: " + appointment.getStatus()
                            + ". Only PENDING appointments can be confirmed.");
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
                        "appointment_time", safe(saved.getAppointmentTime())));

        return appointmentMapper.toResponseForEmployee(saved);
    }

    @Transactional
    public AppointmentResponseForEmployee cancelAppointment(Long id, String reason) {
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
        Appointment saved = appointmentRepository.save(appointment);

        sendNotificationSafe(
                NotificationEvent.APPOINTMENT_CANCELLED,
                saved,
                Map.of(
                        "customer_name", safe(saved.getCustomer().getName()),
                        "reason", (reason != null && !reason.isBlank()) ? reason : "Không có"));

        return appointmentMapper.toResponseForEmployee(saved);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponseForEmployee> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(appointmentMapper::toResponseForEmployee)
                .toList();
    }


    // ================= HELPER =================

    private void sendNotificationSafe(NotificationEvent event, Appointment appointment, Map<String, String> data) {
        try {
            if (appointment.getCustomer() == null ||
                    appointment.getCustomer().getUser() == null ||
                    appointment.getCustomer().getUser().getEmail() == null) {

                System.err.println("Skip sending mail: missing email");
                return;
            }

            notificationService.sendByEvent(
                    event,
                    appointment.getCustomer().getUser().getEmail(),
                    data,
                    appointment.getId()
            );

        } catch (Exception e) {
            System.err.println("Send mail failed: " + e.getMessage());
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