import { NextResponse } from 'next/server';
import {
	getTaskById,
	updateTask,
	deleteTask,
} from '../../../../lib/firebaseData.js';

// Handler for GET requests (fetch a specific task)
export async function GET(request, { params }) {
	try {
		const task = await getTaskById(params.taskId);

		if (!task) {
			return NextResponse.json({ error: 'Task not found' }, { status: 404 });
		}

		return NextResponse.json(task);
	} catch (error) {
		console.error('Failed to fetch task:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch task' },
			{ status: 500 }
		);
	}
}

// Handler for PUT requests (update a specific task)
export async function PUT(request, { params }) {
	try {
		const updateData = await request.json();
		const updatedTask = await updateTask(params.taskId, updateData);

		if (!updatedTask) {
			return NextResponse.json({ error: 'Task not found' }, { status: 404 });
		}

		return NextResponse.json(updatedTask);
	} catch (error) {
		console.error('Failed to update task:', error);
		return NextResponse.json(
			{ error: 'Failed to update task' },
			{ status: 500 }
		);
	}
}

// Handler for DELETE requests (delete a specific task)
export async function DELETE(request, { params }) {
	try {
		const deletedTask = await deleteTask(params.taskId);

		if (!deletedTask) {
			return NextResponse.json({ error: 'Task not found' }, { status: 404 });
		}

		return NextResponse.json({
			message: 'Task deleted successfully',
			task: deletedTask,
		});
	} catch (error) {
		console.error('Failed to delete task:', error);
		return NextResponse.json(
			{ error: 'Failed to delete task' },
			{ status: 500 }
		);
	}
}
