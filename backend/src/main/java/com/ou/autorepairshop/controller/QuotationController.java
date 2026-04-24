package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.CreateQuotationRequest;
import com.ou.autorepairshop.dto.QuotationResponse;
import com.ou.autorepairshop.service.QuotationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationService quotationService;

    @PostMapping
    public ResponseEntity<QuotationResponse> createQuotation(
            @RequestBody @Valid CreateQuotationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(quotationService.createQuotation(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuotationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(quotationService.getById(id));
    }

    @GetMapping("/by-order/{repairOrderId}")
    public ResponseEntity<List<QuotationResponse>> getByRepairOrder(@PathVariable Long repairOrderId) {
        return ResponseEntity.ok(quotationService.getByRepairOrder(repairOrderId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<QuotationResponse> updateStatus(@PathVariable Long id,
                                                          @RequestParam String action) {
        return ResponseEntity.ok(quotationService.updateQuotationStatus(id, action));
    }
}
