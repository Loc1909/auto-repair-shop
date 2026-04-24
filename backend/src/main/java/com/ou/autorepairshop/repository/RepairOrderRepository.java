package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.enums.RepairStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RepairOrderRepository extends JpaRepository<RepairOrder, Long> {
    List<RepairOrder> findByEmployeeId(Long employeeId);
    List<RepairOrder> findByVehicleId(Long vehicleId);
    List<RepairOrder> findByStatus(RepairStatus status);
    List<RepairOrder> findByEmployeeIdAndStatus(Long employeeId, RepairStatus status);
    Optional<RepairOrder> findByIdAndVehicleCustomerId(Long repairOrderId, Long customerId);
    List<RepairOrder> findByVehicleCustomerIdOrderByCreatedDateDesc(Long customerId); // chậm hơn, N+1 query
    @Query("""
                SELECT ro FROM RepairOrder ro
                JOIN FETCH ro.vehicle v
                JOIN FETCH v.customer c
                WHERE c.id = :customerId
                ORDER BY ro.createdDate DESC
            """)
    List<RepairOrder> findAllByCustomerId(Long customerId);
}
