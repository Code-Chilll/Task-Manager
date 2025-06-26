import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1>Welcome to Task Manager</h1>
        <p>
          Organize your tasks efficiently with our simple task management system.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto">
          <a
            href="/signup"
            className="text-center block"
          >
            Sign Up
          </a>
          
          <a
            href="/login"
            className="text-center block"
          >
            Sign In
          </a>
          
          <a
            href="/tasks"
            className="text-center block"
          >
            View Tasks
          </a>
          
          <a
            href="/tasks/add"
            className="text-center block"
          >
            Add New Task
          </a>
        </div>
      </div>
    </div>
  );
}
