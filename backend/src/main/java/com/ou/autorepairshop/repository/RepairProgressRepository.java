package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.RepairProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RepairProgressRepository extends JpaRepository<RepairProgress, Long> {
    List<RepairProgress> findByRepairOrderIdOrderByUpdateTimeAsc(Long repairOrderId);
    Optional<RepairProgress> findTopByRepairOrderIdOrderByUpdateTimeDesc(Long repairOrderId);
}
