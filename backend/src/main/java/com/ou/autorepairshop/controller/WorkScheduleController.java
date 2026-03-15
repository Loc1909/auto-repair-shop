package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.WorkScheduleResponse;
import com.ou.autorepairshop.service.WorkScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class WorkScheduleController {

    private final WorkScheduleService workScheduleService;

    @GetMapping("/{employeeId}/schedule")
    public ResponseEntity<WorkScheduleResponse> getSchedule(@PathVariable Long employeeId) {
        return ResponseEntity.ok(workScheduleService.getSchedule(employeeId));
    }
}
