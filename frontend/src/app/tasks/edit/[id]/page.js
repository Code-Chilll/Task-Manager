'use client';
import {useEffect, useState} from 'react';
import {useRouter, useParams} from 'next/navigation';

export default function EditTask() {
  // In a real app, you would fetch the task data based on params.id
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;
  const [task, setTask] = useState({name:'', completed: false, description:''});

  useEffect(() => {
    fetch(`http://localhost:8080/tasks`)
        .then(res => res.json())
        .then(data => {
          const found = data.find(t => String(t.id) === String(taskId));
          if(found) setTask(found);
        });
    }, [taskId]);

  const handleChange = (e) => {
    const{name, value, type, checked} = e.target;
    setTask(prev =>({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    router.push('/tasks');
  };

  const handleDelete = async () => {
    await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: 'DELETE'
    });
    router.push('/tasks');
  };


  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div>
          <h1>Edit Task</h1>
          <p>Update your task information.</p>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="task_name" className="block">
                Task Name *
              </label>
              <input
                type="text"
                id="task_name"
                name="name"
                required
                className="w-full"
                placeholder="Enter task name"
                value={task.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="task_description" className="block">
                Task Description
              </label>
              <textarea
                id="task_description"
                name="description"
                rows={4}
                className="w-full"
                placeholder="Enter task description"
                value={task.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="completed" className="block">
                Completed
              </label>
              <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  checked={task.completed}
                  onChange={handleChange}
              />
            </div>


            <div className="flex">
              <button
                type="submit"
                className="flex-1"
              >
                Update Task
              </button>
              <a
                href="/tasks"
                className="flex-1 text-center"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>

        <div>
          <h3>Danger Zone</h3>
          <p>Deleting a task is permanent and cannot be undone.</p>
          <button onClick={handleDelete}>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
