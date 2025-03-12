package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Date;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum NotificationType {
        THICH, BINH_LUAN, KET_BAN, TIN_NHAN
    }

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private Integer referenceId;
    private String content;
    private boolean readStatus;
    private Date createdAt;

    public Notification() {}

    public Notification(Integer id, User user, NotificationType type, Integer referenceId, String content, boolean readStatus, Date createdAt) {
        this.id = id;
        this.user = user;
        this.type = type;
        this.referenceId = referenceId;
        this.content = content;
        this.readStatus = readStatus;
        this.createdAt = createdAt;
    }
}

