package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.RevenueDTO;
import com.ou.autorepairshop.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final PaymentRepository paymentRepository;

    public List<RevenueDTO> getRevenue(String type) {

        return switch (type.toLowerCase()) {

            case "month" -> mapDefault(paymentRepository.getRevenueRawByMonth());

            case "year" -> mapDefault(paymentRepository.getRevenueRawByYear());

            case "quarter" -> mapQuarter(paymentRepository.getRevenueRawByQuarter());

            case "day" -> mapDefault(paymentRepository.getRevenueRawByDay());

            default -> throw new IllegalArgumentException("Invalid type: " + type);
        };
    }

    // ===== DEFAULT MAPPER (day/month/year) =====
    private List<RevenueDTO> mapDefault(List<Object[]> results) {
        return results.stream()
                .map(r -> new RevenueDTO(
                        r[0].toString(),
                        toBigDecimal(r[1])
                ))
                .toList();
    }

    // ===== QUARTER MAPPER =====
    private List<RevenueDTO> mapQuarter(List<Object[]> results) {
        return results.stream()
                .map(r -> {
                    int year = ((Number) r[0]).intValue();
                    int quarter = ((Number) r[1]).intValue();
                    BigDecimal revenue = toBigDecimal(r[2]);

                    return new RevenueDTO("Q" + quarter + "/" + year, revenue);
                })
                .toList();
    }

    // ===== SAFE CONVERTER =====
    private BigDecimal toBigDecimal(Object value) {
        return value == null ? BigDecimal.ZERO : new BigDecimal(value.toString());
    }
}