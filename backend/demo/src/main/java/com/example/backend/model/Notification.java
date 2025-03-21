package com.example.backend.model;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Liên kết với User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;
    
    @Column(name = "reference_id", nullable = false)
    private Integer referenceId;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "read_status", nullable = false)
    private boolean readStatus;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum Type {
        THICH("Thích"),
        BINH_LUAN("Bình luận"),
        KET_BAN("Kết bạn"),
        TIN_NHAN("Tin nhắn");
        
        private final String value;
        Type(String value) { this.value = value; }
        public String getValue() { return value; }
    }
    

    public Notification() {
    }

    public Notification(User user, Type type, Integer referenceId, String content, boolean readStatus) {
        this.user = user;
        this.type = type;
        this.referenceId = referenceId;
        this.content = content;
        this.readStatus = readStatus;
    }
    // Getters and setters
    // ...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Integer getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Integer referenceId) {
        this.referenceId = referenceId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isReadStatus() {
        return readStatus;
    }

    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    
}
