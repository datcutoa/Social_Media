package com.example.backend.repository;
import com.example.backend.model.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    
}
