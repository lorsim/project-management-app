export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  taskCount: number;
  completedTasks: number;
  dueDate?: string | null;
}
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeEmail: string;
  dueDate?: string | null;
}
