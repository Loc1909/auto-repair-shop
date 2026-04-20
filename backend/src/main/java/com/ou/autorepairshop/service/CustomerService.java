package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer c) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        existing.setName(c.getName());
        existing.setPhone(c.getPhone());
        existing.setAddress(c.getAddress());

        return customerRepository.save(existing);
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found");
        }
        customerRepository.deleteById(id);
    }


    public Page<Customer> getCustomers(String search, Pageable pageable) {

        if (search != null && !search.trim().isEmpty()) {
            return customerRepository
                    .findByNameContainingIgnoreCaseOrPhoneContaining(
                            search.trim(),
                            search.trim(),
                            pageable
                    );
        }

        return customerRepository.findAll(pageable);
    }
}