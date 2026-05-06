package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.PaymentRequest;
import com.ou.autorepairshop.dto.PaymentResponse;
import com.ou.autorepairshop.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestBody PaymentRequest request
    ) {
        return ResponseEntity.ok(paymentService.createPayment(request));
    }
}
