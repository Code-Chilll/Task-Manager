'use client';
import {useEffect, useState} from 'react';
import {useRouter, useParams} from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditTask() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;
  const [task, setTask] = useState({
    task_name: '',
    task_description: '',
    status: 'Pending'
  });

  useEffect(() => {
    const sampleTask = {
      task_id: taskId,
      task_name: "Complete project proposal",
      task_description: "Write and submit the Q2 project proposal",
      status: "In Progress"
    };
    setTask(sampleTask);
  }, [taskId]);

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
      status: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/tasks');
  };

  const handleDelete = () => {
    router.push('/tasks');
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="task_name">Task Name *</Label>
                <Input
                  id="task_name"
                  name="task_name"
                  type="text"
                  required
                  placeholder="Enter task name"
                  value={task.task_name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task_description">Task Description</Label>
                <Textarea
                  id="task_description"
                  name="task_description"
                  rows={4}
                  placeholder="Enter task description"
                  value={task.task_description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Update Task
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
