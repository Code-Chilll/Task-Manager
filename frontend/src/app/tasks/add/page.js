'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserEmail, isAuthenticated } from "@/lib/auth";

export default function AddTask() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [lastDate, setLastDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const router = useRouter();
  const userEmail = getUserEmail();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  const validate = () => {
    const errors = {};
    if (!name) {
      errors.name = 'Task name is required';
    } else if (name.length < 2) {
      errors.name = 'Task name must be at least 2 characters';
    }
    if (!priority) {
      errors.priority = 'Priority is required';
    }
    if (lastDate && isNaN(Date.parse(lastDate))) {
      errors.lastDate = 'Invalid date';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        name,
        description,
        completed,
        priority,
        lastDate
      };
      
      const response = await fetch(`http://localhost:8080/tasks?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        window.location.href = '/tasks';
      } else {
        setError('Failed to create task. Please try again.');
      }
    } catch (error) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-300 drop-shadow">Add Task</CardTitle>
            <CardDescription className="text-slate-300">Create a new task by filling out the form below.</CardDescription>
          </CardHeader>
          <CardContent>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter task name"
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="priority" className="text-blue-200">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
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
                  value={lastDate}
                  onChange={e => setLastDate(e.target.value)}
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
                {fieldErrors.lastDate && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.lastDate}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="completed" className="text-blue-200">Status</Label>
                <Select value={completed.toString()} onValueChange={(value) => setCompleted(value === 'true')}>
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
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Task'}
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
