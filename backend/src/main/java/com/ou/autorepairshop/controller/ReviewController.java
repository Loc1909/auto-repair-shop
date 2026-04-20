package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.ReviewRequest;
import com.ou.autorepairshop.dto.ReviewResponse;
import com.ou.autorepairshop.service.RepairServiceService;
import com.ou.autorepairshop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final RepairServiceService repairServiceService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    /**
     * Xem các đánh giá cuủa mình
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ReviewResponse>> getMyReviews() {
        return ResponseEntity.ok(reviewService.getMyReviews());
    }

    /**
     * Xem review theo repairOrderId
     */
    @GetMapping("/repair-orders/{id}")
    public ResponseEntity<List<ReviewResponse>> getByRepairOrder(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsByRepairOrder(id));
    }

    /**
     *  Trả về tổng trung bình các đánh giá của dựa theo serviceId
     */
    @GetMapping("service-rating/{id}")
    public ResponseEntity<?> getAverageRating(@PathVariable Long id) {

        Double avg = repairServiceService.getAverageRating(id);

        return ResponseEntity.ok(Map.of(
                "serviceId", id,
                "averageRating", avg
        ));
    }
}
