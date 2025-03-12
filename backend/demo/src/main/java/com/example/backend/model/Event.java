package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Date;
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String description;
    private String location;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public enum Privacy {
        CONG_KHAI, BAN_BE, RIENG_TU
    }
    
    @Enumerated(EnumType.STRING)
    private Privacy privacy;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Người tạo sự kiện

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventParticipant> participants; // Những người tham gia sự kiện

    // Constructor
    public Event() {}


    public Event(Integer id, String name, String description, String location, LocalDateTime startTime, LocalDateTime endTime, Privacy privacy, LocalDateTime createdAt, User user, List<EventParticipant> participants) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.privacy = privacy;
        this.createdAt = createdAt;
        this.user = user;
        this.participants = participants;
    }
    // Getter & Setter
    
}

