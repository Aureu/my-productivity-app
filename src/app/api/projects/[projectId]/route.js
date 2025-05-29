import { NextResponse } from 'next/server';
import {
	tasks,
	findProjectById,
	updateProject,
	deleteProject,
} from '../../../../lib/data.js';

// Handler for GET requests (fetch a specific project)
export async function GET(request, { params }) {
	try {
		const projectId = parseInt(params.projectId);
		const project = findProjectById(projectId);

		if (!project) {
			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		return NextResponse.json(project);
	} catch (error) {
		console.error('Failed to fetch project:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch project' },
			{ status: 500 }
		);
	}
}

// Handler for PUT requests (update a project)
export async function PUT(request, { params }) {
	try {
		const projectId = parseInt(params.projectId);
		const projectData = await request.json();

		if (!projectData.name || !projectData.name.trim()) {
			return NextResponse.json(
				{ error: 'Project name is required' },
				{ status: 400 }
			);
		}

		const updatedProject = updateProject(projectId, projectData);

		if (!updatedProject) {
			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		return NextResponse.json(updatedProject);
	} catch (error) {
		console.error('Failed to update project:', error);
		return NextResponse.json(
			{ error: 'Failed to update project' },
			{ status: 500 }
		);
	}
}

// Handler for DELETE requests (delete a project)
export async function DELETE(request, { params }) {
	try {
		const projectId = parseInt(params.projectId);
		const url = new URL(request.url);
		const handleTasks = url.searchParams.get('handleTasks'); // 'delete' or 'unassign'

		const project = findProjectById(projectId);
		if (!project) {
			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		// Find tasks assigned to this project
		const projectTasks = tasks.filter((task) => task.projectId === projectId);

		if (projectTasks.length > 0 && !handleTasks) {
			// Return information about tasks that need to be handled
			return NextResponse.json(
				{
					error: 'Project contains tasks',
					taskCount: projectTasks.length,
					tasks: projectTasks.map((task) => ({
						id: task.id,
						title: task.title,
					})),
				},
				{ status: 409 }
			); // 409 Conflict
		}

		// Handle tasks based on the specified action
		if (projectTasks.length > 0) {
			if (handleTasks === 'delete') {
				// Delete all tasks in the project (including subtasks)
				const taskIdsToDelete = [];

				// First, collect all task IDs (including subtasks)
				projectTasks.forEach((task) => {
					taskIdsToDelete.push(task.id);
					// Find subtasks of this task
					const subtasks = tasks.filter((t) => t.parentId === task.id);
					subtasks.forEach((subtask) => taskIdsToDelete.push(subtask.id));
				});

				// Remove all collected tasks
				taskIdsToDelete.forEach((taskId) => {
					const taskIndex = tasks.findIndex((t) => t.id === taskId);
					if (taskIndex !== -1) {
						tasks.splice(taskIndex, 1);
					}
				});
			} else if (handleTasks === 'unassign') {
				// Unassign tasks from the project
				projectTasks.forEach((task) => {
					task.projectId = null;
				});
			}
		}

		// Delete the project
		const deletedProject = deleteProject(projectId);

		if (!deletedProject) {
			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		return NextResponse.json({
			message: 'Project deleted successfully',
			deletedProject,
			tasksHandled: projectTasks.length,
			action: handleTasks || 'none',
		});
	} catch (error) {
		console.error('Failed to delete project:', error);
		return NextResponse.json(
			{ error: 'Failed to delete project' },
			{ status: 500 }
		);
	}
}
