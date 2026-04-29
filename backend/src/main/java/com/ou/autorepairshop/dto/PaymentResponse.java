package com.ou.autorepairshop.dto;

import com.ou.autorepairshop.entity.PaymentMethod;
import com.ou.autorepairshop.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        BigDecimal amount,
        PaymentMethod method,
        PaymentStatus status,
        String transactionId,
        LocalDateTime paymentDate,
        Long repairOrderId
) {
}
