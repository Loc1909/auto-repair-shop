package com.ou.autorepairshop.entity;

import com.ou.autorepairshop.enums.PartRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "part_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int requestedQuantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PartRequestStatus status;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_order_id", nullable = false)
    private RepairOrder repairOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id", nullable = false)
    private Part part;

    @PrePersist
    public void prePersist() {
        this.requestedAt = LocalDateTime.now();
    }
}

