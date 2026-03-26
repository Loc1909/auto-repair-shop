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

        List<Object[]> results;

        switch (type) {
            case "month":
                results = paymentRepository.getRevenueRawByMonth();
                break;
            case "quarter":
                results = paymentRepository.getRevenueRawByQuarter();
                break;
            case "year":
                results = paymentRepository.getRevenueRawByYear();
                break;
            case "day":
            default:
                results = paymentRepository.getRevenueRawByDay();
        }

        return results.stream()
                .map(r -> new RevenueDTO(
                        r[0].toString(),
                        (BigDecimal) r[1]
                ))
                .toList();
    }
}