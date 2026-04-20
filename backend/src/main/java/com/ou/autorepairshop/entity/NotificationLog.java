package com.ou.autorepairshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_log",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"appointment_id", "event_type", "send_time_offset"}
        ))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appointmentId;

    @Enumerated(EnumType.STRING)
    private NotificationEvent eventType;

    private Integer sendTimeOffset;

    private LocalDateTime sentAt;
}