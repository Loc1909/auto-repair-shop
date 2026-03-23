package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.entity.QuotationDetail;
import com.ou.autorepairshop.dto.QuotationDetailResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface QuotationDetailMapper {

    @Mapping(target = "itemId",   expression = "java(resolveItemId(detail))")
    @Mapping(target = "itemName", expression = "java(resolveItemName(detail))")
    @Mapping(target = "subtotal", expression = "java(detail.getUnitPrice()" +
            ".multiply(java.math.BigDecimal.valueOf(detail.getQuantity())))")
    QuotationDetailResponse toResponse(QuotationDetail detail);

    @Named("resolveItemId")
    default Long resolveItemId(QuotationDetail detail) {
        if (detail.getPart() != null) return detail.getPart().getId();
        if (detail.getService() != null) return detail.getService().getId();
        return null;
    }

    @Named("resolveItemName")
    default String resolveItemName(QuotationDetail detail) {
        if (detail.getPart() != null) return detail.getPart().getName();
        if (detail.getService() != null) return detail.getService().getName();
        return "Unknown";
    }
}
