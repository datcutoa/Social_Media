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


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public String getLocation() {
        return location;
    }


    public void setLocation(String location) {
        this.location = location;
    }


    public LocalDateTime getStartTime() {
        return startTime;
    }


    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }


    public LocalDateTime getEndTime() {
        return endTime;
    }


    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
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


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }


    public List<EventParticipant> getParticipants() {
        return participants;
    }


    public void setParticipants(List<EventParticipant> participants) {
        this.participants = participants;
    }
    
}

