package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.entity.RepairProgress;
import com.ou.autorepairshop.dto.RepairProgressResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RepairProgressMapper {

    @Mapping(source = "repairOrder.id", target = "repairOrderId")
    RepairProgressResponse toResponse(RepairProgress repairProgress);
}
