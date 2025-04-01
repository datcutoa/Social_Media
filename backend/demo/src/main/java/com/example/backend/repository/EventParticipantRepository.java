package com.example.backend.repository;
import com.example.backend.model.EventParticipant;
import com.example.backend.model.EventParticipant.EventParticipantId;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
public interface EventParticipantRepository extends JpaRepository<EventParticipant, EventParticipant.EventParticipantId> {
        // Lấy danh sách user tham gia sự kiện (dựa theo event id)
        @Query("SELECT ep.user FROM EventParticipant ep WHERE ep.event.id = :eventId")
        List<User> findParticipantsByEventId(Long eventId);
        
        // Lấy danh sách sự kiện mà user đã tham gia (với trạng thái THAM_GIA)
        @Query("SELECT ep.event FROM EventParticipant ep WHERE ep.user.id = :userId AND ep.status = :status")
        List<Event> findEventsByUserId(@Param("userId") Long userId, @Param("status") EventParticipant.Status status);
        
}