package com.example.backend.repository;
import com.example.backend.model.Follow;
import com.example.backend.model.Follow.FollowId;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface FollowRepository extends JpaRepository<Follow, Follow.FollowId> {
        // Lấy danh sách user mà một user đang theo dõi (following)
        @Query("SELECT f.following FROM Follow f WHERE f.follower.id = :userId")
        List<User> findFollowingByUserId(Long userId);
        
        // Lấy danh sách user theo dõi một user (followers)
        @Query("SELECT f.follower FROM Follow f WHERE f.following.id = :userId")
        List<User> findFollowersByUserId(Long userId);
}