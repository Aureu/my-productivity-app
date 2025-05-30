// lib/firebaseData.js - Firebase Firestore data operations
import {
	collection,
	doc,
	getDocs,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	serverTimestamp,
	Timestamp,
} from 'firebase/firestore';
import { db } from './firebase.js';

// Collection names
const TASKS_COLLECTION = 'tasks';
const PROJECTS_COLLECTION = 'projects';

// ===== TASK OPERATIONS =====

/**
 * Fetch all tasks with optional filtering
 * @param {string} projectId - Optional project ID to filter by
 * @returns {Promise<Array>} Array of tasks
 */
export async function getAllTasks(projectId = null) {
	try {
		const tasksRef = collection(db, TASKS_COLLECTION);
		let q;

		if (projectId) {
			q = query(
				tasksRef,
				where('project_id', '==', projectId),
				orderBy('created_at', 'desc')
			);
		} else {
			q = query(tasksRef, orderBy('created_at', 'desc'));
		}

		const querySnapshot = await getDocs(q);
		const tasks = [];

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			tasks.push({
				id: doc.id,
				title: data.title,
				description: data.description || '',
				dueDate: data.due_date
					? data.due_date.toDate().toISOString().split('T')[0]
					: null,
				priority: data.priority || 'none',
				projectId: data.project_id || null,
				parentId: data.parent_id || null,
				completed: data.completed || false,
				recurrenceRule: data.recurrence_rule || null,
				createdAt: data.created_at ? data.created_at.toDate() : new Date(),
			});
		});

		return tasks;
	} catch (error) {
		console.error('Error fetching tasks:', error);
		throw new Error('Failed to fetch tasks');
	}
}

/**
 * Fetch a single task by ID
 * @param {string} taskId - Task ID
 * @returns {Promise<Object|null>} Task object or null if not found
 */
export async function getTaskById(taskId) {
	try {
		const taskRef = doc(db, TASKS_COLLECTION, taskId);
		const taskSnap = await getDoc(taskRef);

		if (!taskSnap.exists()) {
			return null;
		}

		const data = taskSnap.data();
		return {
			id: taskSnap.id,
			title: data.title,
			description: data.description || '',
			dueDate: data.due_date
				? data.due_date.toDate().toISOString().split('T')[0]
				: null,
			priority: data.priority || 'none',
			projectId: data.project_id || null,
			parentId: data.parent_id || null,
			completed: data.completed || false,
			recurrenceRule: data.recurrence_rule || null,
			createdAt: data.created_at ? data.created_at.toDate() : new Date(),
		};
	} catch (error) {
		console.error('Error fetching task:', error);
		throw new Error('Failed to fetch task');
	}
}

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>} Created task with ID
 */
export async function createTask(taskData) {
	try {
		const taskToCreate = {
			title: taskData.title,
			description: taskData.description || '',
			due_date: taskData.dueDate
				? Timestamp.fromDate(new Date(taskData.dueDate))
				: null,
			priority: taskData.priority || 'none',
			project_id: taskData.projectId || null,
			parent_id: taskData.parentId || null,
			completed: false,
			recurrence_rule: taskData.recurrenceRule || null,
			created_at: serverTimestamp(),
		};

		const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskToCreate);

		// Return the created task with the generated ID
		return {
			id: docRef.id,
			title: taskData.title,
			description: taskData.description || '',
			dueDate: taskData.dueDate || null,
			priority: taskData.priority || 'none',
			projectId: taskData.projectId || null,
			parentId: taskData.parentId || null,
			completed: false,
			recurrenceRule: taskData.recurrenceRule || null,
			createdAt: new Date(),
		};
	} catch (error) {
		console.error('Error creating task:', error);
		throw new Error('Failed to create task');
	}
}

/**
 * Update an existing task
 * @param {string} taskId - Task ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated task or null if not found
 */
export async function updateTask(taskId, updateData) {
	try {
		const taskRef = doc(db, TASKS_COLLECTION, taskId);

		// Check if task exists first
		const taskSnap = await getDoc(taskRef);
		if (!taskSnap.exists()) {
			return null;
		}

		const updatePayload = {};

		if (updateData.title !== undefined) updatePayload.title = updateData.title;
		if (updateData.description !== undefined)
			updatePayload.description = updateData.description;
		if (updateData.dueDate !== undefined) {
			updatePayload.due_date = updateData.dueDate
				? Timestamp.fromDate(new Date(updateData.dueDate))
				: null;
		}
		if (updateData.priority !== undefined)
			updatePayload.priority = updateData.priority;
		if (updateData.projectId !== undefined)
			updatePayload.project_id = updateData.projectId;
		if (updateData.parentId !== undefined)
			updatePayload.parent_id = updateData.parentId;
		if (updateData.completed !== undefined)
			updatePayload.completed = updateData.completed;
		if (updateData.recurrenceRule !== undefined)
			updatePayload.recurrence_rule = updateData.recurrenceRule;

		await updateDoc(taskRef, updatePayload);

		// Fetch and return the updated task
		return await getTaskById(taskId);
	} catch (error) {
		console.error('Error updating task:', error);
		throw new Error('Failed to update task');
	}
}

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise<Object|null>} Deleted task or null if not found
 */
export async function deleteTask(taskId) {
	try {
		const taskRef = doc(db, TASKS_COLLECTION, taskId);

		// Get the task before deleting
		const task = await getTaskById(taskId);
		if (!task) {
			return null;
		}

		await deleteDoc(taskRef);
		return task;
	} catch (error) {
		console.error('Error deleting task:', error);
		throw new Error('Failed to delete task');
	}
}

// ===== PROJECT OPERATIONS =====

/**
 * Fetch all projects with task counts
 * @returns {Promise<Array>} Array of projects with task counts
 */
export async function getAllProjects() {
	try {
		const projectsRef = collection(db, PROJECTS_COLLECTION);
		const q = query(projectsRef, orderBy('created_at', 'desc'));
		const querySnapshot = await getDocs(q);

		const projects = [];

		for (const doc of querySnapshot.docs) {
			const data = doc.data();

			// Get count of active (non-completed) tasks for this project
			const tasksRef = collection(db, TASKS_COLLECTION);
			const tasksQuery = query(
				tasksRef,
				where('project_id', '==', doc.id),
				where('completed', '==', false)
			);
			const tasksSnapshot = await getDocs(tasksQuery);
			const activeTaskCount = tasksSnapshot.size;

			projects.push({
				id: doc.id,
				name: data.name,
				createdAt: data.created_at ? data.created_at.toDate() : new Date(),
				activeTaskCount,
			});
		}

		return projects;
	} catch (error) {
		console.error('Error fetching projects:', error);
		throw new Error('Failed to fetch projects');
	}
}

/**
 * Fetch a single project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object|null>} Project object or null if not found
 */
export async function getProjectById(projectId) {
	try {
		const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
		const projectSnap = await getDoc(projectRef);

		if (!projectSnap.exists()) {
			return null;
		}

		const data = projectSnap.data();
		return {
			id: projectSnap.id,
			name: data.name,
			createdAt: data.created_at ? data.created_at.toDate() : new Date(),
		};
	} catch (error) {
		console.error('Error fetching project:', error);
		throw new Error('Failed to fetch project');
	}
}

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} Created project with ID
 */
export async function createProject(projectData) {
	try {
		const projectToCreate = {
			name: projectData.name,
			created_at: serverTimestamp(),
		};

		const docRef = await addDoc(
			collection(db, PROJECTS_COLLECTION),
			projectToCreate
		);

		return {
			id: docRef.id,
			name: projectData.name,
			createdAt: new Date(),
			activeTaskCount: 0,
		};
	} catch (error) {
		console.error('Error creating project:', error);
		throw new Error('Failed to create project');
	}
}

/**
 * Update an existing project
 * @param {string} projectId - Project ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated project or null if not found
 */
export async function updateProject(projectId, updateData) {
	try {
		const projectRef = doc(db, PROJECTS_COLLECTION, projectId);

		// Check if project exists first
		const projectSnap = await getDoc(projectRef);
		if (!projectSnap.exists()) {
			return null;
		}

		const updatePayload = {};
		if (updateData.name !== undefined) updatePayload.name = updateData.name;

		await updateDoc(projectRef, updatePayload);

		// Fetch and return the updated project
		return await getProjectById(projectId);
	} catch (error) {
		console.error('Error updating project:', error);
		throw new Error('Failed to update project');
	}
}

/**
 * Delete a project and optionally handle associated tasks
 * @param {string} projectId - Project ID
 * @param {boolean} deleteAssociatedTasks - Whether to delete associated tasks (default: false, sets project_id to null)
 * @returns {Promise<Object|null>} Deleted project or null if not found
 */
export async function deleteProject(projectId, deleteAssociatedTasks = false) {
	try {
		const projectRef = doc(db, PROJECTS_COLLECTION, projectId);

		// Get the project before deleting
		const project = await getProjectById(projectId);
		if (!project) {
			return null;
		}

		// Handle associated tasks
		const tasksRef = collection(db, TASKS_COLLECTION);
		const tasksQuery = query(tasksRef, where('project_id', '==', projectId));
		const tasksSnapshot = await getDocs(tasksQuery);

		if (deleteAssociatedTasks) {
			// Delete all associated tasks
			const deletePromises = tasksSnapshot.docs.map((taskDoc) =>
				deleteDoc(taskDoc.ref)
			);
			await Promise.all(deletePromises);
		} else {
			// Set project_id to null for all associated tasks
			const updatePromises = tasksSnapshot.docs.map((taskDoc) =>
				updateDoc(taskDoc.ref, { project_id: null })
			);
			await Promise.all(updatePromises);
		}

		// Delete the project
		await deleteDoc(projectRef);
		return project;
	} catch (error) {
		console.error('Error deleting project:', error);
		throw new Error('Failed to delete project');
	}
}
