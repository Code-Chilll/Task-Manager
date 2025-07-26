'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setUserEmail } from '@/lib/auth';

export default function Signup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
  });

  const [step, setStep] = useState('form'); // form → otp → done
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Basic email format check
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
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

  const validateOtp = () => {
    const errors = {};
    if (!formData.otp) {
      errors.otp = 'OTP is required';
    } else if (!/^\d{4,6}$/.test(formData.otp)) {
      errors.otp = 'OTP must be 4-6 digits';
    }
    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setFieldErrors({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/auth/send-otp?email=${formData.email}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      setStep('otp');
      setMessage('OTP sent to your email. Please enter it to complete signup.');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    const errors = validateOtp();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/auth/signup?otp=${formData.otp}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await res.text();
      if (result === 'User registered successfully') {
        setUserEmail(formData.email);
        router.push('/tasks');
      } else {
        setError(result);
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-blue-300 mb-2 drop-shadow">Sign Up</CardTitle>
            <CardDescription className="text-slate-300">Create your Task Manager account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === 'form' ? (e) => { e.preventDefault(); handleSendOtp(); } : handleSignup} className="space-y-6">
              {error && <div className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded border border-red-500/30">{error}</div>}
              {message && <div className="text-green-400 text-sm text-center bg-green-900/30 p-2 rounded border border-green-500/30">{message}</div>}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-200">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={step === 'otp'}
                    className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
                {fieldErrors.name && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-200">Email Address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={step === 'otp'}
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={step === 'otp'}
                    className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
                {fieldErrors.password && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.password}</div>
                )}
              </div>

              {step === 'otp' && (
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-blue-200">Enter OTP</Label>
                    <Input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        placeholder="OTP sent to your email"
                        value={formData.otp}
                        onChange={handleChange}
                        className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                    />
                    {fieldErrors.otp && (
                      <div className="text-red-400 text-xs mt-1">{fieldErrors.otp}</div>
                    )}
                  </div>
              )}

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-800 hover:to-blue-500 transition" disabled={loading}>
                {loading
                    ? step === 'form'
                        ? 'Sending OTP...'
                        : 'Verifying...'
                    : step === 'form'
                        ? 'Send OTP'
                        : 'Sign Up'}
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-blue-200 hover:text-white transition">
                  Already have an account? Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
