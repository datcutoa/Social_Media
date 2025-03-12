package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Date;

@Entity

public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String content;
    private String mediaUrl;
    public enum Privacy {
        CONG_KHAI, BAN_BE, RIENG_TU
    }
    @Enumerated(EnumType.STRING)
    private Privacy privacy;

    private Date createdAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Like> likes;

    public Post() {}

    public Post(Integer id, User user, String content, String mediaUrl, Privacy privacy, Date createdAt,
            List<Comment> comments, List<Like> likes) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.mediaUrl = mediaUrl;
        this.privacy = privacy;
        this.createdAt = createdAt;
        this.comments = comments;
        this.likes = likes;
    }
    
}

