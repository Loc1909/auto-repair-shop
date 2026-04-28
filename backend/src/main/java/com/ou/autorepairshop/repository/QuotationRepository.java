package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.dto.QuotationNoDetailResponse;
import com.ou.autorepairshop.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    List<Quotation> findByRepairOrderId(Long repairOrderId);
    Optional<Quotation> findTopByRepairOrderIdOrderByCreatedAtDesc(Long repairOrderId);
    boolean existsByRepairOrderId(Long repairOrderId);

    @Query("""
                SELECT new com.ou.autorepairshop.dto.QuotationNoDetailResponse(
                    q.id,
                    q.status,
                    q.totalPrice,
                    q.createdAt,
                    ro.id
                )
                FROM Quotation q
                JOIN q.repairOrder ro
                JOIN ro.appointment a
                WHERE a.customer.id = :customerId
            """)
    List<QuotationNoDetailResponse> findMyQuotations(Long customerId);
}
