package com.ou.autorepairshop.config;

import com.ou.autorepairshop.security.CustomAccessDeniedHandler;
import com.ou.autorepairshop.service.JwtAuthenticationEntryPoint;
import com.ou.autorepairshop.service.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtAuthenticationEntryPoint jwtAuthEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          JwtAuthenticationEntryPoint jwtAuthEntryPoint,
                          CustomAccessDeniedHandler accessDeniedHandler) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> {
                })  // <--- thêm cors Customizer rỗng
                .csrf(csrf -> csrf.disable()) // tắt CSRF cho dev
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/quotations/**").hasAnyRole("ADMIN", "CUSTOMER", "STAFF")
                                .requestMatchers("/api/appointments/**").hasAnyRole("ADMIN", "CUSTOMER", "STAFF")
                                .requestMatchers("/api/reviews/**").hasAnyRole("ADMIN", "CUSTOMER", "STAFF")
                                .requestMatchers("/api/repair-orders/**").hasAnyRole("ADMIN", "CUSTOMER", "STAFF")
                                .requestMatchers("/api/part-requests/**").hasAnyRole("ADMIN", "STAFF")
                                .requestMatchers("/api/repair-progress/**").hasAnyRole("ADMIN", "CUSTOMER", "STAFF")
                                .requestMatchers("/api/repair-order-service/**").hasAnyRole("ADMIN", "STAFF")
                                .requestMatchers(HttpMethod.GET, "/api/customers/user/**").permitAll()
                                .requestMatchers("/api/customers/**").hasAnyRole("ADMIN", "CUSTOMER","STAFF")
                                .requestMatchers("/api/vehicles/**").hasAnyRole("ADMIN", "CUSTOMER","STAFF")
                                .anyRequest().authenticated()) //hoặc authenticated() -> tăng bảo mật, yêu cầu tất cả api khác cần login
                .exceptionHandling(ex
                        -> ex.authenticationEntryPoint(jwtAuthEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtService jwtService,
                                                           UserDetailsService userDetailsService) {
        return new JwtAuthenticationFilter(jwtService, userDetailsService);
    }
}