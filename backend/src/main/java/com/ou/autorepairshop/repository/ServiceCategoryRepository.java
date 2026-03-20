package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

    Optional<ServiceCategory> findByName(String name);
}