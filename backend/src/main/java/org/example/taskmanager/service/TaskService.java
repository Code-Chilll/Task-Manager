package org.example.taskmanager.service;

import org.example.taskmanager.model.Task;
import org.example.taskmanager.model.User;
import org.example.taskmanager.repository.TaskRepository;
import org.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getAllTasks(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new RuntimeException("User email is required");
        }
        
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase());
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // If user is admin, return all tasks with user details
        if (user.getRole() == User.Role.ADMIN) {
            return taskRepository.findAllWithUser();
        }

        // If regular user, return only their tasks
        return taskRepository.findByUserEmail(userEmail.trim().toLowerCase());
    }

    public Task addTask(Task task, String userEmail) {
        if (task == null) {
            throw new RuntimeException("Task data is required");
        }
        
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new RuntimeException("User email is required");
        }
        
        if (task.getName() == null || task.getName().trim().isEmpty()) {
            throw new RuntimeException("Task name is required");
        }
        
        User existingUser = userRepository.findByEmail(userEmail.trim().toLowerCase());
        if (existingUser != null) {
            task.setUser(existingUser);
        } else {
            throw new RuntimeException("User does not exist.");
        }
        return taskRepository.save(task);
    }    public Task updateTask(Long id, Task task, String userEmail) {
        if (id == null || id <= 0) {
            throw new RuntimeException("Valid task ID is required");
        }
        
        if (task == null) {
            throw new RuntimeException("Task data is required");
        }
        
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new RuntimeException("User email is required");
        }
        
        if (task.getName() == null || task.getName().trim().isEmpty()) {
            throw new RuntimeException("Task name is required");
        }
        
        User currentUser = userRepository.findByEmail(userEmail.trim().toLowerCase());
        if (currentUser == null) {
            throw new RuntimeException("User not found");
        }

        Task existingTask = taskRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Task not found"));

        // Admin can edit any task, regular users can only edit their own
        if (currentUser.getRole() != User.Role.ADMIN && 
            !existingTask.getUser().getEmail().equals(userEmail.trim().toLowerCase())) {
            throw new RuntimeException("Unauthorized to update this task.");
        }

        existingTask.setName(task.getName());
        existingTask.setDescription(task.getDescription());
        existingTask.setCompleted(task.isCompleted());
        existingTask.setPriority(task.getPriority());
        existingTask.setLastDate(task.getLastDate());
        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id, String userEmail) {
        if (id == null || id <= 0) {
            throw new RuntimeException("Valid task ID is required");
        }
        
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new RuntimeException("User email is required");
        }
        
        User currentUser = userRepository.findByEmail(userEmail.trim().toLowerCase());
        if (currentUser == null) {
            throw new RuntimeException("User not found");
        }

        Task existingTask = taskRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Task not found"));

        // Admin can delete any task, regular users can only delete their own
        if (currentUser.getRole() != User.Role.ADMIN && 
            !existingTask.getUser().getEmail().equals(userEmail.trim().toLowerCase())) {
            throw new RuntimeException("Unauthorized to delete this task.");
        }

        taskRepository.delete(existingTask);
    }

    public Task getTaskById(Long id, String userEmail) {
        if (id == null || id <= 0) {
            return null;
        }
        
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return null;
        }
        
        User currentUser = userRepository.findByEmail(userEmail.trim().toLowerCase());
        if (currentUser == null) {
            return null;
        }

        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            // Admin can view any task, regular users can only view their own
            if (currentUser.getRole() == User.Role.ADMIN || 
                userEmail.trim().toLowerCase().equals(task.getUser().getEmail())) {
                return task;
            }
        }
        return null;
    }
}
