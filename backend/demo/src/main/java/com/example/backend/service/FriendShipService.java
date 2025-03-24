// package com.example.backend.service;

// import com.example.backend.model.FriendShip;
// import com.example.backend.model.User;
// import com.example.backend.repository.FriendShipRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;
// // 
// @Service
// public class FriendShipService {
//     private final FriendShipRepository friendShipRepository;
//     private final UserService userService;

//     public FriendShipService(FriendShipRepository friendShipRepository, UserService userService) {
//         this.friendShipRepository = friendShipRepository;
//         this.userService = userService;
//     }

//     public List<FriendShip> getAllFriendShips() {
//         return friendShipRepository.findAll();
//     }

//     public List<User> getFriends(Long userId) {
//         return friendShipRepository.findFriendsByUserId(userId);
//     }

//     public void addFriend(Long userId, Long friendId) {
//         User user = userService.getUserById(userId);
//         User friend = userService.getUserById(friendId);
//         FriendShip friendShip = new FriendShip(user, friend);
//         friendShipRepository.save(friendShip);
//     }

//     public void removeFriend(Long userId, Long friendId) {
//         friendShipRepository.deleteFriendShipByUserIdAndFriendId(userId, friendId);
//     }
// }
