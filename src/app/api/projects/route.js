import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '../../../lib/firebaseData.js';

// Handler for GET requests (fetch all projects)
export async function GET() {
	try {
		const projects = await getAllProjects();
		return NextResponse.json(projects);
	} catch (error) {
		console.error('Failed to fetch projects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch projects' },
			{ status: 500 }
		);
	}
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

		const newProject = await createProject(projectData);
		return NextResponse.json(newProject, { status: 201 }); // 201 Created
	} catch (error) {
		console.error('Failed to create project:', error);
		return NextResponse.json(
			{ error: 'Failed to create project' },
			{ status: 500 }
		);
	}
}
