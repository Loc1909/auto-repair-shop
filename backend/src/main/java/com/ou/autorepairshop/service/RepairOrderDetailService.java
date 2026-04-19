package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.AddServiceRequest;
import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.entity.RepairOrderDetail;
import com.ou.autorepairshop.entity.RepairService;
import com.ou.autorepairshop.repository.RepairOrderRepository;
import com.ou.autorepairshop.repository.RepairOrderDetailRepository;
import com.ou.autorepairshop.repository.RepairServiceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RepairOrderDetailService {

    @Autowired
    private RepairOrderRepository repairOrderRepository;

    @Autowired
    private RepairServiceRepository repairServiceRepository;

    @Autowired
    private RepairOrderDetailRepository repairOrderDetailRepository;


    @Transactional
    public void addService(AddServiceRequest request) {

        if (request.quantity() == null || request.quantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        RepairOrder ro = repairOrderRepository.findById(request.repairOrderId())
                .orElseThrow(() -> new RuntimeException("RepairOrder not found"));

        RepairService service = repairServiceRepository.findById(request.serviceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        var existing = repairOrderDetailRepository
                .findByRepairOrderIdAndServiceId(ro.getId(), service.getId());

        if (existing.isPresent()) {
            RepairOrderDetail ros = existing.get();
            ros.setQuantity(ros.getQuantity() + request.quantity());
            repairOrderDetailRepository.save(ros);
        } else {
            RepairOrderDetail ros = RepairOrderDetail.builder()
                    .repairOrder(ro)
                    .service(service)
                    .quantity(request.quantity())
                    .price(service.getPrice())
                    .build();

            repairOrderDetailRepository.save(ros);
        }
    }

    public BigDecimal calculateTotal(Long repairOrderId) {

        List<RepairOrderDetail> list =
                repairOrderDetailRepository.findByRepairOrderId(repairOrderId);

        return list.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}