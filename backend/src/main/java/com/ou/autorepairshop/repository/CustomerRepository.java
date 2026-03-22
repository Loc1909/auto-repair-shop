package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Page<Customer> findByNameContainingIgnoreCaseOrPhoneContaining(
            String name, String phone, Pageable pageable
    );

}