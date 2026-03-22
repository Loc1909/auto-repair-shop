package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.Part;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PartRepository extends JpaRepository<Part, Long> {

    // Lấy phụ tùng còn hàng
    List<Part> findByStockQuantityGreaterThan(int quantity);

    // 🔥 Lấy phụ tùng sắp hết hàng (quan trọng cho dashboard)
    List<Part> findByStockQuantityLessThan(int threshold);

    @Query("""
        SELECT p FROM Part p
        WHERE (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<Part> search(@Param("search") String search, Pageable pageable);
}