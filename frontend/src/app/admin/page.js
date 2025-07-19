'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserEmail, isAdmin } from "@/lib/auth";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userEmail = getUserEmail();

  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/tasks';
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load users');
      console.error('Fetch users error:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (email, newRole) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${email}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Refresh users list
        fetchUsers();
      } else {
        setError('Failed to update user role');
      }
    } catch (error) {
      setError('Failed to update user role');
      console.error('Update role error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 flex flex-col items-center">
      <div className="max-w-6xl w-full backdrop-blur-lg bg-white/10 border border-purple-400/30 rounded-2xl shadow-xl p-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-purple-300 drop-shadow mb-1">Admin Panel</h1>
            <p className="text-slate-300">Manage users and their roles</p>
          </div>
          <Button asChild variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-900/30">
            <a href="/tasks">Back to Tasks</a>
          </Button>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-900/30 p-3 rounded mb-4 border border-red-400/30">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.email} className="bg-white/10 border border-purple-400/20 rounded-xl shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-purple-200">{user.name}</CardTitle>
                    <CardDescription className="text-slate-300">{user.email}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-400/30' 
                        : 'bg-blue-900/40 text-blue-300 border border-blue-400/30'
                    }`}>
                      {user.role}
                    </span>
                    {user.email !== userEmail && (
                      <Select 
                        value={user.role} 
                        onValueChange={(newRole) => updateUserRole(user.email, newRole)}
                      >
                        <SelectTrigger className="w-24 bg-white/20 border-purple-400/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {users.length === 0 && !loading && (
          <Card className="text-center py-12 bg-white/10 border border-purple-400/20 rounded-xl shadow-lg">
            <CardContent>
              <h3 className="text-lg font-bold text-purple-200 mb-2">No users found</h3>
              <p className="text-slate-300">No users are registered in the system.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
