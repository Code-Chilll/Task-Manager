'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserEmail, getUserRole, getUserName, logout, isAuthenticated, isAdmin } from "@/lib/auth";

export default function Tasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10); // Fixed page size
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState('');
  
  const userEmail = getUserEmail();
  const userRole = getUserRole();
  const userName = getUserName();
  const isUserAdmin = isAdmin();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    // Check if userEmail is available
    if (!userEmail) {
      setError('User not authenticated properly. Please log in again.');
      setLoading(false);
      return;
    }

    fetchTasks();
  }, [router, currentPage, sortBy, sortDir, searchDebounce, priorityFilter, statusFilter]);

  // Debounce search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchDebounce(searchTerm);
      setCurrentPage(0); // Reset to first page when search changes
    }, 800); // 800ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for paginated API
      const params = new URLSearchParams({
        userEmail: userEmail,
        page: currentPage.toString(),
        size: pageSize.toString(),
        sortBy: sortBy,
        sortDir: sortDir
      });
      
      if (searchDebounce.trim()) {
        params.append('search', searchDebounce.trim());
      }
      
      if (priorityFilter && priorityFilter !== 'all') {
        params.append('priority', priorityFilter);
      }
      
      if (statusFilter !== 'all') {
        params.append('completed', statusFilter === 'true');
      }
      
      let response;
      let data;
      
      try {
        // Try paginated API first
        response = await fetch(`http://localhost:8080/tasks/paginated?${params.toString()}`);
        
        if (response.ok) {
          data = await response.json();
          setTasks(data.tasks || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
          setHasNext(data.hasNext || false);
          setHasPrevious(data.hasPrevious || false);
        } else {
          throw new Error(`Paginated API failed: ${response.status}`);
        }
      } catch (paginatedError) {
        console.warn('Paginated API failed, falling back to basic API:', paginatedError);
        
        // Fallback to basic API
        response = await fetch(`http://localhost:8080/tasks?userEmail=${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        
        // Process basic API response to match paginated format
        const allTasks = Array.isArray(data) ? data : [];
        
        // Apply client-side filtering if needed
        let filteredTasks = allTasks;
        
        if (searchDebounce.trim()) {
          const search = searchDebounce.trim().toLowerCase();
          filteredTasks = filteredTasks.filter(task => 
            task.name?.toLowerCase().includes(search) || 
            task.description?.toLowerCase().includes(search) ||
            task.priority?.toLowerCase().includes(search) ||
            task.user?.name?.toLowerCase().includes(search) ||
            task.user?.email?.toLowerCase().includes(search)
          );
        }
        
        if (priorityFilter && priorityFilter !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
        }
        
        if (statusFilter !== 'all') {
          const isCompleted = statusFilter === 'true';
          filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
        }
        
        // Apply client-side sorting
        filteredTasks.sort((a, b) => {
          let aValue, bValue;
          
          switch (sortBy) {
            case 'name':
              aValue = a.name || '';
              bValue = b.name || '';
              break;
            case 'priority':
              const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
              aValue = priorityOrder[a.priority] || 0;
              bValue = priorityOrder[b.priority] || 0;
              break;
            case 'completed':
              aValue = a.completed ? 1 : 0;
              bValue = b.completed ? 1 : 0;
              break;
            case 'createdAt':
            default:
              aValue = new Date(a.createdAt || 0);
              bValue = new Date(b.createdAt || 0);
              break;
          }
          
          if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
          return 0;
        });
        
        // Apply client-side pagination
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
        
        setTasks(paginatedTasks);
        setTotalElements(filteredTasks.length);
        setTotalPages(Math.ceil(filteredTasks.length / pageSize));
        setHasNext(endIndex < filteredTasks.length);
        setHasPrevious(currentPage > 0);
      }
    } catch (error) {
      setError('Failed to load tasks: ' + error.message);
      console.error('Fetch tasks error:', error);
      setTasks([]);
      setTotalElements(0);
      setTotalPages(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await fetch(`http://localhost:8080/tasks/${id}?userEmail=${encodeURIComponent(userEmail)}`, { method: 'DELETE' });
        fetchTasks(); // Refresh the current page
      } catch (error) {
        setError('Failed to delete task');
        console.error('Delete task error:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setStatusFilter('all');
    setSortBy('createdAt');
    setSortDir('desc');
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Toggle direction if same field
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDir('desc'); // Default to descending for new field
    }
    setCurrentPage(0); // Reset to first page
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex flex-col items-center">
      <div className="max-w-6xl w-full backdrop-blur-lg bg-white/10 border border-blue-400/30 rounded-2xl shadow-xl p-8 mt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-300 drop-shadow mb-1">
              {isUserAdmin ? 'All Tasks (Admin View)' : 'My Tasks'}
            </h1>
            <p className="text-slate-300">
              {isUserAdmin ? 'Manage all tasks across the system' : 'Manage and track your tasks'}
            </p>
            <p className="text-xs text-blue-200 mt-2">
              Logged in as: <span className="font-semibold">{userName || userEmail}</span>
              {isUserAdmin && <span className="ml-2 px-2 py-1 bg-purple-600 text-xs rounded-full">ADMIN</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Link href="/tasks/add">Add New Task</Link>
            </Button>
            {isUserAdmin && (
              <Button asChild variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-900/30">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="border-blue-400 text-blue-300 hover:bg-blue-900/30">
              Logout
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/10 border border-blue-400/20 rounded-xl shadow-lg mb-6">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg text-blue-200">Search & Filter</CardTitle>
            <Button onClick={handleClearFilters} variant="outline" size="sm" className="border-blue-400 text-blue-300 hover:bg-blue-900/30">
              Clear Filters
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 items-end">
              {/* Search */}
              <div className="w-full">
                <label className="text-sm text-blue-200 mb-2 block">Search Tasks</label>
                <div className="relative">
                  <Input
                    placeholder="Search tasks, priority, or user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400 transition-all duration-200 pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="w-full">
                <label className="text-sm text-blue-200 mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-blue-400/30 text-slate-100">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="false">Pending</SelectItem>
                    <SelectItem value="true">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="w-full">
                <label className="text-sm text-blue-200 mb-2 block">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-blue-400/30 text-slate-100">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="w-full">
                <label className="text-sm text-blue-200 mb-2 block">Sort By</label>
                <div className="flex items-center gap-1 h-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange('name')}
                    className={`border-blue-400/40 text-blue-200 hover:bg-blue-900/20 text-sm px-3 h-full ${sortBy === 'name' ? 'bg-blue-900/40' : ''}`}
                  >
                    Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange('priority')}
                    className={`border-blue-400/40 text-blue-200 hover:bg-blue-900/20 text-sm px-3 h-full ${sortBy === 'priority' ? 'bg-blue-900/40' : ''}`}
                  >
                    Priority {sortBy === 'priority' && (sortDir === 'asc' ? '↑' : '↓')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange('createdAt')}
                    className={`border-blue-400/40 text-blue-200 hover:bg-blue-900/20 text-sm px-3 h-full ${sortBy === 'createdAt' ? 'bg-blue-900/40' : ''}`}
                  >
                    Date {sortBy === 'createdAt' && (sortDir === 'asc' ? '↑' : '↓')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {totalElements > 0 && (
          <div className="mb-4 text-sm text-blue-200">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} tasks (10 per page)
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-900/30 p-3 rounded mb-4 border border-red-400/30">
            {error}
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-6 mb-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400"></div>
                <span className="text-blue-200">Loading tasks...</span>
              </div>
            </div>
          )}
          {!loading && Array.isArray(tasks) && tasks.map((task) => (
              <Card key={task.id} className="bg-white/10 border border-blue-400/20 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-2xl font-bold text-blue-200 drop-shadow">{task.name}</CardTitle>
                        {isUserAdmin && task.user && task.user.email !== userEmail && (
                          <span className="px-2 py-1 bg-orange-600/80 text-white text-xs rounded-full">
                            User: {task.user.name || task.user.email}
                          </span>
                        )}
                      </div>
                      <CardDescription className="mt-1 text-slate-300">{task.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {(isUserAdmin || task.user?.email === userEmail) && (
                        <>
                          <Button variant="outline" size="sm" asChild className="border-blue-400 text-blue-300 hover:bg-blue-900/30">
                            <Link href={`/tasks/edit/${task.id}`}>Edit</Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)} className="bg-red-700/80 text-white hover:bg-red-900/80">
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Details Row */}
                  <div className="flex flex-wrap gap-6 mt-4">
                    <span className="text-xs text-blue-200">
                      Status: <span className={`font-bold ${
                        task.completed ? 'text-green-300' : 'text-yellow-300'
                      }`}>{task.completed ? 'Completed' : 'Pending'}</span>
                    </span>
                    <span className="text-xs text-blue-200">
                      Priority: <span className={`font-bold ${
                        task.priority === 'high' ? 'text-red-300' : 
                        task.priority === 'medium' ? 'text-yellow-300' : 'text-green-300'
                      }`}>{task.priority || 'N/A'}</span>
                    </span>
                    <span className="text-xs text-blue-200">Last Date: <span className="font-bold text-blue-300">{task.lastDate || 'N/A'}</span></span>
                    <span className="text-xs text-blue-200">Created: <span className="font-bold text-blue-300">{
                      task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'
                    }</span></span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="bg-white/10 border border-blue-400/20 rounded-xl shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(0)}
                    disabled={!hasPrevious}
                    variant="outline"
                    size="sm"
                    className="border-blue-400/40 text-blue-200 hover:bg-blue-900/20 disabled:opacity-50"
                  >
                    First
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevious}
                    variant="outline"
                    size="sm"
                    className="border-blue-400/40 text-blue-200 hover:bg-blue-900/20 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-200">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNext}
                    variant="outline"
                    size="sm"
                    className="border-blue-400/40 text-blue-200 hover:bg-blue-900/20 disabled:opacity-50"
                  >
                    Next
                  </Button>
                  <Button
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={!hasNext}
                    variant="outline"
                    size="sm"
                    className="border-blue-400/40 text-blue-200 hover:bg-blue-900/20 disabled:opacity-50"
                  >
                    Last
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(!Array.isArray(tasks) || tasks.length === 0) && !loading && (
          <Card className="text-center py-12 bg-white/10 border border-blue-400/20 rounded-xl shadow-lg">
            <CardContent>
              <h3 className="text-lg font-bold text-blue-200 mb-2">
                {searchTerm || (priorityFilter !== 'all') || (statusFilter !== 'all') ? 'No tasks match your filters' : 
                 isUserAdmin ? 'No tasks found in the system' : 'No tasks found'}
              </h3>
              <p className="text-slate-300 mb-4">
                {searchTerm || (priorityFilter !== 'all') || (statusFilter !== 'all') ? 'Try adjusting your search criteria or clearing filters.' :
                 isUserAdmin ? 'No users have created tasks yet.' : 'Get started by creating your first task.'}
              </p>
              {searchTerm || (priorityFilter !== 'all') || (statusFilter !== 'all') ? (
                <Button onClick={handleClearFilters} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  Clear Filters
                </Button>
              ) : !isUserAdmin && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <Link href="/tasks/add">Add Your First Task</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
