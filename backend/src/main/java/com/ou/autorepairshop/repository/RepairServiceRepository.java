package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.RepairService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RepairServiceRepository extends JpaRepository<RepairService, Long> {

    List<RepairService> findByCategoryId(Long categoryId);

    @Query("SELECT s FROM RepairService s JOIN FETCH s.category")
    List<RepairService> findAllWithCategory();

    //  tìm theo tên (search admin)
    List<RepairService> findByNameContainingIgnoreCase(String keyword);
}