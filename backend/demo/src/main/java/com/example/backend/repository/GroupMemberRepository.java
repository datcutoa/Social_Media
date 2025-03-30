package com.example.backend.repository;
import com.example.backend.model.GroupMember;
import com.example.backend.model.GroupMember.GroupMemberId;
import com.example.backend.model.User;
import com.example.backend.model.GroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, GroupMember.GroupMemberId> {

    // Lấy danh sách user trong một group
    @Query("SELECT gm.user FROM GroupMember gm WHERE gm.group.id = :groupId")
    List<User> findMembersByGroupId(Long groupId);
    
    // Lấy danh sách group mà một user tham gia
    @Query("SELECT gm.group FROM GroupMember gm WHERE gm.user.id = :userId")
    List<GroupEntity> findGroupsByUserId(Long userId);
    
}
