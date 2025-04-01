package com.example.backend.service;

import com.example.backend.model.FriendShip;
import com.example.backend.model.User;
import com.example.backend.repository.FriendShipRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class FriendShipService {
    private final FriendShipRepository friendShipRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public FriendShipService(FriendShipRepository friendShipRepository, UserService userService,UserRepository userRepository) {
        this.friendShipRepository = friendShipRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public List<FriendShip> getAllFriendShips() {
        return friendShipRepository.findAll();
    }

    public List<User> getFriends(Long userId) {
        return friendShipRepository.findFriendsByUserId(userId);
    }

    public void addFriend(Long userId, Long friendId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        User friend = userService.getUserById(friendId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + friendId));
        FriendShip friendShip = new FriendShip(user, friend, FriendShip.Status.DA_KET_BAN);
        friendShipRepository.save(friendShip);
    }

    public void removeFriend(Long userId, Long friendId) {
        friendShipRepository.deleteFriendShipByUserIdAndFriendId(userId, friendId);
    }

    // Thêm phương thức gửi lời mời kết bạn
    // public FriendShip sendFriendRequest(Long userId, Long friendId) {
    //     User user = userService.getUserById(userId)
    //             .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
    //     User friend = userService.getUserById(friendId)
    //             .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + friendId));
    //     Optional<FriendShip> existingFriendship = friendShipRepository.findByIdUserIdAndIdFriendId(userId, friendId);
    //     if (existingFriendship.isPresent()) {
    //         throw new RuntimeException("Đã tồn tại một mối quan hệ bạn bè giữa hai người dùng này.");
    //     }
    //     FriendShip friendShip = new FriendShip(user, friend, FriendShip.Status.DANG_CHO);
    //     return friendShipRepository.save(friendShip);
    // }

    public FriendShip sendFriendRequest(Long userId, Long friendId) {
        // First, check if the user and friend exist
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));
        
        // Check if there's an existing friendship (user -> friend or friend -> user)
        Optional<FriendShip> existingFriendship = friendShipRepository.findByUserIdAndFriendId(userId, friendId);
        if (!existingFriendship.isPresent()) {
            existingFriendship = friendShipRepository.findByUserIdAndFriendId(friendId, userId);
        }
    
        // If an existing friendship is found, check the status
        if (existingFriendship.isPresent()) {
            FriendShip fs = existingFriendship.get();
            switch (fs.getStatus()) {
                case DA_KET_BAN:
                    throw new RuntimeException("Đã là bạn bè, không thể gửi yêu cầu!");
                case DANG_CHO:
                    throw new RuntimeException("Yêu cầu kết bạn đang chờ chấp nhận!");
                case DA_TU_CHOI:
                    // If friendship was rejected, reset status to 'waiting' for a new request
                    fs.setStatus(FriendShip.Status.DANG_CHO);
                    return friendShipRepository.save(fs); // save the updated friendship
                default:
                    throw new RuntimeException("Không thể gửi yêu cầu kết bạn!");
            }
        }
        
        FriendShip newFriendship = new FriendShip(user, friend, FriendShip.Status.DANG_CHO);
        return friendShipRepository.save(newFriendship);
    }
    
    
    // public FriendShip.Status checkFriendStatus(Long userId, Long friendId) {
    //     return friendShipRepository.findByUserIdAndFriendId(userId, friendId)
    //         .map(FriendShip::getStatus)
    //         .orElse(null);
    // }

    public FriendShip.Status checkFriendStatus(Long userId, Long friendId) {
        // Kiểm tra mối quan hệ kết bạn ở cả hai chiều
        Optional<FriendShip> friendship = friendShipRepository.findByUserIdAndFriendId(userId, friendId);
        if (friendship.isPresent()) {
            return friendship.get().getStatus(); // Trả về trạng thái nếu tìm thấy
        }
    
        // Kiểm tra ngược lại
        friendship = friendShipRepository.findByUserIdAndFriendId(friendId, userId);
        return friendship.map(FriendShip::getStatus).orElse(null); // Nếu có mối quan hệ ngược lại, trả về trạng thái
    }
    
    

    public List<User> getPendingFriendRequests(Long userId) {
        return friendShipRepository.findPendingFriendsByUserId(userId);
    }

    public List<User> getReceivedFriendRequests(Long userId) {
        return friendShipRepository.findReceivedFriendRequestsByUserId(userId);
    }

    public boolean acceptFriendRequest(Long userId, Long friendId) {
        Optional<FriendShip> friendship = friendShipRepository.findByUserIdAndFriendId(friendId, userId);

        if (friendship.isPresent()) {
            FriendShip fs = friendship.get();
            fs.setStatus(FriendShip.Status.DA_KET_BAN);
            friendShipRepository.save(fs);
            return true;
        }
        return false;
    }

    public List<User> getFriendsByUser(Long userId) {
        return friendShipRepository.findFriendsByUser(userId);
    }

    public boolean unfriend(Long userId, Long friendId) {
        Optional<FriendShip> friendship = friendShipRepository.findByUserIdAndFriendId(userId, friendId);
        if (!friendship.isPresent()) {
            friendship = friendShipRepository.findByUserIdAndFriendId(friendId, userId);
        }
        if (friendship.isPresent()){
            if (friendship.get().getStatus() == FriendShip.Status.DA_KET_BAN || friendship.get().getStatus() == FriendShip.Status.DANG_CHO) {
                FriendShip fs = friendship.get();
                fs.setStatus(FriendShip.Status.DA_TU_CHOI);
                friendShipRepository.save(fs); 
                return true;
            }
        }
        return false;
    }
}