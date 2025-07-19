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
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // If user is admin, return all tasks with user details
        if (user.getRole() == User.Role.ADMIN) {
            return taskRepository.findAllWithUser();
        }
        
        // If regular user, return only their tasks
        return taskRepository.findByUserEmail(userEmail);
    }

    public Task addTask(Task task, String userEmail) {
        User existingUser = userRepository.findByEmail(userEmail);
        if (existingUser != null) {
            task.setUser(existingUser);
        } else {
            throw new RuntimeException("User does not exist.");
        }
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task, String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found");
        }
        
        Task existingTask = taskRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Task not found"));
        
        // Admin can edit any task, regular users can only edit their own
        if (currentUser.getRole() != User.Role.ADMIN && 
            !existingTask.getUser().getEmail().equals(userEmail)) {
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
        User currentUser = userRepository.findByEmail(userEmail);
        if (currentUser == null) {
            throw new RuntimeException("User not found");
        }
        
        Task existingTask = taskRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Task not found"));
        
        // Admin can delete any task, regular users can only delete their own
        if (currentUser.getRole() != User.Role.ADMIN && 
            !existingTask.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to delete this task.");
        }
        
        taskRepository.delete(existingTask);
    }

    public Task getTaskById(Long id, String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail);
        if (currentUser == null) {
            return null;
        }
        
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            // Admin can view any task, regular users can only view their own
            if (currentUser.getRole() == User.Role.ADMIN || 
                userEmail.equals(task.getUser().getEmail())) {
                return task;
            }
        }
        return null;
    }
}
