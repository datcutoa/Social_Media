package com.example.backend.service;

import com.example.backend.repository.LikeRepository;
import com.example.backend.model.Like;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
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

    public long getLikeCountByPostId(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    public boolean likePost(Long userId, Long postId) {
        // Kiểm tra xem user đã like bài viết chưa
        Optional<Like> existingLike = likeRepository.findByUser_IdAndPost_Id(userId, postId);
        if (existingLike.isPresent()) {
            return false; // User đã like rồi
        }

        // Tạo lượt like mới
        User user = new User();
        user.setId(userId);
        Post post = new Post();
        post.setId(postId);
        Like like = new Like(user, post); // Sử dụng constructor của Like
        likeRepository.save(like);
        return true; // Like thành công
    }

    public boolean hasUserLikedPost(Long userId, Long postId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }

    public Optional<Like> getLikeByUserAndPost(Long userId, Long postId) {
        return likeRepository.findByUserIdAndPostId(userId, postId);
    }

    public List<User> getUsersWhoLikedPost(Long postId) {
        List<Like> likes = likeRepository.findByPostId(postId);
        return likes.stream()
                .map(like -> new User(
                        like.getUser().getId(),
                        like.getUser().getUsername(),
                        like.getUser().getName(),
                        like.getUser().getProfilePicture()))
                .collect(Collectors.toList());
    }
}