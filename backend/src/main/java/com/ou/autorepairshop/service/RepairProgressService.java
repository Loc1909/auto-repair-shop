package com.ou.autorepairshop.service;

import com.ou.autorepairshop.exception.ResourceNotFoundException;
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

    @Transactional
    public RepairProgressResponse addProgress(UpdateProgressRequest req) {
        RepairOrder order = repairOrderRepository.findById(req.repairOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder", req.repairOrderId()));

        // Sync the order's status with the latest progress entry
        order.setStatus(req.status());
        repairOrderRepository.save(order);

        RepairProgress progress = RepairProgress.builder()
                .repairOrder(order)
                .status(req.status())
                .note(req.note())
                .updateTime(LocalDateTime.now())
                .build();

        return toResponse(repairProgressRepository.save(progress));
    }

    @Transactional(readOnly = true)
    public List<RepairProgressResponse> getHistory(Long repairOrderId) {
        if (!repairOrderRepository.existsById(repairOrderId)) {
            throw new ResourceNotFoundException("RepairOrder", repairOrderId);
        }
        return repairProgressRepository
                .findByRepairOrderIdOrderByUpdateTimeAsc(repairOrderId)
                .stream().map(this::toResponse).toList();
    }

    private RepairProgressResponse toResponse(RepairProgress p) {
        return new RepairProgressResponse(
                p.getId(), p.getStatus(), p.getNote(),
                p.getUpdateTime(), p.getRepairOrder().getId()
        );
    }
}
