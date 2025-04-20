package com.example.backend.repository;
import com.example.backend.model.FriendShip;
import com.example.backend.model.FriendShip.FriendshipId;
import com.example.backend.model.User;
import com.example.backend.model.FriendShip.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
public interface FriendShipRepository extends JpaRepository<FriendShip, Long> {
    
        // ✅ Lấy danh sách bạn bè của user
        @Query("SELECT f.friend FROM FriendShip f WHERE f.user.id = :userId AND f.status = 'DA_KET_BAN'")
        List<User> findFriendsByUserId(Long userId);
    
        // ✅ Lấy danh sách lời mời kết bạn đang chờ xác nhận
        @Query("SELECT f FROM FriendShip f WHERE f.friend.id = :userId AND f.status = 'DANG_CHO'")
        List<FriendShip> findPendingRequests(Long userId);
    
        // ✅ Kiểm tra xem hai user có đang là bạn bè không
        @Query("SELECT f FROM FriendShip f WHERE (f.user.id = :userId AND f.friend.id = :friendId) OR (f.user.id = :friendId AND f.friend.id = :userId)")
        Optional<FriendShip> findFriendship(Long userId, Long friendId);
    
        // ✅ Cập nhật trạng thái kết bạn
        @Modifying
        @Transactional
        @Query("UPDATE FriendShip f SET f.status = :status WHERE f.id = :id")
        void updateFriendshipStatus(FriendshipId id, Status status);

    
}
