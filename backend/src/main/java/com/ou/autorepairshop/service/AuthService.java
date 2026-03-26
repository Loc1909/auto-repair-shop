package com.ou.autorepairshop.service;

import com.ou.autorepairshop.config.JwtProperties;
import com.ou.autorepairshop.dto.AuthResponse;
import com.ou.autorepairshop.dto.LoginRequest;
import com.ou.autorepairshop.dto.UserRegisterRequest;
import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Role;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.exception.DuplicateResourceException;
import com.ou.autorepairshop.exception.ResourceNotFoundException;
import com.ou.autorepairshop.mapper.UserMapper;
import com.ou.autorepairshop.repository.CustomerRepository;
import com.ou.autorepairshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtProperties jwtProperties;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final AuthenticationManager authManager;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);


    public UserResponse register(UserRegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username này đã tồn tại");
        } else if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email này đã tồn tại");
        }
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .active(true)
                .build();

        user.setRole(Role.ROLE_CUSTOMER);
        User s = userRepository.save(user);

        Customer customer = new Customer();
        customer.setName(request.username());
        customer.setUser(user);

        s.setCustomer(customer);

        customerRepository.save(customer);

        return UserResponse.fromEntity(s);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.emailOrUsername())
                .orElseGet(() -> userRepository.findByEmail(request.emailOrUsername())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), request.password()));
//        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
//            throw new RuntimeException("Invalid password");
//        }

        UserDetails userDetails = userDetailsService
                .loadUserByUsername(user.getUsername());

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        Long expiresIn = jwtProperties.getAccessTokenExpiresMs();

        return AuthResponse.of(accessToken,
                refreshToken,
                "Bearer",
                expiresIn,
                UserResponse.fromEntity(user));
//                userMapper.toResponse(user));
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        if (authentication != null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("Chưa đăng nhập");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() ->
                new ResourceNotFoundException("User", username));

        return userMapper.toResponse(user);
    }
}
