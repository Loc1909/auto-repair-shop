package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.CompleteRepairRequest;
import com.ou.autorepairshop.dto.ReceiveVehicleRequest;
import com.ou.autorepairshop.dto.RepairOrderResponse;
import com.ou.autorepairshop.dto.RepairProgressResponse;
import com.ou.autorepairshop.service.RepairOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repair-orders")
@RequiredArgsConstructor
public class RepairOrderController {

    private final RepairOrderService repairOrderService;

    @PostMapping("/receive")
    public ResponseEntity<RepairOrderResponse> receiveVehicle(
            @RequestBody @Valid ReceiveVehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repairOrderService.receiveVehicle(request));
    }

    @GetMapping("/mine/{repairOrderId}")
    public ResponseEntity<List<RepairProgressResponse>> getTracking(@PathVariable Long repairOrderId) {
        return ResponseEntity.ok(repairOrderService.getMyTracking(repairOrderId));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<RepairOrderResponse>> getMyRepairOrders() {
        return ResponseEntity.ok(repairOrderService.getMyRepairOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepairOrderResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(repairOrderService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<RepairOrderResponse>> getAll() {
        return ResponseEntity.ok(repairOrderService.getAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<RepairOrderResponse>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(repairOrderService.getByEmployee(employeeId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<RepairOrderResponse> completeRepair(
            @PathVariable Long id,
            @RequestBody CompleteRepairRequest request) {
        return ResponseEntity.ok(repairOrderService.completeRepair(id, request));
    }

    @GetMapping("/by-appointment/{appointmentId}")
    public ResponseEntity<RepairOrderResponse> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(repairOrderService.getByAppointmentId(appointmentId));
    }
}
