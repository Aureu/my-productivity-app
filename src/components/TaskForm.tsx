import React, { useState, useEffect } from 'react';
import { Task, Project } from '../types';

interface TaskFormProps {
	task?: Task | null;
	projects: Project[];
	tasks: Task[];
	onSubmit: (taskData: Partial<Task>) => void;
	onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
	task,
	projects,
	tasks,
	onSubmit,
	onCancel,
}) => {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		dueDate: '',
		priority: 'none' as 'none' | 'low' | 'medium' | 'high',
		projectId: null as number | null,
		parentId: null as number | null,
		recurrenceType: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
		recurrenceDay: '',
		recurrenceDayOfMonth: 1,
	});

	useEffect(() => {
		if (task) {
			setFormData({
				title: task.title,
				description: task.description,
				dueDate: task.dueDate || '',
				priority: task.priority,
				projectId: task.projectId,
				parentId: task.parentId,
				recurrenceType: task.recurrenceRule?.type || 'none',
				recurrenceDay: task.recurrenceRule?.day || '',
				recurrenceDayOfMonth: task.recurrenceRule?.dayOfMonth || 1,
			});
		}
	}, [task]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const recurrenceRule =
			formData.recurrenceType !== 'none'
				? {
						type: formData.recurrenceType,
						...(formData.recurrenceType === 'weekly' &&
							formData.recurrenceDay && { day: formData.recurrenceDay }),
						...(formData.recurrenceType === 'monthly' && {
							dayOfMonth: formData.recurrenceDayOfMonth,
						}),
				  }
				: null;

		const taskData = {
			title: formData.title,
			description: formData.description,
			dueDate: formData.dueDate || null,
			priority: formData.priority,
			projectId: formData.projectId,
			parentId: formData.parentId,
			recurrenceRule,
		};

		onSubmit(taskData);
	};

	const handleChange = (field: string, value: string | number | null) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Filter tasks to show only main tasks (not subtasks) for parent selection
	const mainTasks = tasks.filter(
		(t) => !t.parentId && (!task || t.id !== task.id)
	);

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden'>
				{/* Header */}
				<div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
					<div className='flex items-center justify-between'>
						<div>
							<h2 className='text-xl font-semibold text-gray-900'>
								{task ? 'Edit Task' : 'Create New Task'}
							</h2>
							<p className='text-sm text-gray-600 mt-1'>
								{task
									? 'Update your task details'
									: 'Add a new task to your list'}
							</p>
						</div>
						<button
							onClick={onCancel}
							className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200'
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
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Form Content */}
				<div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Title */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Task Title *
							</label>
							<input
								type='text'
								value={formData.title}
								onChange={(e) => handleChange('title', e.target.value)}
								required
								placeholder='Enter task title...'
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>

						{/* Description */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) => handleChange('description', e.target.value)}
								rows={3}
								placeholder='Add a description for your task...'
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical'
							/>
						</div>

						{/* Due Date and Priority */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Due Date
								</label>
								<input
									type='date'
									value={formData.dueDate}
									onChange={(e) => handleChange('dueDate', e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Priority
								</label>
								<select
									value={formData.priority}
									onChange={(e) => handleChange('priority', e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								>
									<option value='none'>No Priority</option>
									<option value='low'>🟢 Low Priority</option>
									<option value='medium'>🟡 Medium Priority</option>
									<option value='high'>🔴 High Priority</option>
								</select>
							</div>
						</div>

						{/* Project and Parent Task */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Project
								</label>
								<select
									value={formData.projectId || ''}
									onChange={(e) =>
										handleChange(
											'projectId',
											e.target.value ? parseInt(e.target.value) : null
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								>
									<option value=''>No Project</option>
									{projects.map((project) => (
										<option key={project.id} value={project.id}>
											{project.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Parent Task (Make this a subtask)
								</label>
								<select
									value={formData.parentId || ''}
									onChange={(e) =>
										handleChange(
											'parentId',
											e.target.value ? parseInt(e.target.value) : null
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								>
									<option value=''>No Parent Task</option>
									{mainTasks.map((mainTask) => (
										<option key={mainTask.id} value={mainTask.id}>
											{mainTask.title}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Recurrence */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Recurrence
							</label>
							<div className='space-y-3'>
								<select
									value={formData.recurrenceType}
									onChange={(e) =>
										handleChange('recurrenceType', e.target.value)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								>
									<option value='none'>No Recurrence</option>
									<option value='daily'>🔄 Daily</option>
									<option value='weekly'>📅 Weekly</option>
									<option value='monthly'>📆 Monthly</option>
								</select>

								{formData.recurrenceType === 'weekly' && (
									<select
										value={formData.recurrenceDay}
										onChange={(e) =>
											handleChange('recurrenceDay', e.target.value)
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
									>
										<option value=''>Select Day of Week</option>
										<option value='Monday'>Monday</option>
										<option value='Tuesday'>Tuesday</option>
										<option value='Wednesday'>Wednesday</option>
										<option value='Thursday'>Thursday</option>
										<option value='Friday'>Friday</option>
										<option value='Saturday'>Saturday</option>
										<option value='Sunday'>Sunday</option>
									</select>
								)}

								{formData.recurrenceType === 'monthly' && (
									<input
										type='number'
										min='1'
										max='31'
										value={formData.recurrenceDayOfMonth}
										onChange={(e) =>
											handleChange(
												'recurrenceDayOfMonth',
												parseInt(e.target.value)
											)
										}
										placeholder='Day of month (1-31)'
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
									/>
								)}
							</div>
						</div>
					</form>
				</div>

				{/* Footer */}
				<div className='px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3'>
					<button
						type='button'
						onClick={onCancel}
						className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200'
					>
						Cancel
					</button>
					<button
						type='submit'
						onClick={handleSubmit}
						disabled={!formData.title.trim()}
						className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
					>
						{task ? 'Update Task' : 'Create Task'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default TaskForm;
