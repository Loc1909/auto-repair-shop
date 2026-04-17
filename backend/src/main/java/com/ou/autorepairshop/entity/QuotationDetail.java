package com.ou.autorepairshop.entity;

import com.ou.autorepairshop.enums.ItemType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "quotation_details",
        indexes = {
                @Index(name = "idx_quotation_id", columnList = "quotation_id")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType itemType;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private BigDecimal unitPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id", nullable = false)
    private Quotation quotation;

    // PART
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    private Part part;

    // SERVICE
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private RepairService service;

    // helper
    public BigDecimal getTotal() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    //  validate logic
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