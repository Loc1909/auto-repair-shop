package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByAssignedEmployeeId(Long employeeId);
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByVehicleId(Long vehicleId);
    List<Appointment> findByCustomerIdOrderByAppointmentTimeDesc(Long customerId);
    List<Appointment> findByCustomerUserId(Long userId);
    List<Appointment> findAllByStatusAndAppointmentTimeBetween(
            AppointmentStatus status,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.customer c " +
            "JOIN FETCH c.user " +
            "WHERE a.status = :status")
    List<Appointment> findAllWithCustomerAndUserByStatus(
            @Param("status") AppointmentStatus status
    );
}
