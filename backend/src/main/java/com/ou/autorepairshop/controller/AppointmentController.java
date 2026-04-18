package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.dto.AppointmentResponseForEmployee;
import com.ou.autorepairshop.entity.Appointment;
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

    /**
     * Người dùng đặt lịch hẹn
     */
    @PostMapping
    public ResponseEntity<AppointmentResponse> makeAppointment(@RequestBody AppointmentCreateRequest request) {
        AppointmentResponse response = appointmentService.makeAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponseForEmployee>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }


    /**
     * Nhân viên xác nhận lịch hẹn (PENDING → CONFIRMED)
     */
    @PatchMapping("/{id}/confirm")

    public ResponseEntity<AppointmentResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    public ResponseEntity<AppointmentResponseForEmployee> confirm(
            @PathVariable Long id,
            @RequestParam Long employeeId) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id, employeeId));
    }

    /**
     * Nhân viên hủy lịch hẹn (PENDING/CONFIRMED → CANCELLED)
     * Body (optional): { "reason": "Thợ bận, không đủ nhân lực" }
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseForEmployee> cancel(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        String reason = (body != null) ? body.get("reason") : null;
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, reason));
    }
}
