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
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long userId
    ) {
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
}