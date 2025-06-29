'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserEmail, logout, isAuthenticated } from "@/lib/auth";

export default function Tasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userEmail = getUserEmail();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/tasks?userEmail=${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Tasks response:', data); // Debug log
      
      // Ensure data is an array
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load tasks');
      console.error('Fetch tasks error:', error);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:8080/tasks/${id}?userEmail=${encodeURIComponent(userEmail)}`, { method: 'DELETE' });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      setError('Failed to delete task');
      console.error('Delete task error:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
            <p className="text-slate-600 mt-1">Manage and track your tasks</p>
            <p className="text-sm text-slate-500">Logged in as: {userEmail}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/tasks/add">Add New Task</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {Array.isArray(tasks) && tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{task.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {task.description}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tasks/edit/${task.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-slate-700 mr-2">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!Array.isArray(tasks) || tasks.length === 0) && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks found</h3>
              <p className="text-slate-600 mb-4">Get started by creating your first task.</p>
              <Button asChild>
                <Link href="/tasks/add">Add Your First Task</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
