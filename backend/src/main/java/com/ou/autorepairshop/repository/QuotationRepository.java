package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.model.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    Optional<Quotation> findByRepairOrderId(Long repairOrderId);
    boolean existsByRepairOrderId(Long repairOrderId);
}
