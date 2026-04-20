package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.ServiceCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

    Optional<ServiceCategory> findByName(String name);

    @Query("""
        SELECT c FROM ServiceCategory c
        WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
    Page<ServiceCategory> search(String search, Pageable pageable);
}