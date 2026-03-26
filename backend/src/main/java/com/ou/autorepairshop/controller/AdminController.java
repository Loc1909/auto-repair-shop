package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.*;
import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.mapper.EmployeeMapper;
import com.ou.autorepairshop.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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
    private final StatisticService statisticService;

    // ================= EMPLOYEE =================
    @GetMapping("/employees")
    public Page<EmployeeResponse> getEmployees(
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        return employeeService.getEmployees(search, pageable);
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
    public Page<Part> getParts(
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        return partService.getParts(search, pageable);
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
    public Page<RepairServiceDTO> getServices(
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        return serviceService.getServices(search, pageable);
    }

    @PostMapping("/services")
    public RepairServiceDTO createRepairService(@RequestBody RepairServiceCreateRequest request) {
        return serviceService.create(request);
    }

    @PutMapping("/services/{id}")
    public RepairServiceDTO updateService(@PathVariable Long id,
                                          @RequestBody RepairServiceRequest request) {
        return serviceService.update(id, request);
    }

    @DeleteMapping("/services/{id}")
    public void deleteService(@PathVariable Long id) {
        serviceService.delete(id);
    }
    // ================= SERVICE CATEGORY =================

    @GetMapping("/service-categories")
    public Page<ServiceCategoryDTO> getCategories(
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        return categoryService.getCategories(search, pageable);
    }

    @PostMapping("/service-categories")
    public ServiceCategoryDTO createCategory(@RequestBody ServiceCategory c) {
        return categoryService.create(c);
    }

    @PutMapping("/service-categories/{id}")
    public ServiceCategoryDTO updateCategory(@PathVariable Long id,
                                             @RequestBody ServiceCategory c) {
        return categoryService.update(id, c);
    }

    @DeleteMapping("/service-categories/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
    }

    // ================= DASHBOARD =================
    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return dashboardService.getDashboard();
    }


    //  API revenue
    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDTO>> getRevenue(
            @RequestParam(defaultValue = "day") String type
    ) {
        return ResponseEntity.ok(statisticService.getRevenue(type));
    }
}