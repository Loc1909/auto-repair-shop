package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public Employee create(Employee e) {
        return employeeRepository.save(e);
    }

    public Employee update(Long id, Employee e) {
        Employee existing = getById(id);
        existing.setName(e.getName());
        existing.setPhone(e.getPhone());
        existing.setPosition(e.getPosition());
        existing.setSalary(e.getSalary());
        return employeeRepository.save(existing);
    }

    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }
}