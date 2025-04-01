package com.example.backend.model;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "event_participants")
public class EventParticipant {
    
    @EmbeddedId
    private EventParticipantId id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
    
    @CreationTimestamp
    @Column(name = "responded_at", nullable = false, updatable = false)
    private LocalDateTime respondedAt;
    
    // Liên kết với Event
    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("eventId")
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    // Liên kết với User
    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Embeddable key
    @Embeddable
    public static class EventParticipantId implements Serializable {
        
        @Column(name = "event_id")
        private Long eventId;
        
        @Column(name = "user_id")
        private Long userId;
        
        public EventParticipantId() {}
        
        public EventParticipantId(Long eventId, Long userId) {
            this.eventId = eventId;
            this.userId = userId;
        }
        
        // equals and hashCode
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof EventParticipantId)) return false;
            EventParticipantId that = (EventParticipantId) o;
            return Objects.equals(eventId, that.eventId) &&
                   Objects.equals(userId, that.userId);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(eventId, userId);
        }
        
        // Getters and setters
        // ...
    }
    
    public enum Status {
        THAM_GIA("Tham gia"),
        QUAN_TAM("Quan tâm"),
        KHONG_THAM_GIA("Không tham gia");
        
        private final String value;
        Status(String value) { this.value = value; }
        public String getValue() { return value; }
    }
    

    public EventParticipant() {
    }

    public EventParticipant(EventParticipantId id, Status status) {
        this.id = id;
        this.status = status;
    }
    // Getters and setters
    // ...

    public EventParticipantId getId() {
        return id;
    }

    public void setId(EventParticipantId id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}