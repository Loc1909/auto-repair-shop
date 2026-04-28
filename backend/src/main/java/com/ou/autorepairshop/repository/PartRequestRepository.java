package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.PartRequest;
import com.ou.autorepairshop.enums.PartRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PartRequestRepository extends JpaRepository<PartRequest, Long> {
    List<PartRequest> findByRepairOrderId(Long repairOrderId);
    List<PartRequest> findByStatus(PartRequestStatus status);
    @Query("""
    SELECT pr FROM PartRequest pr
    JOIN FETCH pr.part
    JOIN FETCH pr.repairOrder
    WHERE pr.status = :status
""")
    List<PartRequest> findByStatusWithFetch(PartRequestStatus status);
    @Query("""
    SELECT pr FROM PartRequest pr
    JOIN FETCH pr.part
    JOIN FETCH pr.repairOrder
""")
    List<PartRequest> findAllWithFetch();
}
