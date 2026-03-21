package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.EmployeeResponse;
import com.ou.autorepairshop.dto.RepairServiceDTO;
import com.ou.autorepairshop.dto.ServiceCategoryDTO;
import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.mapper.EmployeeMapper;
import com.ou.autorepairshop.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final EmployeeService employeeService;
    private final PartService partService;
    private final RepairServiceService serviceService;
    private final DashboardService dashboardService;
    private final ServiceCategoryService categoryService;

    // ================= EMPLOYEE =================
    @GetMapping("/employees")
    public List<EmployeeResponse> getEmployees() {
        return employeeService.getAll()
                .stream()
                .map(EmployeeMapper::toDTO)
                .toList();
    }
    @PostMapping("/employees")
    public Employee createEmployee(@RequestBody Employee e) {
        return employeeService.create(e);
    }

    @PutMapping("/employees/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee e) {
        return employeeService.update(id, e);
    }

    @DeleteMapping("/employees/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.delete(id);
    }

    // ================= PART =================
    @GetMapping("/parts")
    public List<Part> getParts() {
        return partService.getAll();
    }

    @PostMapping("/parts")
    public Part createPart(@RequestBody Part p) {
        return partService.create(p);
    }

    @PutMapping("/parts/{id}")
    public Part updatePart(@PathVariable Long id, @RequestBody Part p) {
        return partService.update(id, p);
    }

    @DeleteMapping("/parts/{id}")
    public void deletePart(@PathVariable Long id) {
        partService.delete(id);
    }

    // ================= SERVICE =================
    @GetMapping("/services")
    public List<RepairServiceDTO> getServices() {
        return serviceService.getAll();
    }

    @PostMapping("/services")
    public RepairServiceDTO createService(@RequestBody RepairService s) {
        return serviceService.createAndReturnDTO(s);
    }

    @PutMapping("/services/{id}")
    public RepairServiceDTO updateService(@PathVariable Long id, @RequestBody RepairService s) {
        return serviceService.update(id, s);
    }

    @DeleteMapping("/services/{id}")
    public Map<String, String> deleteService(@PathVariable Long id) {
        serviceService.delete(id);
        return Map.of("message", "Deleted successfully");
    }

    // ================= SERVICE CATEGORY =================
    @GetMapping("/service-categories")
    public List<ServiceCategoryDTO> getCategories() {
        return categoryService.getAll();
    }

    @PostMapping("/service-categories")
    public ServiceCategory createCategory(@RequestBody ServiceCategory c) {
        return categoryService.create(c);
    }

    // ================= DASHBOARD =================
    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return dashboardService.getDashboard();
    }
}