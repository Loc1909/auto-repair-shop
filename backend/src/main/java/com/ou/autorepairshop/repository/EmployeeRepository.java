package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}