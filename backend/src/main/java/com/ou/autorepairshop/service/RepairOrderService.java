package com.ou.autorepairshop.service;

import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.dto.CompleteRepairRequest;
import com.ou.autorepairshop.dto.ReceiveVehicleRequest;
import com.ou.autorepairshop.dto.RepairOrderResponse;
import com.ou.autorepairshop.repository.AppointmentRepository;
import com.ou.autorepairshop.repository.EmployeeRepository;
import com.ou.autorepairshop.repository.RepairOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairOrderService {

    private final RepairOrderRepository repairOrderRepository;
    private final AppointmentRepository appointmentRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public RepairOrderResponse receiveVehicle(ReceiveVehicleRequest req) {
        Appointment appointment = appointmentRepository.findById(req.appointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", req.appointmentId()));

        if (!"PENDING".equals(appointment.getStatus()) && !"CONFIRMED".equals(appointment.getStatus())) {
            throw new BusinessException("Appointment is not in a receivable state: " + appointment.getStatus());
        }

        Employee employee = employeeRepository.findById(req.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", req.employeeId()));

        appointment.setStatus("IN_PROGRESS");
        appointmentRepository.save(appointment);

        RepairOrder order = RepairOrder.builder()
                .vehicle(appointment.getVehicle())
                .employee(employee)
                .appointment(appointment)
                .status("PENDING")
                .notes(req.notes())
                .createdDate(LocalDateTime.now())
                .build();

        return toResponse(repairOrderRepository.save(order));
    }

    @Transactional
    public RepairOrderResponse completeRepair(Long orderId, CompleteRepairRequest req) {
        RepairOrder order = findOrderById(orderId);

        if ("COMPLETED".equals(order.getStatus())) {
            throw new BusinessException("Repair order is already completed.");
        }

        if (req.notes() != null && !req.notes().isBlank()) {
            order.setNotes(req.notes());
        }
        order.setStatus("COMPLETED");
        order.setCompletedDate(LocalDateTime.now());

        return toResponse(repairOrderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public RepairOrderResponse getById(Long id) {
        return toResponse(findOrderById(id));
    }

    @Transactional(readOnly = true)
    public List<RepairOrderResponse> getByEmployee(Long employeeId) {
        return repairOrderRepository.findByEmployeeId(employeeId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<RepairOrderResponse> getAll() {
        return repairOrderRepository.findAll().stream().map(this::toResponse).toList();
    }

    private RepairOrder findOrderById(Long id) {
        return repairOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder", id));
    }

    public RepairOrderResponse toResponse(RepairOrder o) {
        return new RepairOrderResponse(
                o.getId(),
                o.getStatus(),
                o.getCreatedDate(),
                o.getCompletedDate(),
                o.getNotes(),
                o.getVehicle().getId(),
                o.getVehicle().getLicensePlate(),
                o.getVehicle().getBrand(),
                o.getVehicle().getModel(),
                o.getEmployee().getId(),
                o.getEmployee().getName(),
                o.getAppointment() != null ? o.getAppointment().getId() : null
        );
    }
}
