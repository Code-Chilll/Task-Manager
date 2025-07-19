package org.example.taskmanager.repository;

import org.example.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserEmail(String userEmail);
    
    @Query("SELECT t FROM Task t JOIN FETCH t.user")
    List<Task> findAllWithUser();
}
