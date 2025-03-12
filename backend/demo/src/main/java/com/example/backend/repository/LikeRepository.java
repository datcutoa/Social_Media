package com.example.backend.repository;
import com.example.backend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LikeRepository extends JpaRepository<Like, Long> {
    
}
