export interface ActionItem {
  id: string;
  content: string;
  isCompleted: boolean;
}

export interface SubTask {
  id: string;
  content: string;
  status: TaskStatus;
  subtasks: SubTask[];
  isExpanded: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  description?: string;
  project?: string;
  actionItems?: ActionItem[];
}

export interface Task {
  id: string;
  content: string;
  status: TaskStatus;
  project: string;
  subtasks: SubTask[];
  isExpanded: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  description?: string;
  actionItems?: ActionItem[];
}

export type TaskStatus = 'todo' | 'inProgress' | 'done';

export type ViewMode = 'status' | 'project';