import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectListProps {
	projects: Project[];
	onCreateProject: (name: string) => void;
	selectedProjectId: number | null;
	onSelectProject: (projectId: number | null) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
	projects,
	onCreateProject,
	selectedProjectId,
	onSelectProject,
}) => {
	const [newProjectName, setNewProjectName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newProjectName.trim()) return;

		onCreateProject(newProjectName.trim());
		setNewProjectName('');
		setIsCreating(false);
	};

	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h3 className='text-lg font-semibold text-gray-900'>Projects</h3>
					<p className='text-sm text-gray-600 mt-1'>
						Organize your tasks by project or category
					</p>
				</div>
				<button
					onClick={() => setIsCreating(!isCreating)}
					className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
						isCreating
							? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
							: 'bg-green-600 hover:bg-green-700 text-white'
					}`}
				>
					{isCreating ? (
						<>
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
							Cancel
						</>
					) : (
						<>
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
									d='M12 4v16m8-8H4'
								/>
							</svg>
							New Project
						</>
					)}
				</button>
			</div>

			{isCreating && (
				<div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
					<form onSubmit={handleSubmit}>
						<div className='flex gap-3'>
							<input
								type='text'
								value={newProjectName}
								onChange={(e) => setNewProjectName(e.target.value)}
								placeholder='Enter project name...'
								className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								autoFocus
							/>
							<button
								type='submit'
								disabled={!newProjectName.trim()}
								className='px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200'
							>
								Create
							</button>
						</div>
					</form>
				</div>
			)}

			<div className='flex flex-wrap gap-2'>
				<button
					onClick={() => onSelectProject(null)}
					className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
						selectedProjectId === null
							? 'bg-blue-600 text-white shadow-sm'
							: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-sm'
					}`}
				>
					<span className='flex items-center gap-2'>
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
								d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
							/>
						</svg>
						All Tasks
					</span>
				</button>
				{projects.map((project) => (
					<button
						key={project.id}
						onClick={() => onSelectProject(project.id)}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
							selectedProjectId === project.id
								? 'bg-blue-600 text-white shadow-sm'
								: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-sm'
						}`}
					>
						<span className='flex items-center gap-2'>
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
									d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
								/>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z'
								/>
							</svg>
							{project.name}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default ProjectList;
