package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
