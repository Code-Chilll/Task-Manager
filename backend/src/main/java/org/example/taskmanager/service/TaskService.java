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
        Task existingTask = taskRepository.findById(id).orElseThrow();
        if (!existingTask.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to update this task.");
        }
        existingTask.setName(task.getName());
        existingTask.setDescription(task.getDescription());
        existingTask.setCompleted(task.isCompleted());
        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id, String userEmail) {
        Task existingTask = taskRepository.findById(id).orElseThrow();
        if (!existingTask.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to delete this task.");
        }
        taskRepository.delete(existingTask);
    }

    public Task getTaskById(Long id, String userEmail) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null && task.getUser() != null && userEmail.equals(task.getUser().getEmail())) {
            return task;
        }
        return null;
    }
}
