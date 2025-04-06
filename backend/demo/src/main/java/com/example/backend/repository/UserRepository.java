package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.Collections;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
public interface UserRepository extends JpaRepository<User, Long> {
    // @Modifying
    // @Transactional
    // @Query("UPDATE User u SET u.username = :#{#newUser.username}, u.email = :#{#newUser.email}, " +
    //        "u.name = :#{#newUser.name}, u.bio = :#{#newUser.bio}, " +
    //        "u.profilePicture = :#{#newUser.profilePicture}, u.coverPhoto = :#{#newUser.coverPhoto}, " +
    //        "u.gender = :#{#newUser.gender}, u.birthdate = :#{#newUser.birthdate} WHERE u.id = :userId")
    // void updateUsers(@Param("userId") Long userId, @Param("newUser") User newUser);

    // @Modifying
    // @Transactional
    // @Query(value = "UPDATE User SET ?1 = ?2 WHERE id = ?3", nativeQuery = true)
    // void updateUserColumn(String column, String value, Long userId);

    List<User> findByUsernameContainingIgnoreCase(String username);
    Optional<User> findByUsernameAndPassword(String username, String password);
}
