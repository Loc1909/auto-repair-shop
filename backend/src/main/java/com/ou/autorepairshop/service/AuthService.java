package com.ou.autorepairshop.service;

import com.ou.autorepairshop.config.JwtProperties;
import com.ou.autorepairshop.dto.AuthResponse;
import com.ou.autorepairshop.dto.LoginRequest;
import com.ou.autorepairshop.dto.UserRegisterRequest;
import com.ou.autorepairshop.dto.UserResponse;
import com.ou.autorepairshop.entity.Customer;
import com.ou.autorepairshop.entity.Role;
import com.ou.autorepairshop.entity.User;
import com.ou.autorepairshop.mapper.UserMapper;
import com.ou.autorepairshop.repository.CustomerRepository;
import com.ou.autorepairshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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


    public UserResponse register(UserRegisterRequest request) {
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
        customerRepository.save(customer);

        return UserResponse.fromEntity(s);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.emailOrUsername())
                .orElseGet(() -> userRepository.findByEmail(request.emailOrUsername())
                        .orElseThrow(() -> new RuntimeException("User not found")));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        UserDetails userDetails = userDetailsService
                .loadUserByUsername(user.getUsername());

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return AuthResponse.of(accessToken,
                refreshToken,
                null,
                jwtProperties.getRefreshTokenExpiresToken(),
                userMapper.toResponse(user));
    }

}
