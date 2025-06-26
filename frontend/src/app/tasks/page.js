export default function Tasks() {
  // Sample task data for display
  const sampleTasks = [
    { task_id: 1, task_name: "Complete project proposal", task_description: "Write and submit the Q2 project proposal", status: "In Progress" },
    { task_id: 2, task_name: "Review code changes", task_description: "Review pull requests from team members", status: "Pending" },
    { task_id: 3, task_name: "Update documentation", task_description: "Update API documentation with new endpoints", status: "Completed" },
  ];

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
          {sampleTasks.map((task) => (
            <div key={task.task_id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2>{task.task_name}</h2>
                  <p>{task.task_description}</p>
                </div>
                <div className="flex">
                  <a href={`/tasks/edit/${task.task_id}`}>
                    Edit
                  </a>
                  <button>
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

        {sampleTasks.length === 0 && (
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
