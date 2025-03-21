package com.example.backend.service;

import com.example.backend.repository.FollowRepository;
import com.example.backend.model.Follow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FollowService {
    
    @Autowired
    private FollowRepository followRepository;
    

    public List<Follow> getAllFollows() {
        return followRepository.findAll();
    }

    public Optional<Follow> getFollowById(Long followId) {
        return followRepository.findById(followId);
    }

    public void deleteFollow(Long followId) {
        followRepository.deleteById(followId);
    }

    public void createFollow(Follow follow) {
        followRepository.save(follow);
    }

    public void updateFollow(Long followId, Follow newFollow) {
        if (followRepository.existsById(followId)) {
            newFollow.setId(followId); // Đảm bảo ID giữ nguyên
            followRepository.save(newFollow);
        }
    }
}
