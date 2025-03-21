package com.example.backend.service;

import com.example.backend.model.EventParticipant;
import com.example.backend.repository.EventParticipantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventParticipantService {
    

    private final EventParticipantRepository eventParticipantRepository;
    

    public EventParticipantService(EventParticipantRepository eventParticipantRepository) {
        this.eventParticipantRepository = eventParticipantRepository;
    }

    public List<EventParticipant> getAllEventParticipants() {
        return eventParticipantRepository.findAll();
    }

    public void createEventParticipant(EventParticipant eventParticipant) {
        eventParticipantRepository.save(eventParticipant);
    }

    public void deleteEventParticipant(Long eventParticipantId) {
        eventParticipantRepository.deleteById(eventParticipantId);
    }
}
