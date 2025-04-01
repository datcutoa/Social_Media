package com.example.backend.repository;
import com.example.backend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;
public interface LikeRepository extends JpaRepository<Like, Long> {
    long countByPostId(Long postId);
    Optional<Like> findByUser_IdAndPost_Id(Long userId, Long postId);
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    
    Optional<Like> findByUserIdAndPostId(Long userId, Long postId);
    @Query("SELECT l FROM Like l WHERE l.post.id = :postId")
    List<Like> findByPostId(@Param("postId") Long postId);
}