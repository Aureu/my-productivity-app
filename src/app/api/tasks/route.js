// app/api/tasks/route.js
import { NextResponse } from 'next/server';
import { getAllTasks, createTask } from '../../../lib/firebaseData.js';

// Handler for GET requests (fetch all tasks)
export async function GET(request) {
	try {
		// Get query parameters for filtering
		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get('projectId');

		const tasks = await getAllTasks(projectId);
		return NextResponse.json(tasks);
	} catch (error) {
		console.error('Failed to fetch tasks:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch tasks' },
			{ status: 500 }
		);
	}
}

// Handler for POST requests (add a new task)
export async function POST(request) {
	try {
		const taskData = await request.json();

		if (!taskData.title) {
			return NextResponse.json({ error: 'Title is required' }, { status: 400 });
		}

		const newTask = await createTask(taskData);
		return NextResponse.json(newTask, { status: 201 }); // 201 Created
	} catch (error) {
		console.error('Failed to create task:', error);
		return NextResponse.json(
			{ error: 'Failed to create task' },
			{ status: 500 }
		);
	}
}
