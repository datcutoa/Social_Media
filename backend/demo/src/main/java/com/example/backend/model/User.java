package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;
import java.util.List;

@Entity

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String email;
    private String password;
    private String name;
    private String bio;
    private String profilePicture;
    private String coverPhoto;
    public enum Gender {
        NAM, NU, KHAC
    }

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Date birthdate;
    private Date createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    private List<Message> sentMessages;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    private List<Message> receivedMessages;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Notification> notifications;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Like> likes;

    public User() {}

    public User(Integer id, String username, String email, String password, String name, String bio,
            String profilePicture, String coverPhoto, Gender gender, Date birthdate, Date createdAt, List<Post> posts,
            List<Comment> comments, List<Message> sentMessages, List<Message> receivedMessages,
            List<Notification> notifications, List<Like> likes) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.coverPhoto = coverPhoto;
        this.gender = gender;
        this.birthdate = birthdate;
        this.createdAt = createdAt;
        this.posts = posts;
        this.comments = comments;
        this.sentMessages = sentMessages;
        this.receivedMessages = receivedMessages;
        this.notifications = notifications;
        this.likes = likes;
    }
    
}

