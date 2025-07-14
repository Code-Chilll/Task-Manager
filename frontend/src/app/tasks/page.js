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
      window.location.href = '/login';
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex flex-col items-center">
      <div className="max-w-4xl w-full backdrop-blur-lg bg-white/10 border border-blue-400/30 rounded-2xl shadow-xl p-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-300 drop-shadow mb-1">My Tasks</h1>
            <p className="text-slate-300">Manage and track your tasks</p>
            <p className="text-xs text-blue-200 mt-2">Logged in as: <span className="font-semibold">{userEmail}</span></p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Link href="/tasks/add">Add New Task</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-blue-400 text-blue-300 hover:bg-blue-900/30">
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-900/30 p-3 rounded mb-4 border border-red-400/30">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {Array.isArray(tasks) && tasks.map((task) => (
            <Card key={task.id} className="bg-white/10 border border-blue-400/20 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-blue-200 drop-shadow mb-1">{task.name}</CardTitle>
                    <CardDescription className="mt-1 text-slate-300">{task.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm" asChild className="border-blue-400 text-blue-300 hover:bg-blue-900/30">
                      <Link href={`/tasks/edit/${task.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)} className="bg-red-700/80 text-white hover:bg-red-900/80">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-300">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                    task.completed ? 'bg-green-900/40 text-green-300 border border-green-400/30' : 'bg-yellow-900/40 text-yellow-300 border border-yellow-400/30'
                  }`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="flex gap-6 mt-4">
                  <span className="text-xs text-blue-200">Priority: <span className="font-bold text-blue-300">{task.priority ?? 'N/A'}</span></span>
                  <span className="text-xs text-blue-200">Last Date: <span className="font-bold text-blue-300">{task.lastDate ?? 'N/A'}</span></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!Array.isArray(tasks) || tasks.length === 0) && !loading && (
          <Card className="text-center py-12 bg-white/10 border border-blue-400/20 rounded-xl shadow-lg">
            <CardContent>
              <h3 className="text-lg font-bold text-blue-200 mb-2">No tasks found</h3>
              <p className="text-slate-300 mb-4">Get started by creating your first task.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <Link href="/tasks/add">Add Your First Task</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
