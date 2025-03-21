package com.example.backend.repository;
import com.example.backend.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    // @Modifying
    // @Transactional
    // @Query(value = "UPDATE GroupMember SET ?1 = ?2 WHERE id = ?3", nativeQuery = true)
    // void updateGroupMemberColumn(String column, String value, Long groupMemberId);
    
}
