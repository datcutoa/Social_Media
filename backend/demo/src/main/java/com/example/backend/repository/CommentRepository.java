package com.example.backend.repository;
import com.example.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
public interface  CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost_Id(Long postId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    long countByPost_Id(Long postId);
}
