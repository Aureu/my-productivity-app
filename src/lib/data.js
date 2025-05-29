// lib/data.js - Shared data store for tasks and projects

// In-memory store for tasks (replace with a database later)
export let tasks = [
	{
		id: 1,
		title: 'Learn Next.js basics',
		description: 'Complete the Next.js tutorial and understand the basics',
		dueDate: '2024-01-15',
		priority: 'high',
		projectId: 1,
		parentId: null,
		completed: false,
		recurrenceRule: null,
	},
	{
		id: 2,
		title: 'Plan MVP features',
		description:
			'Define the minimum viable product features for the productivity app',
		dueDate: '2024-01-10',
		priority: 'medium',
		projectId: 2,
		parentId: null,
		completed: true,
		recurrenceRule: null,
	},
	{
		id: 3,
		title: 'Set up development environment',
		description: 'Install Node.js, VS Code, and other development tools',
		dueDate: '2024-01-12',
		priority: 'high',
		projectId: 1,
		parentId: 1,
		completed: false,
		recurrenceRule: null,
	},
];

export let nextTaskId = 4;

// In-memory store for projects (replace with a database later)
export let projects = [
	{ id: 1, name: 'Personal Development' },
	{ id: 2, name: 'Work Projects' },
	{ id: 3, name: 'Home & Family' },
];

export let nextProjectId = 4;

// Helper functions
export function findTaskById(id) {
	return tasks.find((task) => task.id === parseInt(id));
}

export function findTaskIndexById(id) {
	return tasks.findIndex((task) => task.id === parseInt(id));
}

export function addTask(taskData) {
	const newTask = {
		id: nextTaskId++,
		title: taskData.title,
		description: taskData.description || '',
		dueDate: taskData.dueDate || null,
		priority: taskData.priority || 'none',
		projectId: taskData.projectId || null,
		parentId: taskData.parentId || null,
		completed: false,
		recurrenceRule: taskData.recurrenceRule || null,
	};
	tasks.push(newTask);
	return newTask;
}

export function updateTask(id, updateData) {
	const taskIndex = findTaskIndexById(id);
	if (taskIndex === -1) return null;

	const updatedTask = {
		...tasks[taskIndex],
		...updateData,
		id: parseInt(id), // Ensure ID doesn't change
	};

	tasks[taskIndex] = updatedTask;
	return updatedTask;
}

export function deleteTask(id) {
	const taskIndex = findTaskIndexById(id);
	if (taskIndex === -1) return null;

	const deletedTask = tasks[taskIndex];
	tasks.splice(taskIndex, 1);
	return deletedTask;
}

export function findProjectById(id) {
	return projects.find((project) => project.id === parseInt(id));
}

export function addProject(projectData) {
	const newProject = {
		id: nextProjectId++,
		name: projectData.name,
	};
	projects.push(newProject);
	return newProject;
}
