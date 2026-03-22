package com.ou.autorepairshop.controller;

import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.service.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // ================= GET =================
//    @GetMapping
//    public List<Customer> getCustomers() {
//        return customerService.getAllCustomers();
//    }

    // ================= CREATE =================
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id,
                                   @RequestBody Customer customer) {
        return customerService.updateCustomer(id, customer);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }


    //PAGINATION
    @GetMapping
    public Page<Customer> getCustomers(
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        return customerService.getCustomers(search, pageable);
    }
}