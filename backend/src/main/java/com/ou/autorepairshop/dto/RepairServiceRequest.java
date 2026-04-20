package com.ou.autorepairshop.dto;

import java.math.BigDecimal;

public record RepairServiceRequest(
        String name,
        BigDecimal price,
        String description,
        Long categoryId
) {}