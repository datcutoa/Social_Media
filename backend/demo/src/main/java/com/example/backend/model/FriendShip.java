package com.example.backend.model;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "friendships")
public class FriendShip {
    
    @EmbeddedId
    private FriendshipId id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Liên kết với User (user)
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Liên kết với User (friend)
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("friendId")
    @JoinColumn(name = "friend_id", nullable = false)
    private User friend;
    
    @Embeddable
    public static class FriendshipId implements Serializable {
        
        @Column(name = "user_id")
        private Integer userId;
        
        @Column(name = "friend_id")
        private Integer friendId;
        
        public FriendshipId() {}
        
        public FriendshipId(Integer userId, Integer friendId) {
            this.userId = userId;
            this.friendId = friendId;
        }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof FriendshipId)) return false;
            FriendshipId that = (FriendshipId) o;
            return Objects.equals(userId, that.userId) &&
                   Objects.equals(friendId, that.friendId);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(userId, friendId);
        }
        
        // Getters and setters
        // ...
    }
    
    public enum Status {
        DANG_CHO("Đang chờ"),
        DA_KET_BAN("Đã kết bạn"),
        DA_TU_CHOI("Đã từ chối");
        
        private final String value;
        Status(String value) { this.value = value; }
        public String getValue() { return value; }
    }
    

    public FriendShip() {
    }

    public FriendShip(User user, User friend, Status status) {
        this.user = user;
        this.friend = friend;
        this.status = status;
        this.id = new FriendshipId(user.getId(), friend.getId());
    }
    // Getters and setters
    // ...

    public FriendshipId getId() {
        return id;
    }

    public void setId(FriendshipId id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getFriend() {
        return friend;
    }

    public void setFriend(User friend) {
        this.friend = friend;
    }

    
}
