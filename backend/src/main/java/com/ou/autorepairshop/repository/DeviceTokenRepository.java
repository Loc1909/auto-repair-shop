package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {

    Optional<DeviceToken> findByToken(String token);

    List<DeviceToken> findByUserIdAndActiveTrue(Long userId);

    List<DeviceToken> findByActiveTrue();

    void deleteByToken(String token);
}