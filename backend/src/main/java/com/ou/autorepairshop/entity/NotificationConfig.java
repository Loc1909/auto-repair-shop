package com.ou.autorepairshop.entity;

import jakarta.persistence.*;
import lombok.*;
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

    // ================= CHANNELS =================
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "notification_config_channels",
            joinColumns = @JoinColumn(name = "notification_config_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "channels")
    private Set<NotificationChannel> channels;

    // ================= TEMPLATE =================

    // PUSH
    @Column(name = "template_push", columnDefinition = "TEXT")
    private String templatePush;

    // EMAIL
    @Column(name = "template_email", columnDefinition = "TEXT")
    private String templateEmail;

    // ================= STATUS =================

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private NotificationStatus status = NotificationStatus.ACTIVE;

    @Builder.Default
    private Integer sendTimeOffset = 0;

    // ================= AUDIT =================

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}