package org.example.taskmanager.repository;

import org.example.taskmanager.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserEmail(String userEmail);
    
    @Query("SELECT t FROM Task t JOIN FETCH t.user")
    List<Task> findAllWithUser();
    
    @Query("SELECT t FROM Task t JOIN FETCH t.user WHERE t.user.email = :userEmail")
    List<Task> findByUserEmailWithUser(String userEmail);
    
    // Pagination and search methods for admin users
    @Query("SELECT t FROM Task t WHERE " +
           "(:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.priority) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.user.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.user.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:completed IS NULL OR t.completed = :completed)")
    Page<Task> findAllWithFilters(@Param("search") String search, 
                                 @Param("priority") String priority, 
                                 @Param("completed") Boolean completed, 
                                 Pageable pageable);
    
    // Pagination and search methods for regular users
    @Query("SELECT t FROM Task t WHERE t.user.email = :userEmail AND " +
           "(:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.priority) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.user.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.user.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:completed IS NULL OR t.completed = :completed)")
    Page<Task> findUserTasksWithFilters(@Param("userEmail") String userEmail,
                                       @Param("search") String search, 
                                       @Param("priority") String priority, 
                                       @Param("completed") Boolean completed, 
                                       Pageable pageable);
}
