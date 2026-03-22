package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.CreateQuotationRequest;
import com.ou.autorepairshop.dto.QuotationDetailItem;
import com.ou.autorepairshop.dto.QuotationResponse;
import com.ou.autorepairshop.enums.QuotationStatus;
import com.ou.autorepairshop.enums.RepairStatus;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.entity.Part;
import com.ou.autorepairshop.entity.Quotation;
import com.ou.autorepairshop.entity.QuotationDetail;
import com.ou.autorepairshop.entity.RepairOrder;
import com.ou.autorepairshop.entity.RepairService;
import com.ou.autorepairshop.mapper.QuotationDetailMapper;
import com.ou.autorepairshop.mapper.QuotationMapper;
import com.ou.autorepairshop.repository.QuotationRepository;
import com.ou.autorepairshop.repository.QuotationDetailRepository;
import com.ou.autorepairshop.repository.RepairOrderRepository;
import com.ou.autorepairshop.repository.PartRepository;
import com.ou.autorepairshop.repository.RepairServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final QuotationDetailRepository quotationDetailRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final PartRepository partRepository;
    private final RepairServiceRepository serviceRepository;
    private final QuotationDetailMapper quotationDetailMapper;
    private final QuotationMapper quotationMapper;

    @Transactional
    public QuotationResponse createQuotation(CreateQuotationRequest req) {
        RepairOrder order = repairOrderRepository.findById(req.repairOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("RepairOrder", req.repairOrderId()));

        if (quotationRepository.existsByRepairOrderId(req.repairOrderId())) {
            throw new BusinessException("A quotation already exists for this repair order.");
        }

        Quotation quotation = Quotation.builder()
                .repairOrder(order)
                .status(QuotationStatus.PENDING)
                .totalPrice(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .build();

        quotation = quotationRepository.save(quotation);

        List<QuotationDetail> details = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (QuotationDetailItem item : req.items()) {
            QuotationDetail detail = buildDetail(quotation, item);
            details.add(detail);
            total = total.add(detail.getUnitPrice().multiply(BigDecimal.valueOf(detail.getQuantity())));
        }

        quotationDetailRepository.saveAll(details);

        quotation.setTotalPrice(total);
        quotation = quotationRepository.save(quotation);

        order.setStatus(RepairStatus.QUOTING);
        repairOrderRepository.save(order);

        return quotationMapper.toResponse(quotation, details, quotationDetailMapper);
    }

    @Transactional(readOnly = true)
    public QuotationResponse getByRepairOrder(Long repairOrderId) {
        Quotation quotation = quotationRepository.findByRepairOrderId(repairOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation for RepairOrder", repairOrderId));

        List<QuotationDetail> details = quotationDetailRepository.findByQuotationId(quotation.getId());
        return quotationMapper.toResponse(quotation, details, quotationDetailMapper);
    }

    @Transactional(readOnly = true)
    public QuotationResponse getById(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation", id));
        List<QuotationDetail> details = quotationDetailRepository.findByQuotationId(id);
        return quotationMapper.toResponse(quotation, details, quotationDetailMapper);
    }

    private QuotationDetail buildDetail(Quotation quotation, QuotationDetailItem item) {
        QuotationDetail.QuotationDetailBuilder builder = QuotationDetail.builder()
                .quotation(quotation)
                .itemType(item.itemType().toUpperCase())
                .quantity(item.quantity());

        if ("PART".equalsIgnoreCase(item.itemType())) {
            Part part = partRepository.findById(item.itemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Part", item.itemId()));
            builder.part(part).unitPrice(part.getPrice());

        } else if ("SERVICE".equalsIgnoreCase(item.itemType())) {
            RepairService svc = serviceRepository.findById(item.itemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Service", item.itemId()));
            builder.service(svc).unitPrice(svc.getPrice());

        } else {
            throw new BusinessException("Unknown item type: " + item.itemType() + ". Must be PART or SERVICE.");
        }

        return builder.build();
    }
}
