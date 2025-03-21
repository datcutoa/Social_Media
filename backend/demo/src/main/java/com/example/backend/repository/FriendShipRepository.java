package com.example.backend.repository;
import com.example.backend.model.FriendShip;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FriendShipRepository extends JpaRepository<FriendShip, Long> {
    
    // List<User> findFriendsByUserId(Long userId);
    // void deleteFriendShipByUserIdAndFriendId(Long userId, Long friendId);

    
}
