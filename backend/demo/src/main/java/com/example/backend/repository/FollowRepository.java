package com.example.backend.repository;
import com.example.backend.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FollowRepository extends JpaRepository<Follow, Long> {
    
}
