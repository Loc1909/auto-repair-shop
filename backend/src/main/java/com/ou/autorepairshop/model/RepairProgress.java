package com.ou.autorepairshop.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class RepairProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private String note;

    private LocalDateTime updateTime;

    @ManyToOne
    private RepairOrder repairOrder;
}