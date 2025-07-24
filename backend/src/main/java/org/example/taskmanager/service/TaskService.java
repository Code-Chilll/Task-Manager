package org.example.taskmanager.service;

import org.example.taskmanager.model.Task;
import java.util.List;

public interface TaskService {
    List<Task> getTasksByUser(String userEmail, Boolean completed);
    Task createTask(Task task, String userEmail);
    Task updateTask(Long id, Task task, String userEmail);
    void deleteTask(Long id, String userEmail);
}
