package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.RepairProgressResponse;
import com.ou.autorepairshop.dto.UpdateProgressRequest;
import com.ou.autorepairshop.service.RepairProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/repair-progress")
@RequiredArgsConstructor
public class RepairProgressController {

    private final RepairProgressService repairProgressService;

    @PostMapping
    public ResponseEntity<RepairProgressResponse> addProgress(
            @RequestBody @Valid UpdateProgressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repairProgressService.addProgress(request));
    }

    @GetMapping("/by-order/{repairOrderId}")
    public ResponseEntity<List<RepairProgressResponse>> getHistory(@PathVariable Long repairOrderId) {
        return ResponseEntity.ok(repairProgressService.getHistory(repairOrderId));
    }
}
