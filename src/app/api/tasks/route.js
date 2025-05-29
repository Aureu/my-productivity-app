// app/api/tasks/route.js
import { NextResponse } from 'next/server';
import { tasks, addTask } from '../../../lib/data.js';

// Handler for GET requests (fetch all tasks)
export async function GET() {
	return NextResponse.json(tasks);
}

// Handler for POST requests (add a new task)
export async function POST(request) {
	try {
		const taskData = await request.json();

		if (!taskData.title) {
			return NextResponse.json({ error: 'Title is required' }, { status: 400 });
		}

		const newTask = addTask(taskData);
		return NextResponse.json(newTask, { status: 201 }); // 201 Created
	} catch (error) {
		console.error('Failed to create task:', error);
		return NextResponse.json(
			{ error: 'Failed to create task' },
			{ status: 500 }
		);
	}
}
