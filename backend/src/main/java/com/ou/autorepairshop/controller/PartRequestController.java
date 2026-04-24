package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.PartRequestCreate;
import com.ou.autorepairshop.dto.PartRequestResponse;
import com.ou.autorepairshop.service.PartRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/part-requests")
@RequiredArgsConstructor
public class PartRequestController {

    private final PartRequestService partRequestService;

    @PostMapping
    public ResponseEntity<PartRequestResponse> requestPart(
            @RequestBody @Valid PartRequestCreate request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(partRequestService.requestPart(request));
    }

    @GetMapping("/by-order/{repairOrderId}")
    public ResponseEntity<List<PartRequestResponse>> getByRepairOrder(@PathVariable Long repairOrderId) {
        return ResponseEntity.ok(partRequestService.getByRepairOrder(repairOrderId));
    }

    /** Kho duyệt yêu cầu → trừ tồn kho, status APPROVED */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<PartRequestResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(partRequestService.approvePartRequest(id));
    }

    /** Kho từ chối yêu cầu → status REJECTED */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<PartRequestResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(partRequestService.rejectPartRequest(id));
    }
}
