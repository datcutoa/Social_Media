package com.example.backend.service;

import com.example.backend.model.Follow;
import com.example.backend.model.Follow.FollowId;
import com.example.backend.model.User;
import com.example.backend.repository.FollowRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Theo dõi user (follower follow following)
    @Transactional
    public void followUser(Long followerId, Long followingId) {
        if(followerId.equals(followingId)) {
            throw new IllegalArgumentException("Không thể theo dõi chính mình");
        }
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new IllegalArgumentException("Follower không tồn tại"));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new IllegalArgumentException("User được theo dõi không tồn tại"));
        Follow follow = new Follow(follower, following);
        followRepository.save(follow);
    }
    
    // Hủy theo dõi
    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        FollowId id = new FollowId(followerId, followingId);
        followRepository.deleteById(id);
    }
    
    // Lấy danh sách user mà một user đang theo dõi
    public List<User> getFollowing(Long userId) {
        return followRepository.findFollowingByUserId(userId);
    }
    
    // Lấy danh sách user theo dõi một user
    public List<User> getFollowers(Long userId) {
        return followRepository.findFollowersByUserId(userId);
    }
}
