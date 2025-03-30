package com.example.backend.service;

import com.example.backend.model.FriendShip;
import com.example.backend.model.User;
import com.example.backend.repository.FriendShipRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.model.FriendShip.Status;
import com.example.backend.model.FriendShip.FriendshipId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
// 
@Service
public class FriendShipService {
    @Autowired
    private FriendShipRepository friendShipRepository;

    @Autowired
    private UserRepository userRepository;

        // ✅ Gửi lời mời kết bạn
        public void sendFriendRequest(Long userId, Long friendId) {
            if (userId.equals(friendId)) {
                throw new IllegalArgumentException("Không thể kết bạn với chính mình!");
            }
    
            Optional<FriendShip> existingFriendship = friendShipRepository.findFriendship(userId, friendId);
            if (existingFriendship.isPresent()) {
                throw new IllegalArgumentException("Đã có mối quan hệ kết bạn trước đó!");
            }
    
            User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));
            User friend = userRepository.findById(friendId).orElseThrow(() -> new IllegalArgumentException("Friend không tồn tại"));
    
            FriendShip newRequest = new FriendShip(user, friend, Status.DANG_CHO);
            friendShipRepository.save(newRequest);
        }
    
        // ✅ Lấy danh sách bạn bè
        public List<User> getFriends(Long userId) {
            return friendShipRepository.findFriendsByUserId(userId);
        }
    
        // ✅ Lấy danh sách lời mời kết bạn đang chờ xác nhận
        public List<FriendShip> getPendingRequests(Long userId) {
            return friendShipRepository.findPendingRequests(userId);
        }
    
        // ✅ Chấp nhận lời mời kết bạn
        @Transactional
        public void acceptFriendRequest(Long userId, Long friendId) {
            FriendShip.FriendshipId id = new FriendshipId(friendId, userId);
            friendShipRepository.updateFriendshipStatus(id, Status.DA_KET_BAN);
        }
    
        // ✅ Từ chối lời mời kết bạn
        @Transactional
        public void rejectFriendRequest(Long userId, Long friendId) {
            FriendShip.FriendshipId id = new FriendshipId(friendId, userId);
            friendShipRepository.updateFriendshipStatus(id, Status.DA_TU_CHOI);
        }


}
