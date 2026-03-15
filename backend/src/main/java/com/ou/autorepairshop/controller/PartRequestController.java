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
@RequestMapping("/api/v1/part-requests")
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
}
