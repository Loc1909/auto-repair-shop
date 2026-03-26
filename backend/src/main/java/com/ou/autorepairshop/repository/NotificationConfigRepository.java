package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.NotificationConfig;
import com.ou.autorepairshop.entity.NotificationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationConfigRepository extends JpaRepository<NotificationConfig, Long> {

    Optional<NotificationConfig> findByEventType(NotificationEvent eventType);
}