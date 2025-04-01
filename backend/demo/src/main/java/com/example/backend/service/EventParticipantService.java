package com.example.backend.service;


import com.example.backend.model.EventParticipant;
import com.example.backend.model.EventParticipant.EventParticipantId;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.repository.EventParticipantRepository;
import com.example.backend.repository.EventRepository;    
import com.example.backend.repository.UserRepository;
import com.example.backend.model.EventParticipant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EventParticipantService {

    @Autowired
    private EventParticipantRepository eventParticipantRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Tham gia sự kiện: tạo bản ghi trong event_participants
    @Transactional
    public void joinEvent(Long eventId, Long userId, EventParticipant.Status status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event không tồn tại"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));
        EventParticipant.EventParticipantId id = new EventParticipant.EventParticipantId(eventId, userId);
        EventParticipant ep = new EventParticipant();
        ep.setId(id);
        ep.setEvent(event);
        ep.setUser(user);
        ep.setStatus(status);
        eventParticipantRepository.save(ep);
    }
    
    // Lấy danh sách user tham gia theo event id
    public List<User> getParticipantsByEventId(Long eventId) {
        return eventParticipantRepository.findParticipantsByEventId(eventId);
    }
    
    // Lấy danh sách sự kiện mà một user đã tham gia
    public List<Event> getEventsByUserId(Long userId) {
        return eventParticipantRepository.findEventsByUserId(userId,EventParticipant.Status.THAM_GIA);
    }
    
    // Rời khỏi sự kiện
    @Transactional
    public void leaveEvent(Long eventId, Long userId) {
        EventParticipant.EventParticipantId id = new EventParticipant.EventParticipantId(eventId, userId);
        eventParticipantRepository.deleteById(id);
    }
    
    // Cập nhật trạng thái tham gia của user đối với sự kiện
    @Transactional
    public void updateParticipantStatus(Long eventId, Long userId, EventParticipant.Status newStatus) {
        EventParticipant.EventParticipantId id = new EventParticipant.EventParticipantId(eventId, userId);
        Optional<EventParticipant> optionalEp = eventParticipantRepository.findById(id);
        if(optionalEp.isPresent()){
            EventParticipant ep = optionalEp.get();
            ep.setStatus(newStatus);
            eventParticipantRepository.save(ep);
        } else {
            throw new IllegalArgumentException("Bản ghi tham gia không tồn tại");
        }
    }
}