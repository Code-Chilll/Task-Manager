package org.example.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.example.taskmanager.model.Task;
import org.example.taskmanager.service.TaskService;
import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );

    @GetMapping
    public ResponseEntity<?> getAllTasks(@RequestParam String userEmail) {
        // Validate userEmail parameter
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("User email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(userEmail.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        try {
            List<Task> tasks = taskService.getAllTasks(userEmail.trim().toLowerCase());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get tasks: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> addTask(@RequestBody Task task, @RequestParam String userEmail) {
        // Validate userEmail parameter
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("User email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(userEmail.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        // Validate task input
        if (task == null) {
            return ResponseEntity.badRequest().body("Task data is required");
        }
        
        if (task.getName() == null || task.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Task name is required");
        }
        
        if (task.getName().trim().length() > 200) {
            return ResponseEntity.badRequest().body("Task name cannot exceed 200 characters");
        }
        
        if (task.getDescription() != null && task.getDescription().length() > 1000) {
            return ResponseEntity.badRequest().body("Description cannot exceed 1000 characters");
        }
        
        if (task.getPriority() != null && !task.getPriority().trim().isEmpty()) {
            String priority = task.getPriority().trim().toLowerCase();
            if (!priority.equals("low") && !priority.equals("medium") && !priority.equals("high")) {
                return ResponseEntity.badRequest().body("Priority must be one of: low, medium, high");
            }
            task.setPriority(priority);
        }
        
        // Sanitize inputs
        task.setName(task.getName().trim());
        if (task.getDescription() != null) {
            task.setDescription(task.getDescription().trim());
        }
        
        try {
            Task createdTask = taskService.addTask(task, userEmail.trim().toLowerCase());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create task: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task, @RequestParam String userEmail) {

        // Validate userEmail parameter
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("User email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(userEmail.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        // Validate task ID
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body("Valid task ID is required");
        }
        
        // Validate task input
        if (task == null) {
            return ResponseEntity.badRequest().body("Task data is required");
        }
        
        if (task.getName() == null || task.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Task name is required");
        }
        
        if (task.getName().trim().length() > 200) {
            return ResponseEntity.badRequest().body("Task name cannot exceed 200 characters");
        }
        
        if (task.getDescription() != null && task.getDescription().length() > 1000) {
            return ResponseEntity.badRequest().body("Description cannot exceed 1000 characters");
        }
        
        if (task.getPriority() != null && !task.getPriority().trim().isEmpty()) {
            String priority = task.getPriority().trim().toLowerCase();
            if (!priority.equals("low") && !priority.equals("medium") && !priority.equals("high")) {
                return ResponseEntity.badRequest().body("Priority must be one of: low, medium, high");
            }
            task.setPriority(priority);
        }
        
        // Sanitize inputs
        task.setName(task.getName().trim());
        if (task.getDescription() != null) {
            task.setDescription(task.getDescription().trim());
        }
        
        try {
            Task updatedTask = taskService.updateTask(id, task, userEmail.trim().toLowerCase());
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update task: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @RequestParam String userEmail) {
        // Validate userEmail parameter
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("User email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(userEmail.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        // Validate task ID
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body("Valid task ID is required");
        }
        
        try {
            taskService.deleteTask(id, userEmail.trim().toLowerCase());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to delete task: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id, @RequestParam String userEmail) {
        // Validate userEmail parameter
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("User email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(userEmail.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        // Validate task ID
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body("Valid task ID is required");
        }
        
        try {
            Task task = taskService.getTaskById(id, userEmail.trim().toLowerCase());
            if (task != null) {
                return ResponseEntity.ok(task);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get task: " + e.getMessage());
        }
    }

}
