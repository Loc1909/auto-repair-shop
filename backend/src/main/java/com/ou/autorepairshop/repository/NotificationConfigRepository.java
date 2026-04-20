package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.NotificationConfig;
import com.ou.autorepairshop.entity.NotificationEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationConfigRepository extends JpaRepository<NotificationConfig, Long> {

    List<NotificationConfig> findAllByEventType(NotificationEvent eventType);
    Page<NotificationConfig> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
