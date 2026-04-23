package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.AddServiceRequest;
import com.ou.autorepairshop.service.RepairOrderDetailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repair-order-service")
@RequiredArgsConstructor
public class RepairOrderServiceController {

    private final RepairOrderDetailService repairOrderDetailService;

    @PostMapping("/add")
    public ResponseEntity<Void> addService(@RequestBody @Valid AddServiceRequest request) {
        repairOrderDetailService.addService(request);
        return ResponseEntity.noContent().build();
    }
}