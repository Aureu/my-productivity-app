import React, { useState } from 'react';
import { Task, Project } from '../types';

interface TaskItemProps {
	task: Task;
	projects: Project[];
	isSubtask?: boolean;
	subtasks?: Task[];
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => void;
	onToggleComplete: (taskId: string, completed: boolean) => void;
	onCreateSubtask?: (parentTask: Task) => void;
}

export default function TaskItem({
	task,
	projects,
	isSubtask = false,
	subtasks = [],
	onEdit,
	onDelete,
	onToggleComplete,
	onCreateSubtask,
}: TaskItemProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	const project = projects.find((p) => p.id === task.projectId);
	const hasSubtasks = subtasks.length > 0;
	const canHaveSubtasks = !isSubtask; // Only main tasks can have subtasks

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low':
				return 'bg-green-100 text-green-800 border-green-200';
			default:
				return 'bg-gray-100 text-gray-600 border-gray-200';
		}
	};

	const getPriorityEmoji = (priority: string) => {
		switch (priority) {
			case 'high':
				return '🔴';
			case 'medium':
				return '🟡';
			case 'low':
				return '🟢';
			default:
				return '';
		}
	};

	const getDueDateStatus = (dueDate: string | null) => {
		if (!dueDate) return null;

		const today = new Date();
		const due = new Date(dueDate);
		const todayString = today.toISOString().split('T')[0];
		const dueDateString = due.toISOString().split('T')[0];

		if (dueDateString < todayString) {
			return {
				status: 'overdue',
				color: 'bg-red-100 text-red-800 border-red-200',
			};
		} else if (dueDateString === todayString) {
			return {
				status: 'due-today',
				color: 'bg-orange-100 text-orange-800 border-orange-200',
			};
		}
		return {
			status: 'upcoming',
			color: 'bg-blue-100 text-blue-800 border-blue-200',
		};
	};

	const dueDateStatus = getDueDateStatus(task.dueDate);

	const toggleExpanded = () => {
		if (hasSubtasks) {
			setIsExpanded(!isExpanded);
		}
	};

	return (
		<div
			className={`${isSubtask ? 'ml-8 border-l-2 border-blue-200 pl-4' : ''}`}
		>
			<div
				className={`group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
					task.completed ? 'opacity-75' : ''
				}`}
			>
				<div className='flex items-start gap-3'>
					{/* Expand/Collapse Button for Parent Tasks */}
					{canHaveSubtasks && (
						<button
							onClick={toggleExpanded}
							className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors ${
								hasSubtasks
									? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
									: 'text-gray-300 cursor-default'
							}`}
							disabled={!hasSubtasks}
						>
							{hasSubtasks ? (
								<svg
									className={`w-4 h-4 transition-transform duration-200 ${
										isExpanded ? 'rotate-90' : ''
									}`}
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5l7 7-7 7'
									/>
								</svg>
							) : (
								<div className='w-4 h-4'></div>
							)}
						</button>
					)}

					{/* Checkbox */}
					<button
						onClick={() => onToggleComplete(task.id, !task.completed)}
						className='flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors'
					>
						{task.completed && (
							<svg
								className='w-3 h-3 text-blue-600'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
									clipRule='evenodd'
								/>
							</svg>
						)}
					</button>

					{/* Task Content */}
					<div className='flex-1 min-w-0'>
						<div className='flex items-start justify-between'>
							<div className='flex-1'>
								<h3
									className={`font-medium text-gray-900 ${
										task.completed ? 'line-through text-gray-500' : ''
									}`}
								>
									{task.title}
								</h3>
								{task.description && (
									<p
										className={`text-sm mt-1 ${
											task.completed ? 'text-gray-400' : 'text-gray-600'
										}`}
									>
										{task.description}
									</p>
								)}
							</div>

							{/* Action Buttons */}
							<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
								{canHaveSubtasks && onCreateSubtask && (
									<button
										onClick={() => onCreateSubtask(task)}
										className='p-1 text-gray-400 hover:text-green-600 transition-colors'
										title='Add subtask'
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
												d='M12 4v16m8-8H4'
											/>
										</svg>
									</button>
								)}
								<button
									onClick={() => onEdit(task)}
									className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
									title='Edit task'
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
											d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
										/>
									</svg>
								</button>
								<button
									onClick={() => onDelete(task.id)}
									className='p-1 text-gray-400 hover:text-red-600 transition-colors'
									title='Delete task'
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
											d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Task Metadata */}
						<div className='flex flex-wrap items-center gap-2 mt-3'>
							{/* Priority Badge */}
							{task.priority && task.priority !== 'none' && (
								<span
									className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
										task.priority
									)}`}
								>
									{getPriorityEmoji(task.priority)}{' '}
									{task.priority.charAt(0).toUpperCase() +
										task.priority.slice(1)}
								</span>
							)}

							{/* Due Date Badge */}
							{task.dueDate && dueDateStatus && (
								<span
									className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${dueDateStatus.color}`}
								>
									📅{' '}
									{dueDateStatus.status === 'overdue'
										? 'Overdue'
										: dueDateStatus.status === 'due-today'
										? 'Due Today'
										: new Date(task.dueDate).toLocaleDateString()}
								</span>
							)}

							{/* Project Badge */}
							{project && (
								<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200'>
									📁 {project.name}
								</span>
							)}

							{/* Recurrence Badge */}
							{task.recurrenceRule && (
								<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200'>
									🔄{' '}
									{task.recurrenceRule.type.charAt(0).toUpperCase() +
										task.recurrenceRule.type.slice(1)}
								</span>
							)}

							{/* Subtask Count Badge */}
							{canHaveSubtasks && hasSubtasks && (
								<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200'>
									📋 {subtasks.length} subtask{subtasks.length !== 1 ? 's' : ''}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Subtasks */}
			{canHaveSubtasks && hasSubtasks && isExpanded && (
				<div className='mt-2 space-y-2'>
					{subtasks.map((subtask) => (
						<TaskItem
							key={subtask.id}
							task={subtask}
							projects={projects}
							isSubtask={true}
							onEdit={onEdit}
							onDelete={onDelete}
							onToggleComplete={onToggleComplete}
						/>
					))}
				</div>
			)}
		</div>
	);
}
