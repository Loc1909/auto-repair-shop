package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.RepairServiceDTO;
import com.ou.autorepairshop.entity.Part;
import com.ou.autorepairshop.service.PartService;
import com.ou.autorepairshop.service.RepairServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final PartService partService;
    private final RepairServiceService repairServiceService;

    @GetMapping("/parts")
    public List<Part> getAllParts() {
        return partService.getAll();
    }

    @GetMapping("/services")
    public List<RepairServiceDTO> getAllServices() {
        return repairServiceService.getAll();
    }
}
