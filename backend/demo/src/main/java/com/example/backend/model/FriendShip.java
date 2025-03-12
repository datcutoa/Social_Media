package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Date;

@Entity
public class FriendShip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_id", nullable = false)
    private User friend;

    public enum FriendshipStatus {
        DANG_CHO, DA_KET_BAN, DA_TU_CHOI
    }

    @Enumerated(EnumType.STRING)
    private FriendshipStatus status;

    private Date createdAt;

    public FriendShip() {}

    public FriendShip(Integer id, User user, User friend, FriendshipStatus status, Date createdAt) {
        this.id = id;
        this.user = user;
        this.friend = friend;
        this.status = status;
        this.createdAt = createdAt;
    }
}

