package com.example.backend.service;

import com.example.backend.repository.CommentRepository;
import com.example.backend.model.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(Long commentId) {
        return commentRepository.findById(commentId);
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    public void createComment(Comment comment) {
        commentRepository.save(comment);
    }

    public void updateComment(Long commentId, Comment newComment) {
        if (commentRepository.existsById(commentId)) {
            newComment.setId(commentId); // Đảm bảo ID giữ nguyên
            commentRepository.save(newComment);
        }
    }
}
