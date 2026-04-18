package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.AppointmentCreateRequest;
import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.dto.AppointmentResponseForEmployee;
import com.ou.autorepairshop.service.AppointmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<AppointmentResponse> makeAppointment(
            @RequestBody AppointmentCreateRequest request) {

        AppointmentResponse response = appointmentService.makeAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ================= GET =================
    @GetMapping
    public ResponseEntity<List<AppointmentResponseForEmployee>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // ================= CONFIRM (CUSTOMER / ADMIN) =================
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<AppointmentResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    // ================= CONFIRM (EMPLOYEE) =================
    @PatchMapping("/{id}/confirm-by-employee")
    public ResponseEntity<AppointmentResponseForEmployee> confirmByEmployee(
            @PathVariable Long id,
            @RequestParam Long employeeId) {

        return ResponseEntity.ok(
                appointmentService.confirmAppointmentByEmployee(id, employeeId)
        );
    }

    // ================= CANCEL (CUSTOMER / ADMIN) =================
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancel(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        String reason = (body != null) ? body.get("reason") : null;
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, reason));
    }

    // ================= CANCEL (EMPLOYEE) =================
    @PatchMapping("/{id}/cancel-by-employee")
    public ResponseEntity<AppointmentResponseForEmployee> cancelByEmployee(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        String reason = (body != null) ? body.get("reason") : null;
        return ResponseEntity.ok(
                appointmentService.cancelAppointmentByEmployee(id, reason)
        );
    }
}