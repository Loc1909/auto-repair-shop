package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.ReviewRequest;
import com.ou.autorepairshop.dto.ReviewResponse;
import com.ou.autorepairshop.entity.*;
import com.ou.autorepairshop.enums.RepairStatus;
import com.ou.autorepairshop.exception.BadRequestException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final CustomerRepository customerRepository;
    private final RepairServiceRepository repairServiceRepository;

    public ReviewResponse createReview(ReviewRequest request) {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        RepairOrder repairOrder = repairOrderRepository
                .findByIdAndVehicleCustomerId(request.repairOrderId(), customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Repair order not found"));

        if (!repairOrder.getStatus().equals(RepairStatus.COMPLETED)) {
            throw new BadRequestException("Orders didn't finish to review");
        }

        if (reviewRepository.findByRepairOrderId(request.repairOrderId()).isPresent()) {
            throw new BadRequestException("You already reviewed this order");
        }

        Review review = Review.builder()
                .rating(request.rating())
                .comment(request.comment())
                .createdDate(LocalDateTime.now())
                .customer(customer)
                .repairOrder(repairOrder)
                .build();

        reviewRepository.save(review);

        return toResponse(review);
    }

    public List<ReviewResponse> getMyReviews() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return reviewRepository.findByCustomerId(customer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsByRepairOrder(Long repairOrderId) {
        return reviewRepository.findByRepairOrderIdOrderByCreatedDateDesc(repairOrderId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedDate(),
                review.getCustomer().getId(),
                review.getCustomer().getName(),
                review.getRepairOrder().getId()
        );
    }

}
