'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUserEmail, setUserRole, setUserName, isAuthenticated } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Basic email format check
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      router.push('/tasks');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      // Direct API call
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store user information including role
        setUserEmail(result.email);
        setUserRole(result.role);
        setUserName(result.name);
        router.push('/tasks');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-blue-300 mb-2 drop-shadow">Sign In</CardTitle>
          <CardDescription className="text-slate-300">Sign in to your Task Manager account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded border border-red-500/30">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-200">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
              />
              {fieldErrors.email && (
                <div className="text-red-400 text-xs mt-1">{fieldErrors.email}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
              />
              {fieldErrors.password && (
                <div className="text-red-400 text-xs mt-1">{fieldErrors.password}</div>
              )}
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-800 hover:to-blue-500 transition" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm">
              <Link href="/signup" className="text-blue-200 hover:text-white transition">
                No account? Sign up
              </Link>
            </div>
            <div className="text-center text-sm mt-2">
              <Link href="/forget-password" className="text-blue-200 hover:text-white transition">
                Forgot your password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
