package com.ou.autorepairshop.service;

import com.ou.autorepairshop.dto.UserAdminRequest;
import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Employee;
import com.ou.autorepairshop.entity.Role;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.repository.CustomerRepository;
import com.ou.autorepairshop.repository.EmployeeRepository;
import com.ou.autorepairshop.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ou.autorepairshop.entity.Role.ROLE_CUSTOMER;
import static com.ou.autorepairshop.entity.Role.ROLE_STAFF;

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


    @Transactional
    public User createUser(UserAdminRequest req) {

        if (userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        if (req.getRole() == Role.ROLE_ADMIN) {
            throw new RuntimeException("Không được phép tạo admin");
        }

        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .email(req.getEmail().toLowerCase())
                .role(req.getRole())
                .active(true)
                .build();

        try {
            User savedUser = userRepository.save(user);

            switch (savedUser.getRole()) {
                case ROLE_STAFF ->
                        employeeRepository.save(Employee.builder().user(savedUser).build());

                case ROLE_CUSTOMER ->
                        customerRepository.save(Customer.builder().user(savedUser).build());
            }

            return savedUser;

        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Username hoặc Email đã tồn tại");
        }
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

        // ===== UPDATE SAFE =====
        if (updatedUser.getUsername() != null) {
            existing.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getEmail() != null) {
            existing.setEmail(updatedUser.getEmail());
        }

        // boolean vẫn update bình thường
        existing.setActive(updatedUser.isActive());

        if (updatedUser.getRole() != null) {
            existing.setRole(updatedUser.getRole());
        }

        // ===== PASSWORD  =====
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existing.setPassword(updatedUser.getPassword());
//             👉 nếu có encode thì:
             existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
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


    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(String search, Pageable pageable) {
        Page<User> page;

        if (search != null && !search.trim().isEmpty()) {
            page = userRepository.searchUsers(search, pageable);
        } else {
            page = userRepository.findAll(pageable);
        }

        return page.map(UserResponse::fromEntity);
    }
}