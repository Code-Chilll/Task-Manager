package org.example.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
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
    public List<Task> getAllTasks(@RequestParam String userEmail) {
        return taskService.getAllTasks(userEmail);
    }

    @PostMapping
    public Task addTask(@RequestBody Task task, @RequestParam String userEmail) {
        return taskService.addTask(task, userEmail);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task, @RequestParam String userEmail) {
        return taskService.updateTask(id, task, userEmail);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id, @RequestParam String userEmail) {
        taskService.deleteTask(id, userEmail);
    }

}
