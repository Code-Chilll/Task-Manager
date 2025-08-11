"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgetPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.text();
      if (response.ok) {
        setStep(2);
      } else {
        setError(result);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError("");

    // Frontend validation for matching passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });
      const result = await response.text();
      if (response.ok) {
        router.push("/login");
      } else {
        setError(result);
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-blue-300 mb-2 drop-shadow">
            {step === 1 ? "Forget Password" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded border border-red-500/30">
              {error}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-200">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
              </div>
              <Button
                onClick={handleSendOtp}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-800 hover:to-blue-500 transition"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-blue-200">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-blue-200">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-blue-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="bg-white/20 text-slate-100 border-blue-400/30 focus:border-blue-400 placeholder:text-slate-400"
                />
              </div>
              <Button
                onClick={handleResetPassword}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-800 hover:to-blue-500 transition"
                disabled={loading}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
