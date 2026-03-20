package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.Payment;
import com.ou.autorepairshop.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Lấy payment theo trạng thái
    List<Payment> findByStatus(PaymentStatus status);

    // 🔥 Tổng doanh thu (chỉ tính COMPLETED)
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    Double getTotalRevenue();

    // 🔥 Doanh thu theo khoảng thời gian
    @Query("""
        SELECT SUM(p.amount) 
        FROM Payment p 
        WHERE p.status = 'COMPLETED'
        AND p.paymentDate BETWEEN :start AND :end
    """)
    Double getRevenueBetween(LocalDateTime start, LocalDateTime end);

    // 🔥 Lấy danh sách payment trong khoảng thời gian
    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);
}