package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.dto.AddServiceRequest;
import com.ou.autorepairshop.service.RepairOrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff/repair-order-service")
public class RepairOrderServiceController {

    @Autowired
    private RepairOrderDetailService service;

    @PostMapping("/add")
    public String addService(@RequestBody AddServiceRequest request) {
        service.addService(request);
        return "Service added successfully";
    }
}