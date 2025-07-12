'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#10141a]">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900 via-indigo-900 to-[#10141a] opacity-80 blur-2xl" />
      {/* Glassmorphism Card */}
      <Card className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center p-12 rounded-3xl">
      {/* ...removed logo/icon... */}
        <CardHeader className="w-full flex flex-col items-center justify-center text-center">
          <CardTitle className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">Task Manager</CardTitle>
          <CardDescription className="text-xl text-slate-300 mb-8 max-w-md">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Minimal. Fast. Beautiful.</span><br/>
            Organize your life and work with a modern, distraction-free task manager.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button asChild className="w-full sm:w-1/2 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl transition-all duration-200">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-1/2 py-4 text-lg font-semibold border border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-white rounded-2xl transition-all duration-200">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Subtle Glow Effect */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[480px] h-[240px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl opacity-60 z-0" />
    </div>
  );
}
