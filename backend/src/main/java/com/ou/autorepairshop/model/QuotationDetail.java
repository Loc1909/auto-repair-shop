package com.ou.autorepairshop.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;

@Entity
public class QuotationDetail {//chi tiết báo giá

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    private double price;

    @ManyToOne
    private Quotation quotation;

    @ManyToOne
    private Part part;

    @ManyToOne
    private Service service;
}