package com.example.backend.repository;
import com.example.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    // @Modifying
    // @Transactional
    // @Query(value = "UPDATE Post SET ?1 = ?2 WHERE id = ?3", nativeQuery = true)
    // void updatePostColumn(String column, String value, Long postId);
    List<Post> findByUserId(Long userId);
    Optional<Post> findByIdAndUserId(Long postId, Long userId);
}