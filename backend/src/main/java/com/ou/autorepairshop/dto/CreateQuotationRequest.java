package com.ou.autorepairshop.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateQuotationRequest(
        @NotNull Long repairOrderId,
        @NotEmpty List<QuotationDetailItem> items
) {}
