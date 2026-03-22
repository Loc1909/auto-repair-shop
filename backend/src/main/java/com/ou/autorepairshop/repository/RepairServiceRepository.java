package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.dto.RepairServiceDTO;
import com.ou.autorepairshop.entity.RepairService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RepairServiceRepository extends JpaRepository<RepairService, Long> {

    List<RepairService> findByCategoryId(Long categoryId);

    @Query("SELECT s FROM RepairService s JOIN FETCH s.category")
    List<RepairService> findAllWithCategory();

    @Query("""
    SELECT s FROM RepairService s
    WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<RepairService> search(String search, Pageable pageable);

    //  tìm theo tên (search admin)
    List<RepairService> findByNameContainingIgnoreCase(String keyword);
    @Query("""
        SELECT new com.ou.autorepairshop.dto.RepairServiceDTO(
            s.id, s.name, s.price, s.description,
            s.category.id, s.category.name
        )
        FROM RepairService s
        WHERE (:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<RepairServiceDTO> findAllWithCategoryDTO(@Param("search") String search, Pageable pageable);
}