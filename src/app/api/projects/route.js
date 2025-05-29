import { NextResponse } from 'next/server';
import { projects, addProject } from '../../../lib/data.js';

// Handler for GET requests (fetch all projects)
export async function GET(request) {
	return NextResponse.json(projects);
}

// Handler for POST requests (add a new project)
export async function POST(request) {
	try {
		const projectData = await request.json();

		if (!projectData.name) {
			return NextResponse.json(
				{ error: 'Project name is required' },
				{ status: 400 }
			);
		}

		const newProject = addProject(projectData);
		return NextResponse.json(newProject, { status: 201 }); // 201 Created
	} catch (error) {
		console.error('Failed to create project:', error);
		return NextResponse.json(
			{ error: 'Failed to create project' },
			{ status: 500 }
		);
	}
}
