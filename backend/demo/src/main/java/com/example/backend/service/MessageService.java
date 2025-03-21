package com.example.backend.service;

import com.example.backend.repository.MessageRepository;
import com.example.backend.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
            
    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Optional<Message> getMessageById(Long messageId) {
        return messageRepository.findById(messageId);
    }

    public void deleteMessage(Long messageId) {
        messageRepository.deleteById(messageId);
    }

    public void createMessage(Message message) {
        messageRepository.save(message);
    }

    public void updateMessage(Long messageId, Message newMessage) {
        if (messageRepository.existsById(messageId)) {
            newMessage.setId(messageId); // Đảm bảo ID giữ nguyên
            messageRepository.save(newMessage);
        }
    }
}
