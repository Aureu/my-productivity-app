import React from 'react';
import { Task, Project } from '../types';

interface TaskItemProps {
	task: Task;
	projects: Project[];
	isSubtask?: boolean;
	onEdit: (task: Task) => void;
	onDelete: (taskId: number) => void;
	onToggleComplete: (taskId: number, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
	task,
	projects,
	isSubtask = false,
	onEdit,
	onDelete,
	onToggleComplete,
}) => {
	const project = projects.find((p) => p.id === task.projectId);

	const getPriorityConfig = (priority: string) => {
		switch (priority) {
			case 'high':
				return {
					color: 'bg-red-100 text-red-800 border-red-200',
					icon: '🔴',
					label: 'High Priority',
				};
			case 'medium':
				return {
					color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
					icon: '🟡',
					label: 'Medium Priority',
				};
			case 'low':
				return {
					color: 'bg-green-100 text-green-800 border-green-200',
					icon: '🟢',
					label: 'Low Priority',
				};
			default:
				return null;
		}
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const isOverdue = (dueDate: string | null) => {
		if (!dueDate) return false;
		const today = new Date();
		const due = new Date(dueDate);
		return due < today && !task.completed;
	};

	const isDueToday = (dueDate: string | null) => {
		if (!dueDate) return false;
		const today = new Date();
		const due = new Date(dueDate);
		return due.toDateString() === today.toDateString();
	};

	const priorityConfig = getPriorityConfig(task.priority);

	return (
		<div
			className={`group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
				isSubtask ? 'ml-6 border-l-4 border-l-blue-200 bg-blue-50/30' : ''
			} ${task.completed ? 'opacity-75' : ''}`}
		>
			<div className='flex items-start gap-3'>
				{/* Checkbox */}
				<div className='flex-shrink-0 mt-1'>
					<input
						type='checkbox'
						checked={task.completed}
						onChange={(e) => onToggleComplete(task.id, e.target.checked)}
						className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer'
					/>
				</div>

				{/* Main Content */}
				<div className='flex-1 min-w-0'>
					{/* Title and Actions */}
					<div className='flex items-start justify-between gap-3 mb-2'>
						<h3
							className={`text-lg font-medium ${
								task.completed ? 'line-through text-gray-500' : 'text-gray-900'
							}`}
						>
							{task.title}
						</h3>

						{/* Action Buttons */}
						<div className='flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
							<button
								onClick={() => onEdit(task)}
								className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200'
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
								className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200'
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

					{/* Description */}
					{task.description && (
						<p
							className={`text-sm mb-3 ${
								task.completed ? 'text-gray-400' : 'text-gray-600'
							}`}
						>
							{task.description}
						</p>
					)}

					{/* Badges and Metadata */}
					<div className='flex flex-wrap items-center gap-2'>
						{/* Priority Badge */}
						{priorityConfig && (
							<span
								className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${priorityConfig.color}`}
							>
								<span className='text-xs'>{priorityConfig.icon}</span>
								{priorityConfig.label}
							</span>
						)}

						{/* Due Date Badge */}
						{task.dueDate && (
							<span
								className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
									isOverdue(task.dueDate)
										? 'bg-red-100 text-red-800 border-red-200'
										: isDueToday(task.dueDate)
										? 'bg-orange-100 text-orange-800 border-orange-200'
										: 'bg-gray-100 text-gray-700 border-gray-200'
								}`}
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
										d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
									/>
								</svg>
								{isOverdue(task.dueDate) && 'Overdue: '}
								{isDueToday(task.dueDate) && 'Due Today: '}
								{formatDate(task.dueDate)}
							</span>
						)}

						{/* Project Badge */}
						{project && (
							<span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200'>
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
						)}

						{/* Recurrence Badge */}
						{task.recurrenceRule && (
							<span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200'>
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
										d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
									/>
								</svg>
								{task.recurrenceRule.type.charAt(0).toUpperCase() +
									task.recurrenceRule.type.slice(1)}
								{task.recurrenceRule.day && ` (${task.recurrenceRule.day})`}
								{task.recurrenceRule.dayOfMonth &&
									` (${task.recurrenceRule.dayOfMonth})`}
							</span>
						)}

						{/* Subtask Indicator */}
						{isSubtask && (
							<span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200'>
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
										d='M9 5l7 7-7 7'
									/>
								</svg>
								Subtask
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskItem;
