package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.model.QuotationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuotationDetailRepository extends JpaRepository<QuotationDetail, Long> {
    List<QuotationDetail> findByQuotationId(Long quotationId);
}
