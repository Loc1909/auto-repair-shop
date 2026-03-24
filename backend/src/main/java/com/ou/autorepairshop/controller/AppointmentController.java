package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.AppointmentResponse;
import com.ou.autorepairshop.entity.Appointment;
import com.ou.autorepairshop.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    /**
     * Nhân viên xác nhận lịch hẹn (PENDING → CONFIRMED)
     */
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<AppointmentResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    /**
     * Nhân viên hủy lịch hẹn (PENDING/CONFIRMED → CANCELLED)
     * Body (optional): { "reason": "Thợ bận, không đủ nhân lực" }
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancel(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        String reason = (body != null) ? body.get("reason") : null;
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, reason));
    }
}
