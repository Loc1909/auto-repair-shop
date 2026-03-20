package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.PartRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartRequestRepository extends JpaRepository<PartRequest, Long> {
    List<PartRequest> findByRepairOrderId(Long repairOrderId);
    List<PartRequest> findByStatus(String status);
}
