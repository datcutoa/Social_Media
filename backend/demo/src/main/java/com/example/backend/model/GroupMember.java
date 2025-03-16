package com.example.backend.model;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "group_members")
public class GroupMember {
    
    @EmbeddedId
    private GroupMemberId id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;
    
    // Liên kết với GroupEntity
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("groupId")
    @JoinColumn(name = "group_id", nullable = false)
    private GroupEntity group;
    
    // Liên kết với User
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Embeddable
    public static class GroupMemberId implements Serializable {
        
        @Column(name = "group_id")
        private Integer groupId;
        
        @Column(name = "user_id")
        private Integer userId;
        
        public GroupMemberId() {}
        
        public GroupMemberId(Integer groupId, Integer userId) {
            this.groupId = groupId;
            this.userId = userId;
        }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof GroupMemberId)) return false;
            GroupMemberId that = (GroupMemberId) o;
            return Objects.equals(groupId, that.groupId) &&
                   Objects.equals(userId, that.userId);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(groupId, userId);
        }
        
        // Getters and setters
        // ...
    }
    
    public enum Role {
        THANH_VIEN("Thành viên"),
        QUAN_TRI("Quản trị viên"),
        NGUOI_TAO("Người tạo");
        
        private final String value;
        Role(String value) { this.value = value; }
        public String getValue() { return value; }
    }
    

    public GroupMember() {
    }

    public GroupMember(GroupEntity group, User user, Role role) {
        this.group = group;
        this.user = user;
        this.role = role;
        this.id = new GroupMemberId(group.getId(), user.getId());
    }
    // Getters and setters
    // ...

    public GroupMemberId getId() {
        return id;
    }

    public void setId(GroupMemberId id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public GroupEntity getGroup() {
        return group;
    }

    public void setGroup(GroupEntity group) {
        this.group = group;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    
}
