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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create your Task Manager account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === 'form' ? (e) => { e.preventDefault(); handleSendOtp(); } : handleSignup} className="space-y-4">
              {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
              {message && <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">{message}</div>}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={step === 'otp'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={step === 'otp'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={step === 'otp'}
                />
              </div>

              {step === 'otp' && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        placeholder="OTP sent to your email"
                        value={formData.otp}
                        onChange={handleChange}
                    />
                  </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                    ? step === 'form'
                        ? 'Sending OTP...'
                        : 'Verifying...'
                    : step === 'form'
                        ? 'Send OTP'
                        : 'Sign Up'}
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-slate-600 hover:text-slate-900">
                  Already have an account? Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
