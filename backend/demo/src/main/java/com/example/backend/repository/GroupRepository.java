package com.example.backend.repository;
import com.example.backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
public interface GroupRepository extends JpaRepository<Group, Long> {
    
}
