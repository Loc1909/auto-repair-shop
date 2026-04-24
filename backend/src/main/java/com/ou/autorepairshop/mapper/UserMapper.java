package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "customerId", source = "customer.id")
    UserResponse toResponse(User user);
}