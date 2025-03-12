package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Date;

@Entity

public class EventParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum EventStatus {
        THAM_GIA, QUAN_TAM, KHONG_THAM_GIA
    }

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    private Date respondedAt;

    public EventParticipant() {}

    public EventParticipant(Integer id, Event event, User user, EventStatus status, Date respondedAt) {
        this.id = id;
        this.event = event;
        this.user = user;
        this.status = status;
        this.respondedAt = respondedAt;
    }
}

