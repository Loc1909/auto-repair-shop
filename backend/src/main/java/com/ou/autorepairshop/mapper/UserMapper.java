package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.dto.CustomerResponse;
import com.ou.autorepairshop.dto.EmployeeResponse;
import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.entity.Role;
import com.ou.autorepairshop.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

public class UserMapper {

    public static UserResponse toDTO(User user) {
        if (user == null) return null;

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                Role.ROLE_STAFF.equals(user.getRole()) ? toEmployeeDTO(user.getEmployee()) : null,
                Role.ROLE_CUSTOMER.equals(user.getRole()) ? toCustomerDTO(user.getCustomer()) : null
        );
    }

    private static EmployeeResponse toEmployeeDTO(Employee e) {
        if (e == null) return null;

        return new EmployeeResponse(
                e.getId(),
                e.getName(),
                e.getPhone(),
                e.getPosition(),
                e.getSalary(),
                e.getUser() != null ? e.getUser().getUsername() : null
        );
    }
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
