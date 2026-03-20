package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.RepairProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepairProgressRepository extends JpaRepository<RepairProgress, Long> {
    List<RepairProgress> findByRepairOrderIdOrderByUpdateTimeAsc(Long repairOrderId);
}
