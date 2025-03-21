package com.example.backend.service;

import com.example.backend.model.Notification;
import com.example.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void createNotification(Notification notification) {
        notificationRepository.save(notification);
    }

    public void updateNotification(Long notificationId, Notification newNotification) {
        if (notificationRepository.existsById(notificationId)) {
            newNotification.setId(notificationId); // Đảm bảo ID giữ nguyên
            notificationRepository.save(newNotification);
        }
    }

    
}
