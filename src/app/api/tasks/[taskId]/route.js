import { NextResponse } from 'next/server';
import { findTaskById, updateTask, deleteTask } from '../../../../lib/data.js';

// Handler for GET requests (fetch a specific task)
export async function GET(request, { params }) {
	const task = findTaskById(params.taskId);

	if (!task) {
		return NextResponse.json({ error: 'Task not found' }, { status: 404 });
	}

	return NextResponse.json(task);
}

// Handler for PUT requests (update a specific task)
export async function PUT(request, { params }) {
	try {
		const updateData = await request.json();
		const updatedTask = updateTask(params.taskId, updateData);

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
		const deletedTask = deleteTask(params.taskId);

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
