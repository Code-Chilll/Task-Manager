export default function EditTask({ params }) {
  // In a real app, you would fetch the task data based on params.id
  const taskId = params?.id || '1';
  
  // Sample task data for editing
  const sampleTask = {
    task_id: taskId,
    task_name: "Complete project proposal",
    task_description: "Write and submit the Q2 project proposal",
    status: "In Progress"
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div>
          <h1>Edit Task</h1>
          <p>Update your task information.</p>
        </div>

        <div>
          <form>
            <div>
              <label htmlFor="task_name" className="block">
                Task Name *
              </label>
              <input
                type="text"
                id="task_name"
                name="task_name"
                required
                defaultValue={sampleTask.task_name}
                className="w-full"
                placeholder="Enter task name"
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
                defaultValue={sampleTask.task_description}
                className="w-full"
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label htmlFor="status" className="block">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={sampleTask.status}
                className="w-full"
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
          <button>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
