'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserEmail, isAuthenticated } from "@/lib/auth";

export default function EditTask() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;
  const [task, setTask] = useState({
    name: '',
    description: '',
    completed: false,
    priority: 'medium',
    lastDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchTask();
  }, [taskId, router]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${taskId}?userEmail=${encodeURIComponent(getUserEmail())}`);
      const data = await response.json();
      setTask(data);
    } catch (error) {
      setError('Failed to load task');
      console.error('Fetch task error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setTask(prev => ({
      ...prev,
      completed: value === 'true'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const taskData = {
        name: task.name,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        lastDate: task.lastDate
      };
      await fetch(`http://localhost:8080/tasks/${taskId}?userEmail=${encodeURIComponent(getUserEmail())}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      window.location.href = '/tasks';
    } catch (error) {
      setError('Failed to update task. Please try again.');
      console.error('Update task error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await fetch(`http://localhost:8080/tasks/${taskId}`, { method: 'DELETE' });
        window.location.href = '/tasks';
      } catch (error) {
        setError('Failed to delete task. Please try again.');
        console.error('Delete task error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <div>Loading task...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Task</CardTitle>
            <CardDescription>
              Update your task information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 mb-6">
              <span className="text-xs text-blue-600">Priority: <span className="font-bold">{task.priority}</span></span>
              <span className="text-xs text-blue-600">Last Date: <span className="font-bold">{task.lastDate}</span></span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Task Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter task name"
                  value={task.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Task Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Enter task description"
                  value={task.description}
                  onChange={handleChange}
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={task.priority} onValueChange={value => setTask(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastDate">Last Date</Label>
                <Input
                  id="lastDate"
                  name="lastDate"
                  type="date"
                  value={task.lastDate}
                  onChange={e => setTask(prev => ({ ...prev, lastDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completed">Status</Label>
                <Select value={task.completed.toString()} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Pending</SelectItem>
                    <SelectItem value="true">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Task'}
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/tasks">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-lg text-red-800">Danger Zone</CardTitle>
            <CardDescription className="text-red-600">
              Deleting a task is permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
