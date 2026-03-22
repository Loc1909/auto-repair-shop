package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Page<Employee> findByNameContainingIgnoreCaseOrPhoneContainingOrPositionContainingIgnoreCase(
            String name,
            String phone,
            String position,
            Pageable pageable
    );
}