package com.example.backend.service;

import com.example.backend.repository.MessageRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.model.User;
import com.example.backend.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
            
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

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

    public Message sendMessage(Message message) throws Exception {
        // Lấy ID của sender và receiver từ message
        Long senderId = message.getSender().getId();
        Long receiverId = message.getReceiver().getId();

        // Kiểm tra sender có tồn tại không
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new Exception("Sender not found with ID: " + senderId));

        // Kiểm tra receiver có tồn tại không
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new Exception("Receiver not found with ID: " + receiverId));

        // Gán lại sender và receiver từ database
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setReadStatus(false); // Mặc định tin nhắn chưa đọc

        // Lưu tin nhắn vào database
        return messageRepository.save(message);
    }

    public List<Message> getMessagesBetweenUsers(Long userId1, Long userId2) {
        // Xác thực tham số
        if (userId1 == null || userId2 == null) {
            throw new IllegalArgumentException("User IDs cannot be null");
        }
        if (userId1.equals(userId2)) {
            throw new IllegalArgumentException("User IDs must be different");
        }
        // Gọi repository để lấy danh sách tin nhắn
        return messageRepository.findMessagesBetweenUsers(userId1, userId2);
    }
}
