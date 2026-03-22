package com.ou.autorepairshop.service;

import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.mapper.RepairProgressMapper;
import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.entity.RepairProgress;
import com.ou.autorepairshop.dto.RepairProgressResponse;
import com.ou.autorepairshop.dto.UpdateProgressRequest;
import com.ou.autorepairshop.repository.RepairOrderRepository;
import com.ou.autorepairshop.repository.RepairProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairProgressService {

    private final RepairProgressRepository repairProgressRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final RepairProgressMapper repairProgressMapper;

    @Transactional
    public RepairProgressResponse addProgress(UpdateProgressRequest req) {
        RepairOrder order = repairOrderRepository.findById(req.repairOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder", req.repairOrderId()));

        order.setStatus(req.status());
        repairOrderRepository.save(order);

        RepairProgress progress = RepairProgress.builder()
                .repairOrder(order)
                .status(req.status())
                .note(req.note())
                .updateTime(LocalDateTime.now())
                .build();

        return repairProgressMapper.toResponse(repairProgressRepository.save(progress));
    }

    @Transactional(readOnly = true)
    public List<RepairProgressResponse> getHistory(Long repairOrderId) {
        if (!repairOrderRepository.existsById(repairOrderId)) {
            throw new ResourceNotFoundException("RepairOrder", repairOrderId);
        }
        return repairProgressRepository
                .findByRepairOrderIdOrderByUpdateTimeAsc(repairOrderId)
                .stream().map(repairProgressMapper::toResponse).toList();
    }
}
