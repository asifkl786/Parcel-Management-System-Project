package com.pms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "settings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id","setting_key"})
})
@Data
public class Setting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId; // null => global

    private String category;
    @Column(name = "setting_key")
    private String settingKey;

    @Column(columnDefinition = "TEXT")
    private String settingValue;

    private String settingType;
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void preUpdate() { updatedAt = Instant.now(); }
    @PrePersist
    public void prePersist() { if (updatedAt == null) updatedAt = Instant.now(); }

    // getters & setters
}
