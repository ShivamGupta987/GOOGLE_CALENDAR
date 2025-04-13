
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CalendarGrid from '@/components/Calendar/CalendarGrid';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Event, Task, Goal } from '@/lib/types';
import EventModal from '@/components/Calendar/EventModal';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchEvents, 
  fetchGoals, 
  fetchTasks, 
  createEvent as apiCreateEvent, 
  updateEvent as apiUpdateEvent, 
  deleteEvent as apiDeleteEvent 
} from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data using React Query
  const { 
    data: events = [], 
    isLoading: isEventsLoading,
    error: eventsError
  } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const { 
    data: goals = [], 
    isLoading: isGoalsLoading,
    error: goalsError
  } = useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals
  });

  const { 
    data: tasks = [], 
    isLoading: isTasksLoading,
    error: tasksError
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });

  // Show error toasts if any fetch fails
  useEffect(() => {
    if (eventsError) {
      toast({
        title: "Error fetching events",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
    if (goalsError) {
      toast({
        title: "Error fetching goals",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
    if (tasksError) {
      toast({
        title: "Error fetching tasks",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
  }, [eventsError, goalsError, tasksError, toast]);

  // Event mutations
  const createEventMutation = useMutation({
    mutationFn: (eventData: Omit<Event, 'id'>) => apiCreateEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast({
        title: "Error Creating Event",
        description: "There was an error creating the event. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: (event: Event) => apiUpdateEvent(event.id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast({
        title: "Error Updating Event",
        description: "There was an error updating the event. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => apiDeleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast({
        title: "Error Deleting Event",
        description: "There was an error deleting the event. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle event creation
  const handleEventCreate = (eventData: Omit<Event, 'id'>) => {
    createEventMutation.mutate(eventData, {
      onSuccess: (data) => {
        toast({
          title: "Event Created",
          description: `${data.title} has been added to your calendar.`,
        });
      }
    });
  };
  
  // Handle event update
  const handleEventUpdate = (updatedEvent: Event) => {
    updateEventMutation.mutate(updatedEvent, {
      onSuccess: (data) => {
        toast({
          title: "Event Updated",
          description: `${data.title} has been updated.`,
        });
      }
    });
  };
  
  // Handle event deletion
  const handleEventDelete = (eventId: string) => {
    const eventToDelete = events.find(event => event.id === eventId);
    deleteEventMutation.mutate(eventId, {
      onSuccess: () => {
        toast({
          title: "Event Deleted",
          description: eventToDelete ? `${eventToDelete.title} has been deleted.` : "Event has been deleted.",
          variant: "destructive",
        });
      }
    });
  };
  
  // Handle task drag start
  const handleTaskDragStart = (task: Task) => {
    setDraggedTask(task);
  };
  
  // Handle goal selection
  const handleGoalSelect = (goal: Goal | null) => {
    setActiveGoal(goal);
  };
  
  // Handle drop on calendar
  const handleCalendarDrop = (e: React.DragEvent, day: Date, hour: number) => {
    e.preventDefault();
    
    if (!draggedTask) return;
    
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    // Create start and end times for the event
    const startTime = new Date(day);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(hour + 1, 0, 0, 0);
    
    setSelectedTimeSlot({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });
    
    setIsTaskModalOpen(true);
  };
  
  // Handle creating event from task
  const handleCreateEventFromTask = (eventData: Omit<Event, 'id'>) => {
    if (!draggedTask) return;
    
    const eventWithTask = {
      ...eventData,
      title: eventData.title || draggedTask.title,
      taskId: draggedTask.id,
    };
    
    createEventMutation.mutate(eventWithTask, {
      onSuccess: (data) => {
        setDraggedTask(null);
        setIsTaskModalOpen(false);
        toast({
          title: "Task Added to Calendar",
          description: `${data.title} has been added to your calendar.`,
        });
      }
    });
  };

  // Show loading state
  if (isEventsLoading || isGoalsLoading || isTasksLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-xl font-semibold">Loading calendar data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        goals={goals} 
        tasks={tasks} 
        onTaskDragStart={handleTaskDragStart}
        selectedGoalId={activeGoal?.id || null}
        onGoalSelect={handleGoalSelect}
      />
      
      {/* Calendar */}
      <div className="flex-1 overflow-hidden">
        <CalendarGrid 
          events={events}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onCalendarDrop={handleCalendarDrop}
        />
      </div>
      
      {/* Task to Event Modal */}
      <EventModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setDraggedTask(null);
        }}
        onSave={handleCreateEventFromTask}
        selectedTime={selectedTimeSlot || undefined}
        initialTitle={draggedTask?.title}
        initialCategory={activeGoal && goals.find(g => g.id === draggedTask?.goalId)?.title.toLowerCase() as any}
      />
    </div>
  );
};

export default Index;
