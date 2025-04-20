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

    // public void updatePostColumn(String column, String value, Long postId) {
    //     if (postRepository.existsById(postId)) {
    //         postRepository.updatePostColumn(column, value, postId);
    //     }
    // }
}
