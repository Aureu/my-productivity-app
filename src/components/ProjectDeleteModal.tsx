import React from 'react';
import { Project, Task } from '../types';

interface ProjectDeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	project: Project | null;
	tasks: Task[];
	onConfirm: (deleteAssociatedTasks: boolean) => void;
}

export default function ProjectDeleteModal({
	isOpen,
	onClose,
	project,
	tasks,
	onConfirm,
}: ProjectDeleteModalProps) {
	if (!isOpen || !project) return null;

	const projectTasks = tasks.filter((task) => task.projectId === project.id);
	const taskCount = projectTasks.length;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
				<div className='p-6'>
					<div className='flex items-center mb-4'>
						<div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100'>
							<svg
								className='h-6 w-6 text-red-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c.77.833 1.732 2.5 1.732 2.5z'
								/>
							</svg>
						</div>
					</div>

					<div className='text-center'>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Delete Project &quot;{project.name}&quot;?
						</h3>

						{taskCount > 0 ? (
							<div className='mb-6'>
								<p className='text-sm text-gray-500 mb-4'>
									This project contains {taskCount} task
									{taskCount !== 1 ? 's' : ''}. What would you like to do with{' '}
									{taskCount === 1 ? 'it' : 'them'}?
								</p>

								<div className='space-y-3'>
									<button
										onClick={() => onConfirm(false)}
										className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
									>
										Keep tasks (unassign from project)
									</button>

									<button
										onClick={() => onConfirm(true)}
										className='w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
									>
										Delete tasks along with project
									</button>
								</div>
							</div>
						) : (
							<div className='mb-6'>
								<p className='text-sm text-gray-500 mb-4'>
									This project is empty and can be safely deleted.
								</p>

								<button
									onClick={() => onConfirm(true)}
									className='w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
								>
									Delete Project
								</button>
							</div>
						)}

						<button
							onClick={onClose}
							className='w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
