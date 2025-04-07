package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.EntityExistsException;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Collections;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.LocalTime;
import java.time.LocalDateTime;
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public void createUser(User user) {
        userRepository.save(user);
    }

    public void updateUser(Long userId, User newUser) {
        if (userRepository.existsById(userId)) {
            newUser.setId(userId); // Đảm bảo ID giữ nguyên
            userRepository.save(newUser);
        }
    }

    // public void updateUserColumn(String column, String value, Long userId) {
    //     if (userRepository.existsById(userId)) {
    //         userRepository.updateUserColumn(column, value, userId);
    //     }
    // }

    public List<User> searchUsersByName(String query) {
        // Tìm kiếm trong database, ví dụ:
        return userRepository.findByUsernameContainingIgnoreCase(query);
    }

    public Optional<User> findByUsernameAndPassword(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    public void updateAvatar(Long userId, String newAvatar) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setProfilePicture(newAvatar);
            userRepository.save(user);
        } else {
            throw new EntityNotFoundException("User not found with ID: " + userId);
        }
    }

    public void updateCoverPhoto(Long userId, String newAvatar) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setCoverPhoto(newAvatar);
            userRepository.save(user);
        } else {
            throw new EntityNotFoundException("User not found with ID: " + userId);
        }
    }

    public long getUserCount() {
        return userRepository.count(); // Sử dụng count() để đếm số lượng người dùng
    }

    public void updateUserStatus(Long id, int newStatus) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setStatus(newStatus);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    public void changePassword(Long id, String oldPassword, String newPassword) throws Exception {
        // Lấy thông tin người dùng
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();

        // Kiểm tra mật khẩu cũ
        if (!user.getPassword().equals(oldPassword)) {
            throw new Exception("Mật khẩu cũ không đúng");
        }

        // Kiểm tra mật khẩu mới có khác mật khẩu cũ không
        if (newPassword.equals(oldPassword)) {
            throw new Exception("Mật khẩu mới phải khác mật khẩu cũ");
        }

        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length() < 6) {
            throw new Exception("Mật khẩu mới phải có ít nhất 6 ký tự");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(newPassword);
        userRepository.save(user);
    }
}