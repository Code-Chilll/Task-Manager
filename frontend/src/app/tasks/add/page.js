'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AddTask() {

  const router = useRouter();
  const [task, setTask] = useState({
    name: '',
    description: '',
    completed: false,
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    await fetch('http://localhost:8080/tasks', {
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify(task)
    });
    router.push('/tasks');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div>
          <h1>Add New Task</h1>
          <p>Create a new task to help organize your work.</p>
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
                name="task_name"
                required
                className="w-full"
                placeholder="Enter task name"
                value={task.task_name}
                onChange={(e) => setTask({...task, name: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="task_description" className="block">
                Task Description
              </label>
              <textarea
                id="task_description"
                name="task_description"
                rows={4}
                className="w-full"
                placeholder="Enter task description"
                value={task.task_description}
                onChange={(e) => setTask({...task, description: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="status" className="block">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full"
                onChange={(e) => setTask({...task, status: e.target.value=== 'Completed'})}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex">
              <button
                type="submit"
                className="flex-1"
              >
                Create Task
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
      </div>
    </div>
  );
}
