package org.example.taskmanager.service;

import org.example.taskmanager.model.Task;
import org.example.taskmanager.model.User;
import org.example.taskmanager.repository.TaskRepository;
import org.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper method to validate user (from soumya branch - cleaner approach)
    private User validateUser(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new RuntimeException("User email is required");
        }
        
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase());
        if (user == null) {
            throw new SecurityException("User not found");
        }
        return user;
    }

    // Helper method to validate task (from soumya branch)
    private Task validateTask(Long id) {
        if (id == null || id <= 0) {
            throw new RuntimeException("Valid task ID is required");
        }
        return taskRepository.findById(id).orElseThrow(() -> 
            new NoSuchElementException("Task not found"));
    }

    // Helper method to validate task access (from soumya branch)
    private void validateTaskAccess(User currentUser, Task task, String userEmail) {
        if (currentUser.getRole() != User.Role.ADMIN && 
            !task.getUser().getEmail().equals(userEmail.trim().toLowerCase())) {
            throw new SecurityException("Unauthorized to access this task.");
        }
    }

    public List<Task> getAllTasks(String userEmail) {
        User user = validateUser(userEmail);
        
        // If user is admin, return all tasks with user details
        if (user.getRole() == User.Role.ADMIN) {
            return taskRepository.findAllWithUser();
        }
        
        // If regular user, return only their tasks with user details (prefer soumya's approach if available)
        // Fall back to basic method if findByUserEmailWithUser doesn't exist
        try {
            return taskRepository.findByUserEmailWithUser(userEmail.trim().toLowerCase());
        } catch (Exception e) {
            // Fallback to basic method from main branch
            return taskRepository.findByUserEmail(userEmail.trim().toLowerCase());
        }
    }

    public Task addTask(Task task, String userEmail) {
        if (task == null) {
            throw new RuntimeException("Task data is required");
        }
        
        if (task.getName() == null || task.getName().trim().isEmpty()) {
            throw new RuntimeException("Task name is required");
        }
        
        User existingUser = validateUser(userEmail);
        task.setUser(existingUser);
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task, String userEmail) {
        if (task == null) {
            throw new RuntimeException("Task data is required");
        }
        
        if (task.getName() == null || task.getName().trim().isEmpty()) {
            throw new RuntimeException("Task name is required");
        }
        
        User currentUser = validateUser(userEmail);
        Task existingTask = validateTask(id);
        validateTaskAccess(currentUser, existingTask, userEmail);
        
        existingTask.setName(task.getName());
        existingTask.setDescription(task.getDescription());
        existingTask.setCompleted(task.isCompleted());
        existingTask.setPriority(task.getPriority());
        existingTask.setLastDate(task.getLastDate());
        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id, String userEmail) {
        User currentUser = validateUser(userEmail);
        Task existingTask = validateTask(id);
        validateTaskAccess(currentUser, existingTask, userEmail);
        
        taskRepository.delete(existingTask);
    }

    public Task getTaskById(Long id, String userEmail) {
        try {
            User currentUser = validateUser(userEmail);
            Task task = validateTask(id);
            validateTaskAccess(currentUser, task, userEmail);
            
            return task;
        } catch (Exception e) {
            // Return null for compatibility with main branch behavior
            // while still maintaining security through validation
            return null;
        }
    }
}