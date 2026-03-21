package com.ou.autorepairshop.service;

import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.entity.Role;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.repository.CustomerRepository;
import com.ou.autorepairshop.repository.EmployeeRepository;
import com.ou.autorepairshop.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;

    public UserService(UserRepository userRepository,
                       EmployeeRepository employeeRepository,
                       CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public User createUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        if(savedUser.getRole() == Role.ROLE_STAFF){

            Employee employee = Employee.builder()
                    .user(savedUser)
                    .build();

            employeeRepository.save(employee);
        }

        if(savedUser.getRole() == Role.ROLE_CUSTOMER){

            Customer customer = Customer.builder()
                    .user(savedUser)
                    .build();

            customerRepository.save(customer);
        }

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // update field
        existing.setEmail(updatedUser.getEmail());
        existing.setActive(updatedUser.isActive());

        // update role nếu cần
        if (updatedUser.getRole() != null) {
            existing.setRole(updatedUser.getRole());
        }

        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // xóa employee nếu có
        if (user.getEmployee() != null) {
            employeeRepository.delete(user.getEmployee());
        }

        // xóa customer nếu có
        if (user.getCustomer() != null) {
            customerRepository.delete(user.getCustomer());
        }

        // xóa user
        userRepository.delete(user);
    }
}