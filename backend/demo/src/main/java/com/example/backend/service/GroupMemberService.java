package com.example.backend.service;

import com.example.backend.model.GroupMember;
import com.example.backend.model.GroupEntity;
import com.example.backend.model.User;
import com.example.backend.repository.GroupMemberRepository;
import com.example.backend.repository.GroupEntityRepository;  
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class GroupMemberService {

    @Autowired
    private GroupMemberRepository groupMemberRepository;
    
    @Autowired
    private GroupEntityRepository groupRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Thêm một user vào group với vai trò cụ thể
    @Transactional
    public void addMemberToGroup(Long groupId, Long userId, GroupMember.Role role) {
        GroupEntity group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group không tồn tại"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));
        GroupMember groupMember = new GroupMember(group, user, role);
        groupMemberRepository.save(groupMember);
    }
    
    // Lấy danh sách thành viên của group
    public List<User> getMembersByGroupId(Long groupId) {
        return groupMemberRepository.findMembersByGroupId(groupId);
    }
    
    // Lấy danh sách group mà một user tham gia
    public List<GroupEntity> getGroupsByUserId(Long userId) {
        return groupMemberRepository.findGroupsByUserId(userId);
    }
    
    // Xóa thành viên khỏi group
    @Transactional
    public void removeMemberFromGroup(Long groupId, Long userId) {
        GroupMember.GroupMemberId id = new GroupMember.GroupMemberId(groupId, userId);
        groupMemberRepository.deleteById(id);
    }
    
    // Cập nhật vai trò của thành viên trong group
    @Transactional
    public void updateMemberRole(Long groupId, Long userId, GroupMember.Role newRole) {
        GroupMember.GroupMemberId id = new GroupMember.GroupMemberId(groupId, userId);
        Optional<GroupMember> optionalMember = groupMemberRepository.findById(id);
        if(optionalMember.isPresent()){
            GroupMember member = optionalMember.get();
            member.setRole(newRole);
            groupMemberRepository.save(member);
        } else {
            throw new IllegalArgumentException("Thành viên không tồn tại trong group");
        }
    }
}
