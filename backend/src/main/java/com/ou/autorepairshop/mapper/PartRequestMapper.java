package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.entity.PartRequest;
import com.ou.autorepairshop.dto.PartRequestResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PartRequestMapper {

    @Mapping(source = "repairOrder.id",       target = "repairOrderId")
    @Mapping(source = "part.id",              target = "partId")
    @Mapping(source = "part.name",            target = "partName")
    @Mapping(source = "part.stockQuantity",   target = "partStockQuantity")
    PartRequestResponse toResponse(PartRequest partRequest);
}
