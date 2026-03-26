package com.ou.autorepairshop.entity;

import com.ou.autorepairshop.entity.NotificationChannel;
import com.ou.autorepairshop.entity.NotificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "notification_config", indexes = {
        @Index(name = "idx_event_type", columnList = "event_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationEvent eventType;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<NotificationChannel> channels;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String template;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private NotificationStatus status = NotificationStatus.ACTIVE;

    @Builder.Default
    private Integer sendTimeOffset = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}