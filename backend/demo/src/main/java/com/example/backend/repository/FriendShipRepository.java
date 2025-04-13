package com.example.backend.repository;
import com.example.backend.model.FriendShip;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface FriendShipRepository extends JpaRepository<FriendShip, Long> {
    // List<User> findFriendsByUserId(Long userId);
    // void deleteFriendShipByUserIdAndFriendId(Long userId, Long friendId);
    // Optional<FriendShip> findByIdUserIdAndIdFriendId(Long userId, Long friendId);

   @Query("SELECT f FROM FriendShip f WHERE " +
      "(f.user.id = :userId AND f.friend.id = :friendId) " +
      "OR (f.user.id = :friendId AND f.friend.id = :userId)")
   Optional<FriendShip> findByUserIdAndFriendId(@Param("userId") Long userId, @Param("friendId") Long friendId);


   @Query("SELECT f.friend FROM FriendShip f WHERE f.user.id = :userId AND f.status = 'DA_KET_BAN'")
   List<User> findFriendsByUserId(Long userId);

   void deleteFriendShipByUserIdAndFriendId(Long userId, Long friendId);
    // Optional<FriendShip> findByUserIdAndFriendId(Long userId, Long friendId);

   @Query("SELECT f.friend FROM FriendShip f WHERE f.user.id = :userId AND f.status = 'DANG_CHO'")
   List<User> findPendingFriendsByUserId(@Param("userId") Long userId);

   @Query("SELECT f.user FROM FriendShip f WHERE f.friend.id = :userId AND f.status = 'DANG_CHO'")
   List<User> findReceivedFriendRequestsByUserId(@Param("userId") Long userId);

    // @Query("SELECT f.friend FROM FriendShip f WHERE f.user.id = :userId AND f.status = 'DA_KET_BAN'")
    // List<User> findFriendsByUser(@Param("userId") Long userId);

   @Query("SELECT u FROM User u JOIN FriendShip f ON (f.user = u OR f.friend = u) " +
      "WHERE (:userId IN (f.user.id, f.friend.id) AND f.status = 'DA_KET_BAN') " +
      "AND u.id != :userId")
   List<User> findFriendsByUser(@Param("userId") Long userId);
}