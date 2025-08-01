package org.example.taskmanager.repository;

import org.example.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{
    User findByEmail(String email);

    boolean existsByEmail(String email);
}
