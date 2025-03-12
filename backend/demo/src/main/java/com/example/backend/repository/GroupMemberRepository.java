package com.example.backend.repository;
import com.example.backend.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    
}
