package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.CreateQuotationRequest;
import com.ou.autorepairshop.dto.QuotationDetailItem;
import com.ou.autorepairshop.dto.QuotationDetailResponse;
import com.ou.autorepairshop.dto.QuotationResponse;
import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.enums.ItemType;
import com.ou.autorepairshop.enums.QuotationStatus;
import com.ou.autorepairshop.enums.RepairStatus;
import com.ou.autorepairshop.exception.BadRequestException;
import com.ou.autorepairshop.exception.BusinessException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.mapper.QuotationDetailMapper;
import com.ou.autorepairshop.mapper.QuotationMapper;
import com.ou.autorepairshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

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

        ItemType type;
        try {
            type = ItemType.valueOf(item.itemType().toUpperCase());
        } catch (Exception e) {
            throw new BusinessException("Invalid item type: " + item.itemType());
        }

        QuotationDetail.QuotationDetailBuilder builder = QuotationDetail.builder()
                .quotation(quotation)
                .itemType(type)
                .quantity(item.quantity());

        if (type == ItemType.PART) {

            Part part = partRepository.findById(item.itemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Part", item.itemId()));

            builder.part(part)
                    .unitPrice(part.getPrice());

        } else if (type == ItemType.SERVICE) {

            RepairService svc = serviceRepository.findById(item.itemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Service", item.itemId()));

            builder.service(svc)
                    .unitPrice(svc.getPrice());
        }

        return builder.build();
    }

    @Transactional
    public QuotationResponse updateQuotationStatus(Long repairOrderId, String action) {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        RepairOrder repairOrder = repairOrderRepository.findByIdAndVehicleCustomerId(repairOrderId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Repair order not found or not yours"));

        Quotation quotation = quotationRepository
                .findByRepairOrderId(repairOrder.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found"));

        if (quotation.getStatus() != QuotationStatus.PENDING) {
            throw new RuntimeException("Quotation already processed");
        }

        if ("APPROVE".equalsIgnoreCase(action)) {
            quotation.setStatus(QuotationStatus.APPROVED);
            repairOrder.setStatus(RepairStatus.APPROVED);
            repairOrderRepository.save(repairOrder);
        } else if ("REJECT".equalsIgnoreCase(action)) {
            quotation.setStatus(QuotationStatus.REJECTED);
            repairOrder.setStatus(RepairStatus.REJECTED);
            repairOrderRepository.save(repairOrder);
        } else {
            throw new BadRequestException("Invalid action");
        }
        List<QuotationDetail> details = quotationDetailRepository.findByQuotationId(quotation.getId());
        return quotationMapper.toResponse(quotation, details, quotationDetailMapper);
    }

    private QuotationResponse mapToResponse(Quotation q,
                                            List<QuotationDetail> details) {
//        Long id,
//        String itemType,
//        Long itemId, // id của Part và RepairService
//        String itemName, // name của Part và RepairService
//        int quantity,
//        BigDecimal unitPrice,
//        BigDecimal subtotal
        List<QuotationDetailResponse> detailResponses = details.stream()
                .map(d -> new QuotationDetailResponse(
                        d.getId(),
                        d.getItemType().toString(),
                        d.getService().getId(),
                        d.getService().getName(),
                        d.getQuantity(),
                        d.getUnitPrice(),
                        d.getService().getPrice())).toList();

        return new QuotationResponse(
                q.getId(),
                q.getStatus().name(),
                q.getTotalPrice(),
                q.getCreatedAt(),
                q.getRepairOrder().getId(),
                detailResponses
        );
    }
}
