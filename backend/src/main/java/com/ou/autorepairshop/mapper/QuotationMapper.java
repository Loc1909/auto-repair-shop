package com.ou.autorepairshop.mapper;

import com.ou.autorepairshop.entity.Quotation;
import com.ou.autorepairshop.entity.QuotationDetail;
import com.ou.autorepairshop.dto.QuotationDetailResponse;
import com.ou.autorepairshop.dto.QuotationResponse;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = QuotationDetailMapper.class)
public interface QuotationMapper {

    @Mapping(source = "repairOrder.id", target = "repairOrderId")
    @Mapping(target = "details", expression = "java(mapDetails(details, quotationDetailMapper))")
    QuotationResponse toResponse(Quotation quotation,
                                 @Context List<QuotationDetail> details,
                                 @Context QuotationDetailMapper quotationDetailMapper);

    default List<QuotationDetailResponse> mapDetails(List<QuotationDetail> details,
                                                      QuotationDetailMapper mapper) {
        return details.stream().map(mapper::toResponse).toList();
    }
}
