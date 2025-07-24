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
        Task createdTask = taskService.addTask(task, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task, @RequestParam String userEmail) {
        Task updatedTask = taskService.updateTask(id, task, userEmail);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @RequestParam String userEmail) {
        taskService.deleteTask(id, userEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, @RequestParam String userEmail) {
        Task task = taskService.getTaskById(id, userEmail);
        if (task != null) {
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
