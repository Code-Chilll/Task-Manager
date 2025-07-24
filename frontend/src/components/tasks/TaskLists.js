"use client";

export default function TaskList({ tasks, onTaskUpdate }) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500 py-4">No tasks found.</p>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 border rounded-lg flex justify-between items-center ${
            task.completed ? 'bg-gray-50' : 'bg-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onTaskUpdate(task.id, 'toggleComplete')}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span
              className={`${
                task.completed ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {task.name}
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onTaskUpdate(task.id, 'edit')}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onTaskUpdate(task.id, 'delete')}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}