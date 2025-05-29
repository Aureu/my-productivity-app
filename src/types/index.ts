// types/index.ts
export interface RecurrenceRule {
	type: 'daily' | 'weekly' | 'monthly';
	day?: string;
	dayOfMonth?: number;
}

export interface Task {
	id: number;
	title: string;
	description: string;
	dueDate: string | null;
	priority: 'none' | 'low' | 'medium' | 'high';
	projectId: number | null;
	parentId: number | null;
	completed: boolean;
	recurrenceRule: RecurrenceRule | null;
}

export interface Project {
	id: number;
	name: string;
}
