package com.example.backend.service;

import com.example.backend.model.Admin;
import com.example.backend.repository.AdminRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin login(String username, String password) {
        Admin admin = adminRepository.findByUsername(username);
        if (admin != null) {
            System.out.println("Admin found: " + admin.getUsername());
            System.out.println("Password in DB: " + admin.getPassword());
            if (admin.getPassword().trim().equals(password.trim())) {
                return admin;
            } else {
                System.out.println("Password does not match.");
            }
        } else {
            System.out.println("Admin not found.");
        }
        return null;
    }
  
    public Optional<Admin> adminlogin(String username, String password) {
        Admin admin = adminRepository.findByUsername(username);
    
        if (admin == null) {
            System.out.println("❌ Admin không tồn tại với username: " + username);
            return Optional.empty();
        }
    
        System.out.println("✅ Admin từ DB: " + admin.getUsername() + " - [" + admin.getPassword() + "]");
        System.out.println("✅ Password người dùng nhập: [" + password + "]");
    
        if (admin.getPassword().trim().equals(password.trim())) {
            System.out.println("🎉 Mật khẩu khớp!");
            return Optional.of(admin);
        } else {
            System.out.println("❌ Mật khẩu KHÔNG khớp!");
        }
    
        return Optional.empty();
    }
    
}