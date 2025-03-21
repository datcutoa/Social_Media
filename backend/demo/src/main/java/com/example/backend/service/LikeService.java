package com.example.backend.service;

import com.example.backend.repository.LikeRepository;
import com.example.backend.model.Like;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {
    @Autowired
    private LikeRepository likeRepository;
    

    public List<Like> getAllLikes() {
        return likeRepository.findAll();
    }

    public Optional<Like> getLikeById(Long likeId) {
        return likeRepository.findById(likeId);
    }

    public void deleteLike(Long likeId) {
        likeRepository.deleteById(likeId);
    }

    public void createLike(Like like) {
        likeRepository.save(like);
    }

    public void updateLike(Long likeId, Like newLike) {
        if (likeRepository.existsById(likeId)) {
            newLike.setId(likeId); // Đảm bảo ID giữ nguyên
            likeRepository.save(newLike);
        }
    }
}
