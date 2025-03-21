package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

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
}
