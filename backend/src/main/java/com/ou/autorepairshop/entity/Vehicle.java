package com.ou.autorepairshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String licensePlate;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    private int year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
}
