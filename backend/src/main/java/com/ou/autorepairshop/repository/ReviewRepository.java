package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByRepairOrderId(Long repairOrderId);

    List<Review> findByCustomerId(Long customerId);

    List<Review> findByRepairOrderIdOrderByCreatedDateDesc(Long repairOrderId);

    @Query("""
                SELECT AVG(r.rating)
                FROM Review r
                JOIN r.repairOrder ro
                JOIN ro.quotations q
                JOIN q.details d
                WHERE d.service.id = :serviceId
            """)
    Double getAverageRatingByServiceId(@Param("serviceId") Long serviceId);
}
