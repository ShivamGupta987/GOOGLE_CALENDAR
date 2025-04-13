
import { Category, Event, Goal, Task } from "./types";
import { addDays, format, addHours, setHours, setMinutes } from "date-fns";

const today = new Date();
const tomorrow = addDays(today, 1);
const dayAfterTomorrow = addDays(today, 2);

// Helper functions to create date strings
const formatDateWithTime = (date: Date, hours: number, minutes: number = 0): string => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate.toISOString();
};

// Mock goals
export const mockGoals: Goal[] = [
  { id: "goal-1", title: "Be fit", color: "#FF5733" },
  { id: "goal-2", title: "Academics", color: "#3357FF" },
  { id: "goal-3", title: "LEARN", color: "#A233FF" },
  { id: "goal-4", title: "Sports", color: "#33FF57" }
];

// Mock tasks
export const mockTasks: Task[] = [
  { id: "task-1", title: "Morning Run", goalId: "goal-1", completed: false },
  { id: "task-2", title: "Study React", goalId: "goal-2", completed: false },
  { id: "task-3", title: "AI based agents", goalId: "goal-3", completed: false },
  { id: "task-4", title: "MLE", goalId: "goal-3", completed: false },
  { id: "task-5", title: "DE related", goalId: "goal-3", completed: false },
  { id: "task-6", title: "Basics", goalId: "goal-3", completed: false }
];

// Mock events
export const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Morning Wake-Up Hour",
    category: "exercise" as Category,
    startTime: formatDateWithTime(today, 8, 0),
    endTime: formatDateWithTime(today, 9, 0)
  },
  {
    id: "event-2",
    title: "All-Team Kickoff",
    category: "work" as Category,
    startTime: formatDateWithTime(today, 9, 0),
    endTime: formatDateWithTime(today, 9, 30)
  },
  {
    id: "event-3",
    title: "Financial Update",
    category: "work" as Category,
    startTime: formatDateWithTime(today, 10, 0),
    endTime: formatDateWithTime(today, 10, 30)
  },
  {
    id: "event-4",
    title: "New Employee Welcome Lunch",
    category: "social" as Category,
    startTime: formatDateWithTime(today, 11, 0),
    endTime: formatDateWithTime(today, 12, 0)
  },
  {
    id: "event-5",
    title: "Design System Kickoff Lunch",
    category: "work" as Category,
    startTime: formatDateWithTime(today, 12, 0),
    endTime: formatDateWithTime(today, 13, 0)
  },
  {
    id: "event-6",
    title: "Design Review",
    category: "work" as Category,
    startTime: formatDateWithTime(today, 13, 0),
    endTime: formatDateWithTime(today, 14, 0)
  },
  {
    id: "event-7",
    title: "1:1 with Jon",
    category: "work" as Category,
    startTime: formatDateWithTime(today, 14, 0),
    endTime: formatDateWithTime(today, 15, 0)
  },
  {
    id: "event-8",
    title: "Design Team Happy Hour",
    category: "social" as Category,
    startTime: formatDateWithTime(today, 16, 0),
    endTime: formatDateWithTime(today, 17, 0)
  },
  {
    id: "event-9",
    title: "Design Review: Figma Marketing",
    category: "work" as Category,
    startTime: formatDateWithTime(tomorrow, 9, 0),
    endTime: formatDateWithTime(tomorrow, 10, 0)
  },
  {
    id: "event-10",
    title: "Webinar: Product Marketing",
    category: "work" as Category,
    startTime: formatDateWithTime(tomorrow, 9, 0),
    endTime: formatDateWithTime(tomorrow, 9, 30)
  },
  {
    id: "event-11",
    title: "Coffee Chat",
    category: "social" as Category,
    startTime: formatDateWithTime(tomorrow, 9, 0),
    endTime: formatDateWithTime(tomorrow, 9, 30)
  },
  {
    id: "event-12",
    title: "Health Benefits Walkthrough",
    category: "relax" as Category,
    startTime: formatDateWithTime(tomorrow, 10, 0),
    endTime: formatDateWithTime(tomorrow, 11, 0)
  },
  {
    id: "event-13",
    title: "Onboarding Presentation",
    category: "work" as Category,
    startTime: formatDateWithTime(tomorrow, 11, 0),
    endTime: formatDateWithTime(tomorrow, 12, 0)
  },
  {
    id: "event-14",
    title: "Marketing Meet-up",
    category: "work" as Category,
    startTime: formatDateWithTime(tomorrow, 12, 0),
    endTime: formatDateWithTime(tomorrow, 13, 0)
  },
  {
    id: "event-15",
    title: "MVP Prioritization Workshop",
    category: "work" as Category,
    startTime: formatDateWithTime(tomorrow, 13, 0),
    endTime: formatDateWithTime(tomorrow, 14, 0)
  },
  {
    id: "event-16",
    title: "Design Review",
    category: "work" as Category,
    startTime: formatDateWithTime(tomorrow, 13, 0),
    endTime: formatDateWithTime(tomorrow, 14, 0)
  },
  {
    id: "event-17",
    title: "1:1 with Hannah",
    category: "work" as Category,
    startTime: formatDateWithTime(tomorrow, 14, 0),
    endTime: formatDateWithTime(tomorrow, 15, 0)
  },
  {
    id: "event-18",
    title: "Happy Hour",
    category: "social" as Category,
    startTime: formatDateWithTime(tomorrow, 16, 0),
    endTime: formatDateWithTime(tomorrow, 17, 0)
  },
  {
    id: "event-19",
    title: "Coffee Catchup",
    category: "social" as Category,
    startTime: formatDateWithTime(dayAfterTomorrow, 9, 0),
    endTime: formatDateWithTime(dayAfterTomorrow, 9, 30)
  }
];
