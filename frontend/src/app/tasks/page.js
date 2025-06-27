'use client';
import {useEffect, useState} from 'react';

export default function Tasks() {
  // Sample task data for display
  const[tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/tasks')
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const deleteTask = async(id) => {
    await fetch(`http://localhost:8080/tasks/${id}`, {
      method:'DELETE'
    });
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1>My Tasks</h1>
          <a href="/tasks/add">
            Add New Task
          </a>
        </div>

        <div>
          {tasks.map((task) => (
            <div key={task.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2>{task.task_name}</h2>
                  <p>{task.task_description}</p>
                </div>
                <div className="flex">
                  <a href={`/tasks/edit/${task.id}`}>
                    Edit
                  </a>
                  <button onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <span>Status:</span>
                <span>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center">
            <h3>No tasks found</h3>
            <p>Get started by creating your first task.</p>
            <a href="/tasks/add">
              Add Your First Task
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
