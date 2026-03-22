package com.ou.autorepairshop.service;

import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.mapper.PartRequestMapper;
import com.ou.autorepairshop.entity.Part;
import com.ou.autorepairshop.entity.PartRequest;
import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.dto.PartRequestCreate;
import com.ou.autorepairshop.dto.PartRequestResponse;
import com.ou.autorepairshop.repository.PartRepository;
import com.ou.autorepairshop.repository.PartRequestRepository;
import com.ou.autorepairshop.repository.RepairOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartRequestService {

    private final PartRequestRepository partRequestRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final PartRepository partRepository;
    private final PartRequestMapper partRequestMapper;

    @Transactional
    public PartRequestResponse requestPart(PartRequestCreate req) {
        RepairOrder order = repairOrderRepository.findById(req.repairOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder", req.repairOrderId()));

        Part part = partRepository.findById(req.partId())
                .orElseThrow(() -> new ResourceNotFoundException("Part", req.partId()));

        if (part.getStockQuantity() < req.requestedQuantity()) {
            throw new BusinessException(
                    "Insufficient stock for part '%s'. Available: %d, Requested: %d"
                    .formatted(part.getName(), part.getStockQuantity(), req.requestedQuantity())
            );
        }

        PartRequest partRequest = PartRequest.builder()
                .repairOrder(order)
                .part(part)
                .requestedQuantity(req.requestedQuantity())
                .status("PENDING")
                .requestedAt(LocalDateTime.now())
                .build();

        return partRequestMapper.toResponse(partRequestRepository.save(partRequest));
    }

    @Transactional(readOnly = true)
    public List<PartRequestResponse> getByRepairOrder(Long repairOrderId) {
        if (!repairOrderRepository.existsById(repairOrderId)) {
            throw new ResourceNotFoundException("RepairOrder", repairOrderId);
        }
        return partRequestRepository.findByRepairOrderId(repairOrderId)
                .stream().map(partRequestMapper::toResponse).toList();
    }
}
