package com.example.backend.model;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "follows")
public class Follow {
    
    @EmbeddedId
    private FollowId id;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Liên kết với User: follower
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("followerId")
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;
    
    // Liên kết với User: following
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("followingId")
    @JoinColumn(name = "following_id", nullable = false)
    private User following;
    
    @Embeddable
    public static class FollowId implements Serializable {
        
        @Column(name = "follower_id")
        private Long followerId;
        
        @Column(name = "following_id")
        private Long followingId;
        
        public FollowId() {}
        
        public FollowId(Long followerId, Long followingId) {
            this.followerId = followerId;
            this.followingId = followingId;
        }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof FollowId)) return false;
            FollowId that = (FollowId) o;
            return Objects.equals(followerId, that.followerId) &&
                   Objects.equals(followingId, that.followingId);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(followerId, followingId);
        }
        


        // Getters and setters
        // ...
    }

    public Follow() {
    }   
    
    public Follow(User follower, User following) {
        this.follower = follower;
        this.following = following;
        this.id = new FollowId(follower.getId(), following.getId());
    }
    // Getters and setters
    // ...


    public FollowId getId() {
        return id;
    }


    public void setId(FollowId id) {
        this.id = id;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public User getFollower() {
        return follower;
    }


    public void setFollower(User follower) {
        this.follower = follower;
    }


    public User getFollowing() {
        return following;
    }


    public void setFollowing(User following) {
        this.following = following;
    }

    
}
