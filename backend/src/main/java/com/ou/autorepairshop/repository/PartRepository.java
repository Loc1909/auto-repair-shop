package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.Part;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartRepository extends JpaRepository<Part, Long> {

    // Lấy phụ tùng còn hàng
    List<Part> findByStockQuantityGreaterThan(int quantity);

    // 🔥 Lấy phụ tùng sắp hết hàng (quan trọng cho dashboard)
    List<Part> findByStockQuantityLessThan(int threshold);
}