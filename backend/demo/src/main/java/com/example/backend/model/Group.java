package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Date;

@Entity
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String description;

    public enum Privacy {
        CONG_KHAI, BAN_BE, RIENG_TU
    }

    @Enumerated(EnumType.STRING)
    private Privacy privacy;

    private Date createdAt;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<GroupMember> groupMembers;

    public Group() {}

    public Group(Integer id, String name, String description, Privacy privacy, Date createdAt, List<GroupMember> groupMembers) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.privacy = privacy;
        this.createdAt = createdAt;
        this.groupMembers = groupMembers;
    }
}

