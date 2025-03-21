package com.example.backend.service;

import com.example.backend.repository.EventRepository;
import com.example.backend.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public void createEvent(Event event) {
        eventRepository.save(event);
    }

    public void updateEvent(Long eventId, Event newEvent) {
        if (eventRepository.existsById(eventId)) {
            newEvent.setId(eventId); // Đảm bảo ID giữ nguyên
            eventRepository.save(newEvent);
        }
    }
}
