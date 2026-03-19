package com.ou.autorepairshop.dto;

import java.math.BigDecimal;

public record RepairServiceDTO(
        Long id,
        String name,
        BigDecimal price,
        String description,
        Long categoryId,
        String categoryName
) {}