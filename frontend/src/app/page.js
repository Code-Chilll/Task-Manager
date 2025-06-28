import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome to Task Manager</CardTitle>
          <CardDescription className="text-lg">
            Organize your tasks efficiently with our simple task management system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="default" size="lg">
              <Link href="/signup">Sign Up</Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
            
            <Button asChild variant="secondary" size="lg">
              <Link href="/tasks">View Tasks</Link>
            </Button>
            
            <Button asChild variant="default" size="lg">
              <Link href="/tasks/add">Add New Task</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
