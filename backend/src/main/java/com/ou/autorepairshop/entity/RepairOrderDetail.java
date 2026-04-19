package com.ou.autorepairshop.entity;

import com.ou.autorepairshop.enums.ItemType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "repair_order_details",
        indexes = {
                @Index(name = "idx_repair_order_id", columnList = "repair_order_id")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairOrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // liên kết với repair order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_order_id", nullable = false)
    private RepairOrder repairOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType itemType;

    @Column(nullable = false)
    private Integer quantity;

    // giá tại thời điểm sửa
    @Column(nullable = false)
    private BigDecimal price;

    // PART
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    private Part part;

    // SERVICE
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private RepairService service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_detail_id")
    private QuotationDetail quotationDetail;

    //  helper method
    public BigDecimal getTotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }

    // validate logic
    @PrePersist
    @PreUpdate
    private void validate() {
        if (itemType == ItemType.PART) {
            if (part == null || service != null) {
                throw new IllegalStateException("Invalid PART detail");
            }
        }

        if (itemType == ItemType.SERVICE) {
            if (service == null || part != null) {
                throw new IllegalStateException("Invalid SERVICE detail");
            }
        }
    }
}