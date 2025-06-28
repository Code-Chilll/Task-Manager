'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const sampleTasks = [
      { id: 1, task_name: "Complete project proposal", task_description: "Write and submit the Q2 project proposal", status: "In Progress" },
      { id: 2, task_name: "Review code changes", task_description: "Review pull requests from team members", status: "Pending" },
      { id: 3, task_name: "Update documentation", task_description: "Update API documentation with new endpoints", status: "Completed" },
    ];
    setTasks(sampleTasks);
  }, []);

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
            <p className="text-slate-600 mt-1">Manage and track your tasks</p>
          </div>
          <Button asChild>
            <Link href="/tasks/add">Add New Task</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{task.task_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {task.task_description}
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
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
