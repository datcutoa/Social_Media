package com.example.backend.service;

import com.example.backend.repository.MessageRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.model.User;
import com.example.backend.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.function.Function;
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

    public List<Map<String, Object>> getConversations(Long userId) {
        // Lấy tất cả tin nhắn mà userId là sender hoặc receiver
        List<Message> messages = messageRepository.findBySenderIdOrReceiverId(userId, userId);
    
        // Nhóm tin nhắn theo người dùng kia và tìm tin nhắn mới nhất
        Map<Long, Message> latestMessages = new HashMap<>();
        for (Message msg : messages) {
            // Lấy ID của người dùng nhận (receiver) hoặc người gửi (sender)
            Long otherUserId = msg.getSender().getId().equals(userId) ? msg.getReceiver().getId() : msg.getSender().getId();
            
            latestMessages.compute(otherUserId, (key, oldMsg) -> {
                if (oldMsg == null) return msg;
                return msg.getCreatedAt().isAfter(oldMsg.getCreatedAt()) ? msg : oldMsg;
            });
        }
    
        // Lấy danh sách tất cả người dùng liên quan đến cuộc hội thoại
        Set<Long> userIds = latestMessages.keySet();
        List<User> users = userRepository.findAllById(userIds);
    
        // Chuyển đổi thành danh sách các cuộc hội thoại
        List<Map<String, Object>> conversations = new ArrayList<>();
        for (Map.Entry<Long, Message> entry : latestMessages.entrySet()) {
            Long otherUserId = entry.getKey();
            Message lastMsg = entry.getValue();
    
            Long senderId = lastMsg.getSender().getId();  // Đây là ID người gửi tin nhắn cuối

            // Tìm thông tin người dùng
            User otherUser = users.stream()
                    .filter(user -> user.getId().equals(otherUserId))
                    .findFirst()
                    .orElse(null);
    
            if (otherUser != null) {
                // Tạo object hội thoại dưới dạng Map
                Map<String, Object> conversation = new HashMap<>();
                conversation.put("otherUserId", otherUserId);
                conversation.put("otherUserName", otherUser.getName()); // Giả định User có trường name
                conversation.put("avatarUrl", otherUser.getProfilePicture()); // Giả định User có trường avatarUrl
                conversation.put("lastMessage", lastMsg.getContent());
                conversation.put("senderId", senderId);
                conversations.add(conversation);
            }
        }
    
        return conversations;
    }
    
    
}
