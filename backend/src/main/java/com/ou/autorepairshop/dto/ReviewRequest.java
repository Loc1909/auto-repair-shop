package com.ou.autorepairshop.dto;

public record ReviewRequest(
        int rating,
        String comment,
        Long repairOrderId
) {
}
