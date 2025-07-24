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

    private User validateUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new SecurityException("User not found");
        }
        return user;
    }

    private Task validateTask(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> 
            new NoSuchElementException("Task not found"));
    }

    private void validateTaskAccess(User currentUser, Task task, String userEmail) {
        if (currentUser.getRole() != User.Role.ADMIN && 
            !task.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("Unauthorized to access this task.");
        }
    }

    public List<Task> getAllTasks(String userEmail) {
        User user = validateUser(userEmail);
        
        // If user is admin, return all tasks with user details
        if (user.getRole() == User.Role.ADMIN) {
            return taskRepository.findAllWithUser();
        }
        
        // If regular user, return only their tasks
        return taskRepository.findByUserEmail(userEmail);
    }

    public Task addTask(Task task, String userEmail) {
        User existingUser = validateUser(userEmail);
        task.setUser(existingUser);
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task, String userEmail) {
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
        User currentUser = validateUser(userEmail);
        Task task = validateTask(id);
        validateTaskAccess(currentUser, task, userEmail);
        
        return task;
    }
}
