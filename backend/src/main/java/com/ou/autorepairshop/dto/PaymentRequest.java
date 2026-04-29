package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.entity.PaymentMethod;

import java.math.BigDecimal;

public record PaymentRequest(
        BigDecimal amount,
        PaymentMethod method,
        Long repairOrderId) {
}
