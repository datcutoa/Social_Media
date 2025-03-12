package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Date;

@Entity
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum Role {
        THANH_VIEN, QUAN_TRI_VIEN, NGUOI_TAO
    }

    @Enumerated(EnumType.STRING)
    private Role role;

    private Date joinedAt;

    public GroupMember() {}

    public GroupMember(Integer id, Group group, User user, Role role, Date joinedAt) {
        this.id = id;
        this.group = group;
        this.user = user;
        this.role = role;
        this.joinedAt = joinedAt;
    }
}

