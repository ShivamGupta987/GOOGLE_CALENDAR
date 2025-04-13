
export type Category = 'exercise' | 'eating' | 'work' | 'relax' | 'family' | 'social';

export interface Event {
  id: string;
  title: string;
  category: Category;
  startTime: string; // ISO string
  endTime: string; // ISO string
  taskId?: string; // Optional reference to a task
  color?: string; // Color for task-related events
}

export interface Task {
  id: string;
  title: string;
  goalId: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  color: string;
}

export type TimeSlot = {
  hour: number;
  minute: number;
};
