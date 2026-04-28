package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.AppointmentCreateRequest;
import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.dto.AppointmentResponseForEmployee;
import com.ou.autorepairshop.service.AppointmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ================= CREATE =================
    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> makeAppointment(
            @RequestBody AppointmentCreateRequest request) {

        AppointmentResponse response = appointmentService.makeAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ================= GET ALL (ADMIN/STAFF only) =================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<AppointmentResponseForEmployee>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    /**
     * Lấy dữ liệu appointment của customer/user hiện tại
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments() {
        return ResponseEntity.ok(appointmentService.getMyAppointments());
    }

    /**
     * Admin/Staff xác nhận lịch hẹn (PENDING → CONFIRMED)
     */
    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<AppointmentResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    // ================= CONFIRM (EMPLOYEE) =================
    @PatchMapping("/{id}/confirm-by-employee")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<AppointmentResponseForEmployee> confirmByEmployee(
            @PathVariable Long id,
            @RequestParam Long employeeId) {

        return ResponseEntity.ok(
                appointmentService.confirmAppointmentByEmployee(id, employeeId)
        );
    }

    // ================= CANCEL (CUSTOMER / ADMIN) =================
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> cancel(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        String reason = (body != null) ? body.get("reason") : null;
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, reason));
    }

    // ================= CANCEL (EMPLOYEE) =================
    @PatchMapping("/{id}/cancel-by-employee")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<AppointmentResponseForEmployee> cancelByEmployee(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        String reason = (body != null) ? body.get("reason") : null;
        return ResponseEntity.ok(
                appointmentService.cancelAppointmentByEmployee(id, reason)
        );
    }
}