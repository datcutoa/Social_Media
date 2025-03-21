package com.example.backend.repository;


import com.example.backend.model.GroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
public interface GroupEntityRepository extends JpaRepository<GroupEntity, Long> {
    

    // @Modifying
    // @Transactional
    // @Query(value = "UPDATE User SET ?1 = ?2 WHERE id = ?3", nativeQuery = true)
    // void updateGroupColumn(String column, String value, Long userId);
}
