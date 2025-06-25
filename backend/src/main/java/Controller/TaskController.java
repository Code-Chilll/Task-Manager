package Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import Model.Task;
import Repository.TaskRepository;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PutMapping("{/id}")
    public Task updateTask(Long id, @RequestBody Task task) {
        Task exsistingTask = taskRepository.findById(id).orElseThrow();
        exsistingTask.setName(task.getName());
        exsistingTask.setCompleted(task.isCompleted());
        return taskRepository.save(exsistingTask);
    }

    @DeleteMapping("{/id}")
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

}
