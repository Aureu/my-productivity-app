import React, { useState } from 'react';
import { Project, Task } from '../types';
import ProjectDeleteModal from './ProjectDeleteModal';

interface ProjectListProps {
	projects: Project[];
	tasks: Task[];
	selectedProjectId: string | null;
	onProjectSelect: (projectId: string | null) => void;
	onProjectCreate: (name: string) => void;
	onProjectUpdate: (projectId: string, name: string) => void;
	onProjectDelete: (projectId: string, deleteAssociatedTasks: boolean) => void;
}

export default function ProjectList({
	projects,
	tasks,
	selectedProjectId,
	onProjectSelect,
	onProjectCreate,
	onProjectUpdate,
	onProjectDelete,
}: ProjectListProps) {
	const [isCreating, setIsCreating] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');
	const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
	const [editingProjectName, setEditingProjectName] = useState('');
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

	const handleCreateProject = () => {
		if (newProjectName.trim()) {
			onProjectCreate(newProjectName.trim());
			setNewProjectName('');
			setIsCreating(false);
		}
	};

	const handleEditProject = (project: Project) => {
		setEditingProjectId(project.id);
		setEditingProjectName(project.name);
	};

	const handleUpdateProject = () => {
		if (editingProjectName.trim() && editingProjectId) {
			onProjectUpdate(editingProjectId, editingProjectName.trim());
			setEditingProjectId(null);
			setEditingProjectName('');
		}
	};

	const handleCancelEdit = () => {
		setEditingProjectId(null);
		setEditingProjectName('');
	};

	const handleDeleteClick = (project: Project) => {
		setProjectToDelete(project);
		setDeleteModalOpen(true);
	};

	const handleDeleteConfirm = (deleteAssociatedTasks: boolean) => {
		if (projectToDelete) {
			onProjectDelete(projectToDelete.id, deleteAssociatedTasks);
			setDeleteModalOpen(false);
			setProjectToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteModalOpen(false);
		setProjectToDelete(null);
	};

	return (
		<>
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<div className='flex items-center justify-between mb-4'>
					<div>
						<h2 className='text-lg font-semibold text-gray-900'>Projects</h2>
						<p className='text-sm text-gray-600'>
							Organize your tasks by project
						</p>
					</div>
					<button
						onClick={() => setIsCreating(true)}
						className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
					>
						<svg
							className='w-4 h-4 mr-1'
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
						New Project
					</button>
				</div>

				<div className='flex flex-wrap gap-2 mb-4'>
					<button
						onClick={() => onProjectSelect(null)}
						className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
							selectedProjectId === null
								? 'bg-blue-100 text-blue-800 border border-blue-200'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
						}`}
					>
						All Tasks ({tasks.length})
					</button>
					{projects.map((project) => {
						const projectTaskCount = tasks.filter(
							(task) => task.projectId === project.id
						).length;

						return (
							<div key={project.id} className='relative group'>
								{editingProjectId === project.id ? (
									<div className='flex items-center gap-1'>
										<input
											type='text'
											value={editingProjectName}
											onChange={(e) => setEditingProjectName(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleUpdateProject();
												if (e.key === 'Escape') handleCancelEdit();
											}}
											className='px-3 py-1 text-sm border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
											autoFocus
										/>
										<button
											onClick={handleUpdateProject}
											className='p-1 text-green-600 hover:text-green-700'
										>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</button>
										<button
											onClick={handleCancelEdit}
											className='p-1 text-gray-400 hover:text-gray-600'
										>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M6 18L18 6M6 6l12 12'
												/>
											</svg>
										</button>
									</div>
								) : (
									<div className='flex items-center'>
										<button
											onClick={() => onProjectSelect(project.id)}
											className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
												selectedProjectId === project.id
													? 'bg-blue-100 text-blue-800 border border-blue-200'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
											}`}
										>
											{project.name} ({projectTaskCount})
										</button>
										<div className='ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1'>
											<button
												onClick={() => handleEditProject(project)}
												className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
												title='Edit project'
											>
												<svg
													className='w-3 h-3'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
													/>
												</svg>
											</button>
											<button
												onClick={() => handleDeleteClick(project)}
												className='p-1 text-gray-400 hover:text-red-600 transition-colors'
												title='Delete project'
											>
												<svg
													className='w-3 h-3'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
													/>
												</svg>
											</button>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>

				{isCreating && (
					<div className='flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-md'>
						<input
							type='text'
							value={newProjectName}
							onChange={(e) => setNewProjectName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleCreateProject();
								if (e.key === 'Escape') setIsCreating(false);
							}}
							placeholder='Enter project name...'
							className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							autoFocus
						/>
						<button
							onClick={handleCreateProject}
							disabled={!newProjectName.trim()}
							className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						>
							Create
						</button>
						<button
							onClick={() => {
								setIsCreating(false);
								setNewProjectName('');
							}}
							className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
						>
							Cancel
						</button>
					</div>
				)}
			</div>

			<ProjectDeleteModal
				isOpen={deleteModalOpen}
				onClose={handleDeleteCancel}
				project={projectToDelete}
				tasks={tasks}
				onConfirm={handleDeleteConfirm}
			/>
		</>
	);
}
