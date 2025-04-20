package com.example.backend.repository;

import com.example.backend.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByPostId(Long postId);
}
