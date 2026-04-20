package com.ou.autorepairshop.service;

import com.ou.autorepairshop.enums.RepairStatus;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.dto.WorkScheduleResponse;
import com.ou.autorepairshop.repository.AppointmentRepository;
import com.ou.autorepairshop.repository.EmployeeRepository;
import com.ou.autorepairshop.repository.RepairOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkScheduleService {

    private final EmployeeRepository employeeRepository;
    private final AppointmentRepository appointmentRepository;
    private final RepairOrderRepository repairOrderRepository;

    private static final List<RepairStatus> ACTIVE_STATUSES = List.of(
            RepairStatus.PENDING, RepairStatus.DIAGNOSING,
            RepairStatus.QUOTING, RepairStatus.APPROVED, RepairStatus.REPAIRING
    );

    @Transactional(readOnly = true)
    public WorkScheduleResponse getSchedule(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", employeeId));

        List<Appointment> appointments = appointmentRepository.findByAssignedEmployeeId(employeeId);
        List<RepairOrder> orders = repairOrderRepository.findByEmployeeId(employeeId);

        List<WorkScheduleResponse.AppointmentSummary> apptSummaries = appointments.stream()
                .map(a -> new WorkScheduleResponse.AppointmentSummary(
                        a.getId(),
                        a.getAppointmentTime(),
                        a.getStatus(),
                        a.getVehicle().getLicensePlate(),
                        a.getCustomer().getName()
                )).toList();

        List<WorkScheduleResponse.RepairOrderSummary> orderSummaries = orders.stream()
                .filter(o -> ACTIVE_STATUSES.contains(o.getStatus()))
                .map(o -> new WorkScheduleResponse.RepairOrderSummary(
                        o.getId(),
                        o.getStatus(),
                        o.getCreatedDate(),
                        o.getVehicle().getLicensePlate()
                )).toList();

        return new WorkScheduleResponse(
                employee.getId(),
                employee.getName(),
                apptSummaries,
                orderSummaries
        );
    }
}
