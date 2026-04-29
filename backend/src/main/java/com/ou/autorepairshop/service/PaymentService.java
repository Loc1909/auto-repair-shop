package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.PaymentRequest;
import com.ou.autorepairshop.dto.PaymentResponse;
import com.ou.autorepairshop.entity.Payment;
import com.ou.autorepairshop.entity.PaymentStatus;
import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.exception.DuplicateResourceException;
import com.ou.autorepairshop.repository.PaymentRepository;
import com.ou.autorepairshop.repository.RepairOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final RepairOrderRepository repairOrderRepository;

    public PaymentResponse createPayment(PaymentRequest request) {

        RepairOrder repairOrder = repairOrderRepository.findById(request.repairOrderId())
                .orElseThrow(() -> new RuntimeException("Repair order not found"));

        if (paymentRepository.existsByRepairOrderId(request.repairOrderId())) {
            throw new DuplicateResourceException("Payment already exists for this repair order");
        }

        Payment payment = new Payment();
        payment.setAmount(request.amount());
        payment.setMethod(request.method());
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setPaymentDate(LocalDateTime.now()); //demo
        payment.setRepairOrder(repairOrder);

        payment.setTransactionId(UUID.randomUUID().toString());

        Payment saved = paymentRepository.save(payment);

        return new PaymentResponse(
                saved.getId(),
                saved.getAmount(),
                saved.getMethod(),
                saved.getStatus(),
                saved.getTransactionId(),
                saved.getPaymentDate(),
                saved.getRepairOrder().getId()
        );
    }
}
