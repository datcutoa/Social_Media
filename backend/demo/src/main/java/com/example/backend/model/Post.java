package com.example.backend.model;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Quan hệ với User
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @OneToMany
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private List<Media> mediaList = new ArrayList<>();
    
    
    public List<Media> getMediaList() {
        return mediaList;
    }
    
    public void setMediaList(List<Media> mediaList) {
        this.mediaList = mediaList;
    }
    
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Privacy privacy;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum Privacy {
        CONG_KHAI("Công khai"),
        BAN_BE("Bạn bè"),
        RIENG_TU("Riêng tư");
        
        private final String value;
        Privacy(String value) { this.value = value; }
        public String getValue() { return value; }
    }

    public Post() {
    }

    public Post(User user, String content, Privacy privacy) {
        this.user = user;
        this.content = content;
        this.privacy = privacy;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }



    public Privacy getPrivacy() {
        return privacy;
    }

    public void setPrivacy(Privacy privacy) {
        this.privacy = privacy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    
}
