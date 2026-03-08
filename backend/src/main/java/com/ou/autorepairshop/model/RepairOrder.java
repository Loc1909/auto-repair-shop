package com.ou.autorepairshop.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class RepairOrder { //phiếu sửa xe

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdDate;

    private String status;
    // pending, quoting, approved, repairing, completed

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private Employee employee;
}
