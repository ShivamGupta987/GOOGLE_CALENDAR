
import { Event, Goal, Task } from './types';

const API_URL = 'http://localhost:5000/api';

// Event API calls
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    // Transform backend data to match frontend Event type
    return data.map((event: any) => ({
      id: event._id,
      title: event.title,
      category: event.category,
      startTime: event.startTime,
      endTime: event.endTime,
      taskId: event.taskId || undefined,
      color: event.color || undefined
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return {
      id: data._id,
      title: data.title,
      category: data.category,
      startTime: data.startTime,
      endTime: data.endTime,
      taskId: data.taskId || undefined,
      color: data.color || undefined
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event> => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return {
      id: data._id,
      title: data.title,
      category: data.category,
      startTime: data.startTime,
      endTime: data.endTime,
      taskId: data.taskId || undefined,
      color: data.color || undefined
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Goal API calls
export const fetchGoals = async (): Promise<Goal[]> => {
  try {
    const response = await fetch(`${API_URL}/goals`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return data.map((goal: any) => ({
      id: goal._id,
      title: goal.title,
      color: goal.color
    }));
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

// Task API calls
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return data.map((task: any) => ({
      id: task._id,
      title: task.title,
      goalId: task.goalId,
      completed: task.completed
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchTasksByGoal = async (goalId: string): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks/goal/${goalId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return data.map((task: any) => ({
      id: task._id,
      title: task.title,
      goalId: task.goalId,
      completed: task.completed
    }));
  } catch (error) {
    console.error('Error fetching tasks by goal:', error);
    throw error;
  }
};
