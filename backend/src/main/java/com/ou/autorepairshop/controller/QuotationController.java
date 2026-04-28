package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.CreateQuotationRequest;
import com.ou.autorepairshop.dto.QuotationNoDetailResponse;
import com.ou.autorepairshop.dto.QuotationResponse;
import com.ou.autorepairshop.service.QuotationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationService quotationService;

    /** Chỉ STAFF/ADMIN mới tạo báo giá */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
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

    /** Chỉ STAFF/ADMIN mới được cập nhật status trực tiếp */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<QuotationResponse> updateStatus(@PathVariable Long id,
                                                          @RequestParam String action) {
        return ResponseEntity.ok(quotationService.updateQuotationStatus(id, action));
    }

    /** Khách hàng duyệt / từ chối báo giá của đơn hàng */
    @PutMapping("/repair-order/{repairOrderId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<QuotationResponse> confirmStatus(@PathVariable Long repairOrderId,
                                                          @RequestParam String action) {
        return ResponseEntity.ok(quotationService.confirmQuotationStatus(repairOrderId, action));
    }

    /** Khách hàng xem báo giá của mình */
    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<QuotationNoDetailResponse>> getMyQuotations() {
        return ResponseEntity.ok(quotationService.getMyQuotations());
    }
}
