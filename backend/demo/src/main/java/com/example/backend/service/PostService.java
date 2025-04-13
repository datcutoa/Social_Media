package com.example.backend.service;

import com.example.backend.model.Post;
import com.example.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(Long postId) {
        return postRepository.findById(postId);
    }
    

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    public void createPost(Post post) {
        postRepository.save(post);
    }

    public void updatePost(Long postId, Post newPost) {
        if (postRepository.existsById(postId)) {
            newPost.setId(postId); // Đảm bảo ID giữ nguyên
            postRepository.save(newPost);
        }
    }

    public void savePost(Post post) {
        postRepository.save(post);
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public Optional<Post> getPostByIdAndUserId(Long postId, Long userId) {
        return postRepository.findByIdAndUserId(postId, userId);
    }

    public Optional<Post> findById(Long postId) {
        return postRepository.findById(postId);
    }

    public long getPostCount() {
        return postRepository.count(); // Sử dụng count() để đếm số lượng người dùng
    }

    public boolean updatePrivacy(Long postId, Post.Privacy privacy) {
        try {
            // 1. Tìm bài viết theo postId
            Optional<Post> postOptional = postRepository.findById(postId);
            if (!postOptional.isPresent()) {
                return false;
            }
            Post post = postOptional.get();
            if (privacy == null) {
                return false;
            }
            post.setPrivacy(privacy);
            postRepository.save(post);

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
