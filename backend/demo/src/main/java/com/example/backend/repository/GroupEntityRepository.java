package com.example.backend.repository;
import com.example.backend.model.GroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
public interface GroupEntityRepository extends JpaRepository<GroupEntity, Long> {
    
}
