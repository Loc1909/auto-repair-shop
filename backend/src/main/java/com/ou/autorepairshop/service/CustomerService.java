package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.CustomerResponse;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.repository.CustomerRepository;
import com.ou.autorepairshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

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

    public CustomerResponse getCustomerByUserId(Long id) {
        Customer customer = customerRepository.findByUserId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getAddress(),
                customer.getPhone());
    }

    public CustomerResponse getCustomerProfile() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Customer customer = user.getCustomer();

        if (customer == null) {
            throw new ResourceNotFoundException("Customer not found");
        }

        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getAddress(),
                customer.getPhone());
    }
}