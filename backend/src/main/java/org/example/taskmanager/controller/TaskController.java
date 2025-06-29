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
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        if (task.getUser() != null) {
            User existingUser = userRepository.findByEmail(task.getUser().getEmail());
            if (existingUser != null) {
                task.setUser(existingUser);
            } else {
                throw new RuntimeException("User does not exist.");
            }
        }
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task exsistingTask = taskRepository.findById(id).orElseThrow();
        exsistingTask.setName(task.getName());
        exsistingTask.setDescription(task.getDescription());
        exsistingTask.setCompleted(task.isCompleted());
        exsistingTask.setUser(task.getUser());

        return taskRepository.save(exsistingTask);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }

}
