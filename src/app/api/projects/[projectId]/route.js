import { NextResponse } from 'next/server';
import {
	getProjectById,
	updateProject,
	deleteProject,
} from '../../../../lib/firebaseData.js';

// Handler for GET requests (fetch a specific project)
export async function GET(request, { params }) {
	try {
		const project = await getProjectById(params.projectId);

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

// Handler for PUT requests (update a specific project)
export async function PUT(request, { params }) {
	try {
		const updateData = await request.json();

		if (!updateData.name) {
			return NextResponse.json(
				{ error: 'Project name is required' },
				{ status: 400 }
			);
		}

		const updatedProject = await updateProject(params.projectId, updateData);

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

// Handler for DELETE requests (delete a specific project)
export async function DELETE(request, { params }) {
	try {
		// Get query parameter to determine if associated tasks should be deleted
		const { searchParams } = new URL(request.url);
		const deleteAssociatedTasks =
			searchParams.get('deleteAssociatedTasks') === 'true';

		const deletedProject = await deleteProject(
			params.projectId,
			deleteAssociatedTasks
		);

		if (!deletedProject) {
			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		return NextResponse.json({
			message: 'Project deleted successfully',
			project: deletedProject,
			deletedAssociatedTasks,
		});
	} catch (error) {
		console.error('Failed to delete project:', error);
		return NextResponse.json(
			{ error: 'Failed to delete project' },
			{ status: 500 }
		);
	}
}
