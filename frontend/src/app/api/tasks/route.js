import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Task from '@/models/Task';

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    let query = {};
    if (filter === 'active') query.completed = false;
    if (filter === 'completed') query.completed = true;

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}