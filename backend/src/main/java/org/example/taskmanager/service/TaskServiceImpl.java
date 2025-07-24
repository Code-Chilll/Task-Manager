package org.example.taskmanager.service;

import org.example.taskmanager.model.Task;
import org.example.taskmanager.model.User;
import org.example.taskmanager.repository.TaskRepository;
import org.example.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Task> getTasksByUser(String userEmail, Boolean completed) {
        if (completed != null) {
            return taskRepository.findByUserEmailAndCompleted(userEmail, completed);
        }
        return taskRepository.findByUserEmail(userEmail);
    }

    @Override
    public Task createTask(Task task, String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User does not exist.");
        }
        task.setUser(user);
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, Task task, String userEmail) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!existingTask.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to update this task.");
        }

        existingTask.setName(task.getName());
        existingTask.setDescription(task.getDescription());
        existingTask.setCompleted(task.isCompleted());
        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(Long id, String userEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to delete this task.");
        }

        taskRepository.deleteById(id);
    }
}
