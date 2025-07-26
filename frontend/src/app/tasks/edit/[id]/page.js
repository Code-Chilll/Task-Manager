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
import { getUserEmail, isAuthenticated, isAdmin } from "@/lib/auth";

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
  const [fieldErrors, setFieldErrors] = useState({});

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
      setTask(prev => ({
        name: data.name ?? '',
        description: data.description ?? '',
        completed: typeof data.completed === 'boolean' ? data.completed : false,
        priority: data.priority ?? 'medium',
        lastDate: data.lastDate ?? ''
      }));
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

  const validate = () => {
    const errors = {};
    if (!task.name) {
      errors.name = 'Task name is required';
    } else if (task.name.length < 2) {
      errors.name = 'Task name must be at least 2 characters';
    }
    if (!task.priority) {
      errors.priority = 'Priority is required';
    }
    if (task.lastDate && isNaN(Date.parse(task.lastDate))) {
      errors.lastDate = 'Invalid date';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitting(false);
      return;
    }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-extrabold text-blue-300 mb-2 drop-shadow">Loading Task</CardTitle>
            <CardDescription className="text-slate-300">Fetching your task details...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-300 drop-shadow">Edit Task</CardTitle>
            <CardDescription className="text-slate-300">Update your task information below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 mb-6">
              <span className="text-xs text-blue-200">Priority: <span className="font-bold text-blue-300">{task.priority}</span></span>
              <span className="text-xs text-blue-200">Last Date: <span className="font-bold text-blue-300">{task.lastDate}</span></span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded border border-red-500/30">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-200">Task Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter task name"
                  value={task.name}
                  onChange={handleChange}
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
                {fieldErrors.name && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-blue-200">Task Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Enter task description"
                  value={task.description}
                  onChange={handleChange}
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-blue-200">Priority</Label>
                <Select value={task.priority} onValueChange={value => setTask(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-blue-400/30 text-slate-100">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.priority && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.priority}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastDate" className="text-blue-200">Last Date</Label>
                <Input
                  id="lastDate"
                  name="lastDate"
                  type="date"
                  value={task.lastDate}
                  onChange={e => setTask(prev => ({ ...prev, lastDate: e.target.value }))}
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
                {fieldErrors.lastDate && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.lastDate}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="completed" className="text-blue-200">Status</Label>
                <Select value={typeof task.completed !== 'undefined' ? task.completed.toString() : ''} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-blue-400/30 text-slate-100">
                    <SelectItem value="false">Pending</SelectItem>
                    <SelectItem value="true">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-700 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-800 hover:to-blue-500 transition"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Task'}
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 border-blue-400/40 text-blue-200 hover:bg-blue-900/20 hover:text-white transition"
                >
                  <Link href="/tasks">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
