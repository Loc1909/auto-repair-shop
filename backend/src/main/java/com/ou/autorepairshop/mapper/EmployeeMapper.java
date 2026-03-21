package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.dto.EmployeeResponse;
import com.ou.autorepairshop.entity.Employee;

public class EmployeeMapper {

    public static EmployeeResponse toDTO(Employee e) {
        return new EmployeeResponse(
                e.getId(),
                e.getName(),
                e.getPhone(),
                e.getPosition(),
                e.getSalary(),
                e.getUser() != null ? e.getUser().getUsername() : null
        );
    }
}