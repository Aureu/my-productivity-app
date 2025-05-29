// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import ProjectList from '../components/ProjectList';
import { Task, Project } from '../types';

export default function HomePage() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showTaskForm, setShowTaskForm] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
		null
	);
	const [reminderMessage, setReminderMessage] = useState<string | null>(null);

	// Function to fetch tasks
	const fetchTasks = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch('/api/tasks');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setTasks(data);
		} catch (e) {
			console.error('Failed to fetch tasks:', e);
			setError(e instanceof Error ? e.message : 'Unknown error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	// Function to fetch projects
	const fetchProjects = async () => {
		try {
			const response = await fetch('/api/projects');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setProjects(data);
		} catch (e) {
			console.error('Failed to fetch projects:', e);
		}
	};

	// Check for reminders
	const checkReminders = () => {
		const today = new Date();
		const todayString = today.toISOString().split('T')[0];

		const dueTasks = tasks.filter(
			(task) => !task.completed && task.dueDate === todayString
		);

		if (dueTasks.length > 0) {
			setReminderMessage(`You have ${dueTasks.length} task(s) due today!`);
		} else {
			setReminderMessage(null);
		}
	};

	// Fetch data when the component mounts
	useEffect(() => {
		fetchTasks();
		fetchProjects();
	}, []);

	// Check reminders when tasks change
	useEffect(() => {
		checkReminders();
	}, [tasks]);

	// Function to handle creating/updating a task
	const handleTaskSubmit = async (taskData: Partial<Task>) => {
		try {
			if (editingTask) {
				// Update existing task
				const response = await fetch(`/api/tasks/${editingTask.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(taskData),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			} else {
				// Create new task
				const response = await fetch('/api/tasks', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(taskData),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			}

			setShowTaskForm(false);
			setEditingTask(null);
			fetchTasks(); // Refetch all tasks
		} catch (e) {
			console.error('Failed to save task:', e);
			setError(e instanceof Error ? e.message : 'Unknown error occurred');
		}
	};

	// Function to handle deleting a task
	const handleDeleteTask = async (taskId: number) => {
		if (!confirm('Are you sure you want to delete this task?')) return;

		try {
			const response = await fetch(`/api/tasks/${taskId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			fetchTasks(); // Refetch all tasks
		} catch (e) {
			console.error('Failed to delete task:', e);
			setError(e instanceof Error ? e.message : 'Unknown error occurred');
		}
	};

	// Function to handle toggling task completion
	const handleToggleComplete = async (taskId: number, completed: boolean) => {
		try {
			const response = await fetch(`/api/tasks/${taskId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ completed }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			fetchTasks(); // Refetch all tasks
		} catch (e) {
			console.error('Failed to update task:', e);
			setError(e instanceof Error ? e.message : 'Unknown error occurred');
		}
	};

	// Function to handle creating a project
	const handleCreateProject = async (name: string) => {
		try {
			const response = await fetch('/api/projects', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			fetchProjects(); // Refetch all projects
		} catch (e) {
			console.error('Failed to create project:', e);
			setError(e instanceof Error ? e.message : 'Unknown error occurred');
		}
	};

	// Filter tasks based on selected project and organize by parent/child
	const filteredTasks = tasks.filter(
		(task) => selectedProjectId === null || task.projectId === selectedProjectId
	);

	const mainTasks = filteredTasks.filter((task) => !task.parentId);
	const subtasks = filteredTasks.filter((task) => task.parentId);

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600 text-lg'>Loading your tasks...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4'>
					<div className='text-center'>
						<div className='text-red-500 text-4xl mb-4'>⚠️</div>
						<h2 className='text-xl font-semibold text-gray-900 mb-2'>
							Something went wrong
						</h2>
						<p className='text-gray-600 mb-4'>Error loading tasks: {error}</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<header className='bg-white shadow-sm border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900'>
								My Productivity App
							</h1>
							<p className='text-gray-600 mt-1'>
								Organize your tasks and boost your productivity
							</p>
						</div>
						<button
							onClick={() => setShowTaskForm(true)}
							className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm'
						>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 4v16m8-8H4'
								/>
							</svg>
							Add New Task
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Reminder Alert */}
				{reminderMessage && (
					<div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6'>
						<div className='flex items-center'>
							<div className='text-amber-600 text-xl mr-3'>⚠️</div>
							<div>
								<p className='text-amber-800 font-medium'>{reminderMessage}</p>
								<p className='text-amber-700 text-sm mt-1'>
									Don&apos;t forget to complete your tasks on time!
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Projects Section */}
				<div className='mb-8'>
					<ProjectList
						projects={projects}
						onCreateProject={handleCreateProject}
						selectedProjectId={selectedProjectId}
						onSelectProject={setSelectedProjectId}
					/>
				</div>

				{/* Tasks Section */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex items-center justify-between'>
							<div>
								<h2 className='text-xl font-semibold text-gray-900'>
									Tasks
									{selectedProjectId && (
										<span className='text-gray-500 font-normal'>
											{' '}
											in{' '}
											{projects.find((p) => p.id === selectedProjectId)?.name}
										</span>
									)}
								</h2>
								<p className='text-sm text-gray-600 mt-1'>
									{filteredTasks.length} task
									{filteredTasks.length !== 1 ? 's' : ''}{' '}
									{selectedProjectId ? 'in this project' : 'total'}
								</p>
							</div>
						</div>
					</div>

					<div className='p-6'>
						{filteredTasks.length === 0 ? (
							<div className='text-center py-12'>
								<div className='text-gray-400 text-6xl mb-4'>📝</div>
								<h3 className='text-lg font-medium text-gray-900 mb-2'>
									No tasks yet
								</h3>
								<p className='text-gray-600 mb-6'>
									{selectedProjectId
										? 'This project has no tasks. Create your first task to get started!'
										: 'Create your first task to get started with your productivity journey!'}
								</p>
								<button
									onClick={() => setShowTaskForm(true)}
									className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2'
								>
									<svg
										className='w-5 h-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 4v16m8-8H4'
										/>
									</svg>
									Create First Task
								</button>
							</div>
						) : (
							<div className='space-y-3'>
								{mainTasks.map((task) => (
									<div key={task.id}>
										<TaskItem
											task={task}
											projects={projects}
											onEdit={(task) => {
												setEditingTask(task);
												setShowTaskForm(true);
											}}
											onDelete={handleDeleteTask}
											onToggleComplete={handleToggleComplete}
										/>
										{/* Render subtasks */}
										{subtasks
											.filter((subtask) => subtask.parentId === task.id)
											.map((subtask) => (
												<TaskItem
													key={subtask.id}
													task={subtask}
													projects={projects}
													isSubtask={true}
													onEdit={(task) => {
														setEditingTask(task);
														setShowTaskForm(true);
													}}
													onDelete={handleDeleteTask}
													onToggleComplete={handleToggleComplete}
												/>
											))}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</main>

			{/* Task Form Modal */}
			{showTaskForm && (
				<TaskForm
					task={editingTask}
					projects={projects}
					tasks={tasks}
					onSubmit={handleTaskSubmit}
					onCancel={() => {
						setShowTaskForm(false);
						setEditingTask(null);
					}}
				/>
			)}
		</div>
	);
}
