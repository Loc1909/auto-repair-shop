package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.dto.RevenueDTO;
import com.ou.autorepairshop.entity.Payment;
import com.ou.autorepairshop.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Lấy payment theo trạng thái
    List<Payment> findByStatus(PaymentStatus status);

    // Tổng doanh thu
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0)
        FROM Payment p
        WHERE p.status = com.ou.autorepairshop.entity.PaymentStatus.COMPLETED
    """)
    BigDecimal getTotalRevenue();

    // Doanh thu theo khoảng thời gian
    @Query("""
        SELECT COALESCE(SUM(p.amount), 0)
        FROM Payment p
        WHERE p.status = com.ou.autorepairshop.entity.PaymentStatus.COMPLETED
        AND p.paymentDate BETWEEN :start AND :end
    """)
    BigDecimal getRevenueBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
    SELECT 
        FUNCTION('DATE_FORMAT', p.paymentDate, '%Y-%m-%d'),
        SUM(p.amount)
    FROM Payment p
    WHERE p.status = com.ou.autorepairshop.entity.PaymentStatus.COMPLETED
    GROUP BY FUNCTION('DATE_FORMAT', p.paymentDate, '%Y-%m-%d')
    ORDER BY FUNCTION('DATE_FORMAT', p.paymentDate, '%Y-%m-%d')
""")
    List<Object[]> getRevenueRawByDay();
    // Doanh thu theo tháng
    @Query("""
    SELECT 
        FUNCTION('DATE_FORMAT', p.paymentDate, '%m/%Y'),
        SUM(p.amount)
    FROM Payment p
    WHERE p.status = com.ou.autorepairshop.entity.PaymentStatus.COMPLETED
    GROUP BY FUNCTION('DATE_FORMAT', p.paymentDate, '%m/%Y')
    ORDER BY FUNCTION('DATE_FORMAT', p.paymentDate, '%m/%Y')
""")
    List<Object[]> getRevenueRawByMonth();
    // Lấy payment theo khoảng thời gian
    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
    SELECT FUNCTION('DATE_FORMAT', p.paymentDate, '%Y'), SUM(p.amount)
    FROM Payment p
    WHERE p.status = com.ou.autorepairshop.entity.PaymentStatus.COMPLETED
    GROUP BY FUNCTION('DATE_FORMAT', p.paymentDate, '%Y')
    ORDER BY FUNCTION('DATE_FORMAT', p.paymentDate, '%Y')
""")
    List<Object[]> getRevenueRawByYear();


    @Query("""
    SELECT 
        CONCAT('Q', FUNCTION('QUARTER', p.paymentDate), '/', FUNCTION('YEAR', p.paymentDate)),
        SUM(p.amount)
    FROM Payment p
    WHERE p.status = com.ou.autorepairshop.entity.PaymentStatus.COMPLETED
    GROUP BY FUNCTION('YEAR', p.paymentDate), FUNCTION('QUARTER', p.paymentDate)
    ORDER BY FUNCTION('YEAR', p.paymentDate), FUNCTION('QUARTER', p.paymentDate)
""")
    List<Object[]> getRevenueRawByQuarter();

    @Query("""
SELECT s.name, SUM(ros.price * ros.quantity)
FROM Payment p
JOIN p.repairOrder ro
JOIN RepairOrderDetail ros ON ros.repairOrder = ro
JOIN ros.service s
WHERE p.status = 'PAID'
GROUP BY s.name
""")
    List<Object[]> getRevenueByService();
}