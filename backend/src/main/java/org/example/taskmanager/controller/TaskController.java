package org.example.taskmanager.controller;

import org.example.taskmanager.model.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.example.taskmanager.model.Task;
import org.example.taskmanager.repository.TaskRepository;
import org.example.taskmanager.repository.UserRepository;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Task> getAllTasks(@RequestParam String userEmail) {
        return taskRepository.findByUserEmail(userEmail);
    }

    @PostMapping
    public Task addTask(@RequestBody Task task, @RequestParam String userEmail) {
        // Find the user and set it on the task
        User existingUser = userRepository.findByEmail(userEmail);
        if (existingUser != null) {
            task.setUser(existingUser);
        } else {
            throw new RuntimeException("User does not exist.");
        }
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task, @RequestParam String userEmail) {
        Task existingTask = taskRepository.findById(id).orElseThrow();
        
        // Verify the task belongs to the user
        if (!existingTask.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to update this task.");
        }
        
        existingTask.setName(task.getName());
        existingTask.setDescription(task.getDescription());
        existingTask.setCompleted(task.isCompleted());

        return taskRepository.save(existingTask);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id, @RequestParam String userEmail) {
        Task existingTask = taskRepository.findById(id).orElseThrow();
        
        // Verify the task belongs to the user
        if (!existingTask.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to delete this task.");
        }
        
        taskRepository.deleteById(id);
    }

}
