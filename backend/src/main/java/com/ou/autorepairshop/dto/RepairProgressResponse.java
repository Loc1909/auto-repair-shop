package com.ou.autorepairshop.dto;

import java.time.LocalDateTime;

public record RepairProgressResponse(
        Long id,
        String status,
        String note,
        LocalDateTime updateTime,
        Long repairOrderId
) {}
