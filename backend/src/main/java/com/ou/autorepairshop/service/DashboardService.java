package com.ou.autorepairshop.service;

import com.ou.autorepairshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ou.autorepairshop.entity.PaymentStatus;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PartRepository partRepository;
    private final RepairServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;
    private final PaymentRepository paymentRepository;

    public Map<String, Object> getDashboard() {

        Map<String, Object> data = new HashMap<>();

        long totalParts = partRepository.count();
        long totalServices = serviceRepository.count();
        long totalEmployees = employeeRepository.count();

        long lowStockParts = partRepository
                .findAll()
                .stream()
                .filter(p -> p.getStockQuantity() < p.getMinStockLevel())
                .count();

        // tổng doanh thu từ payment COMPLETED
        BigDecimal totalRevenue = paymentRepository.findAll()
                .stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .map(p -> p.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        data.put("totalParts", totalParts);
        data.put("lowStockParts", lowStockParts);
        data.put("totalServices", totalServices);
        data.put("totalEmployees", totalEmployees);
        data.put("totalRevenue", totalRevenue);

        return data;
    }
}