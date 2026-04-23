package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.enums.RepairStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RepairOrderRepository extends JpaRepository<RepairOrder, Long> {
    List<RepairOrder> findByEmployeeId(Long employeeId);
    List<RepairOrder> findByVehicleId(Long vehicleId);
    List<RepairOrder> findByStatus(RepairStatus status);
    List<RepairOrder> findByEmployeeIdAndStatus(Long employeeId, RepairStatus status);
    Optional<RepairOrder> findByIdAndVehicleCustomerId(Long repairOrderId, Long customerId);
    List<RepairOrder> findByVehicleCustomerIdOrderByCreatedDateDesc(Long customerId);
}
