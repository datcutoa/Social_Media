package com.example.backend.service;

import com.example.backend.model.GroupEntity;
import com.example.backend.repository.GroupEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GroupEntityService {
    
    @Autowired
    private GroupEntityRepository groupEntityRepository;

    public List<GroupEntity> getAllGroupEntities() {
        return groupEntityRepository.findAll();
    }

    public Optional<GroupEntity> getGroupEntityById(Long groupEntityId) {
        return groupEntityRepository.findById(groupEntityId);
    }

    public void deleteGroupEntity(Long groupEntityId) {
        groupEntityRepository.deleteById(groupEntityId);
    }

    public void createGroupEntity(GroupEntity groupEntity) {
        groupEntityRepository.save(groupEntity);
    }

    public void updateGroupEntity(Long groupEntityId, GroupEntity newGroupEntity) {
        if (groupEntityRepository.existsById(groupEntityId)) {
            newGroupEntity.setId(groupEntityId); // Đảm bảo ID giữ nguyên
            groupEntityRepository.save(newGroupEntity);
        }
    }

    // public void updateGroupColumn(String column, String value, Long groupEntityId) {
    //     if (groupEntityRepository.existsById(groupEntityId)) {
    //         groupEntityRepository.updateGroupColumn(column, value, groupEntityId);
    //     }
    // }
}
