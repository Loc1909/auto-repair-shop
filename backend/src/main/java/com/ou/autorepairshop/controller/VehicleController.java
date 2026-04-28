package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.VehicleRequest;
import com.ou.autorepairshop.dto.VehicleResponse;
import com.ou.autorepairshop.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor

public class VehicleController {
    private final VehicleService vehicleService;

    /** Chỉ ADMIN/STAFF xem toàn bộ xe trong hệ thống */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<VehicleResponse>> getAll() {
        return ResponseEntity.ok(vehicleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getById(id));
    }

    /** Khách hàng xem xe của mình */
    @GetMapping("/my-vehicles")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<VehicleResponse>> getByUserId() {
        return ResponseEntity.ok(vehicleService.getByUserId());
    }

    /** Khách hàng / Admin tạo xe */
    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<VehicleResponse> createVehicle(@RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.createVehicle(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> update(
            @PathVariable Long id,
            @RequestBody VehicleRequest request
    ) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<VehicleResponse> patch(
            @PathVariable Long id,
            @RequestBody VehicleRequest request
    ) {
        return ResponseEntity.ok(vehicleService.patchVehicle(id, request));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
