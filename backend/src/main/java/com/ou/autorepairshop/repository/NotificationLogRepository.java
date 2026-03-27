package com.ou.autorepairshop.repository;

import com.ou.autorepairshop.entity.NotificationEvent;
import com.ou.autorepairshop.entity.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    boolean existsByAppointmentIdAndEventTypeAndSendTimeOffset(
            Long appointmentId,
            NotificationEvent eventType,
            int sendTimeOffset
    );
}