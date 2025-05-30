// types/index.ts
export interface RecurrenceRule {
	type: 'daily' | 'weekly' | 'monthly';
	day?: string;
	dayOfMonth?: number;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	dueDate: string | null;
	priority: 'none' | 'low' | 'medium' | 'high';
	projectId: string | null;
	parentId: string | null;
	completed: boolean;
	recurrenceRule: RecurrenceRule | null;
}

export interface Project {
	id: string;
	name: string;
	activeTaskCount?: number;
}
