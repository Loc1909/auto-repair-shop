package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.RepairOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RepairOrderDetailRepository extends JpaRepository<RepairOrderDetail, Long> {
    List<RepairOrderDetail> findByRepairOrderId(Long repairOrderId);

    Optional<RepairOrderDetail> findByRepairOrderIdAndServiceId(Long repairOrderId, Long serviceId);

    @Query("""
        SELECT r FROM RepairOrderDetail r
        LEFT JOIN FETCH r.service
        LEFT JOIN FETCH r.part
        WHERE r.repairOrder.id = :repairOrderId
    """)
    List<RepairOrderDetail> findFullByRepairOrderId(Long repairOrderId);

    @Query("""
        SELECT 
            COALESCE(r.service.name, r.part.name), 
            SUM(r.quantity * r.price)
        FROM RepairOrderDetail r
        GROUP BY COALESCE(r.service.name, r.part.name)
        ORDER BY SUM(r.quantity * r.price) DESC
    """)
    List<Object[]> getRevenueByService();
}