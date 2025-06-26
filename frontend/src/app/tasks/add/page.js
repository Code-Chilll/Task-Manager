export default function AddTask() {
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div>
          <h1>Add New Task</h1>
          <p>Create a new task to help organize your work.</p>
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
