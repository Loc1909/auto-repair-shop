package com.ou.autorepairshop.dto;

import java.math.BigDecimal;

public record RepairServiceCreateRequest(
        String name,
        BigDecimal price,
        String description,
        Long categoryId   // chỉ cần truyền id category từ client
) {}