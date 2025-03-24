// package com.example.backend.service;

// import com.example.backend.model.GroupMember;
// import com.example.backend.repository.GroupMemberRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class GroupMemberService {
//     @Autowired
//     private GroupMemberRepository groupMemberRepository;

//     public List<GroupMember> getAllGroupMembers() {
//         return groupMemberRepository.findAll();
//     }

//     public Optional<GroupMember> getGroupMemberById(Long groupMemberId) {
//         return groupMemberRepository.findById(groupMemberId);
//     }

//     public void deleteGroupMember(Long groupMemberId) {
//         groupMemberRepository.deleteById(groupMemberId);
//     }

//     public void createGroupMember(GroupMember groupMember) {
//         groupMemberRepository.save(groupMember);
//     }

//     // public void updateGroupMember(Long groupMemberId, GroupMember newGroupMember) {
//     //     if (groupMemberRepository.existsById(groupMemberId)) {
//     //         newGroupMember.setId(groupMemberId); // Đảm bảo ID giữ nguyên
//     //         groupMemberRepository.save(newGroupMember);
//     //     }
//     // }

//     // public void updateGroupMemberColumn(String column, String value, Long groupMemberId) {
//     //     if (groupMemberRepository.existsById(groupMemberId)) {
//     //         groupMemberRepository.updateGroupMemberColumn(column, value, groupMemberId);
//     //     }
//     // }
// }
