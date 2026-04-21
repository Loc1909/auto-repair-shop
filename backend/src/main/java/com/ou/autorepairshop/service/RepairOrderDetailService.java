package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.AddServiceRequest;
import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.entity.RepairOrderDetail;
import com.ou.autorepairshop.entity.RepairService;
import com.ou.autorepairshop.enums.ItemType;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.repository.RepairOrderDetailRepository;
import com.ou.autorepairshop.repository.RepairOrderRepository;
import com.ou.autorepairshop.repository.RepairServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairOrderDetailService {

    private final RepairOrderRepository repairOrderRepository;
    private final RepairServiceRepository repairServiceRepository;
    private final RepairOrderDetailRepository repairOrderDetailRepository;

    @Transactional
    public void addService(AddServiceRequest request) {
        RepairOrder ro = repairOrderRepository.findById(request.repairOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder", request.repairOrderId()));

        RepairService service = repairServiceRepository.findById(request.serviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", request.serviceId()));

        var existing = repairOrderDetailRepository
                .findByRepairOrderIdAndServiceId(ro.getId(), service.getId());

        if (existing.isPresent()) {
            RepairOrderDetail detail = existing.get();
            detail.setQuantity(detail.getQuantity() + request.quantity());
            repairOrderDetailRepository.save(detail);
        } else {
            RepairOrderDetail detail = RepairOrderDetail.builder()
                    .repairOrder(ro)
                    .itemType(ItemType.SERVICE)
                    .service(service)
                    .quantity(request.quantity())
                    .price(service.getPrice())
                    .build();
            repairOrderDetailRepository.save(detail);
        }
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateTotal(Long repairOrderId) {
        List<RepairOrderDetail> list = repairOrderDetailRepository.findByRepairOrderId(repairOrderId);
        return list.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}