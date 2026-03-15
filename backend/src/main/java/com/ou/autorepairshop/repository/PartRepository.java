package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartRepository extends JpaRepository<Part, Long> {
    List<Part> findByStockQuantityGreaterThan(int quantity);
}
