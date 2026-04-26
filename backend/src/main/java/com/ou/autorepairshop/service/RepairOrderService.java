package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.*;
import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.enums.AppointmentStatus;
import com.ou.autorepairshop.enums.RepairStatus;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.mapper.RepairOrderMapper;
import com.ou.autorepairshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairOrderService {

    private final RepairOrderRepository repairOrderRepository;
    private final AppointmentRepository appointmentRepository;
    private final RepairProgressRepository repairProgressRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final RepairOrderMapper repairOrderMapper;

    @Transactional
    public RepairOrderResponse receiveVehicle(ReceiveVehicleRequest req) {
        Appointment appointment = appointmentRepository.findById(req.appointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", req.appointmentId()));

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new BusinessException(
                    "Only CONFIRMED appointments can be received. Current status: " + appointment.getStatus());
        }

        Employee employee = employeeRepository.findById(req.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", req.employeeId()));

        appointment.setStatus(AppointmentStatus.RECEIVED);
        appointmentRepository.save(appointment);

        RepairOrder order = RepairOrder.builder()
                .vehicle(appointment.getVehicle())
                .employee(employee)
                .appointment(appointment)
                .status(RepairStatus.PENDING)
                .notes(req.notes())
                .createdDate(LocalDateTime.now())
                .build();

        return repairOrderMapper.toResponse(repairOrderRepository.save(order));
    }

    @Transactional
    public RepairOrderResponse completeRepair(Long orderId, CompleteRepairRequest req) {
        RepairOrder order = findOrderById(orderId);

        if (order.getStatus() == RepairStatus.COMPLETED) {
            throw new BusinessException("Repair order is already completed.");
        }

        if (req.notes() != null && !req.notes().isBlank()) {
            order.setNotes(req.notes());
        }
        order.setStatus(RepairStatus.COMPLETED);
        order.setCompletedDate(LocalDateTime.now());

        return repairOrderMapper.toResponse(repairOrderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public RepairOrderResponse getById(Long id) {
        return repairOrderMapper.toResponse(findOrderById(id));
    }

    @Transactional(readOnly = true)
    public List<RepairOrderResponse> getByEmployee(Long employeeId) {
        return repairOrderRepository.findByEmployeeId(employeeId)
                .stream().map(repairOrderMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<RepairOrderResponse> getAll() {
        return repairOrderRepository.findAll()
                .stream().map(repairOrderMapper::toResponse).toList();
    }

    private RepairOrder findOrderById(Long id) {
        return repairOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder", id));
    }

    private RepairProgressResponse mapToResponse(RepairProgress p) {
        return new RepairProgressResponse(
                p.getId(),
                p.getStatus().name(),
                p.getNote(),
                p.getUpdateTime(),
                p.getRepairOrder().getId()
        );
    }

    @Transactional(readOnly = true)
    public List<RepairProgressResponse> getMyTracking(Long repairOrderId) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        RepairOrder order = repairOrderRepository
                .findByIdAndVehicleCustomerId(repairOrderId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder", repairOrderId));

        return repairProgressRepository
                .findByRepairOrderIdOrderByUpdateTimeAsc(order.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RepairOrderResponse> getMyRepairOrders() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        List<RepairOrder> repairOrders =
                repairOrderRepository.findAllByCustomerId(customer.getId());

        return repairOrders.stream()
                .map(repairOrderMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RepairOrderResponse getByAppointmentId(Long appointmentId) {
        RepairOrder repairOrders = repairOrderRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder not found"));
        return repairOrderMapper.toResponse(repairOrders);
    }
}
