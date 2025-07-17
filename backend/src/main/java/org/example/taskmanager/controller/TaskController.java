package org.example.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.example.taskmanager.model.Task;
import org.example.taskmanager.service.TaskService;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@RequestParam String userEmail) {
        List<Task> tasks = taskService.getAllTasks(userEmail);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<?> addTask(@RequestBody Task task, @RequestParam String userEmail) {
        try {
            Task createdTask = taskService.addTask(task, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task, @RequestParam String userEmail) {
        try {
            Task updatedTask = taskService.updateTask(id, task, userEmail);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @RequestParam String userEmail) {
        try {
            taskService.deleteTask(id, userEmail);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

}
