package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByAssignedEmployeeId(Long employeeId);
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByVehicleId(Long vehicleId);
}
