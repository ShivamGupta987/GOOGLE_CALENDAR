import React, { useState, useCallback } from 'react';
import { format, addDays, startOfWeek, getHours, getMinutes, parseISO, isSameDay, setHours, setMinutes } from 'date-fns';
import { Event as EventType, TimeSlot } from '@/lib/types';
import Event from './Event';
import EventModal from './EventModal';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarGridProps {
  events: EventType[];
  onEventCreate: (event: Omit<EventType, 'id'>) => void;
  onEventUpdate: (event: EventType) => void;
  onEventDelete: (id: string) => void;
  onCalendarDrop?: (e: React.DragEvent, day: Date, hour: number) => void;
}

const CalendarGrid = ({ 
  events, 
  onEventCreate, 
  onEventUpdate, 
  onEventDelete,
  onCalendarDrop 
}: CalendarGridProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  
  // Generate days of the week based on current date
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  // Generate time slots for the day (7 AM to 7 PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => ({ hour: i + 7, minute: 0 }));
  
  // Helper to check if an event belongs to the given day and time
  const eventBelongsToTimeSlot = (event: EventType, day: Date, timeSlot: TimeSlot) => {
    // Validate event start and end times
    if (!event.startTime || !event.endTime) {
      return false;
    }
    
    try {
      const eventStart = parseISO(event.startTime);
      const eventEnd = parseISO(event.endTime);
      
      // Check if the event is on this day
      if (!isSameDay(eventStart, day)) return false;
      
      // Check if the event starts at or before this time slot and ends after this time slot
      const startHour = getHours(eventStart);
      const endHour = getHours(eventEnd);
      
      return (
        (startHour === timeSlot.hour && getMinutes(eventStart) === timeSlot.minute) ||
        (startHour < timeSlot.hour && endHour > timeSlot.hour) ||
        (startHour === timeSlot.hour && getMinutes(eventStart) < timeSlot.minute)
      );
    } catch (error) {
      console.error('Error parsing event dates:', error, event);
      return false;
    }
  };
  
  // Get events for a specific day and time slot
  const getEventsForSlot = (day: Date, timeSlot: TimeSlot) => {
    return events.filter(event => eventBelongsToTimeSlot(event, day, timeSlot));
  };
  
  // Handle event click
  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    setSelectedTimeSlot(null);
    setIsModalOpen(true);
  };
  
  // Handle time slot click
  const handleTimeSlotClick = (day: Date, timeSlot: TimeSlot) => {
    const startDate = setMinutes(setHours(day, timeSlot.hour), timeSlot.minute);
    const endDate = setMinutes(setHours(day, timeSlot.hour + 1), timeSlot.minute);
    
    setSelectedTimeSlot({
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };
  
  // Handle drag over for time slots
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  }, []);
  
  // Handle drop on time slot
  const handleDrop = useCallback((e: React.DragEvent, day: Date, timeSlot: TimeSlot) => {
    if (onCalendarDrop) {
      onCalendarDrop(e, day, timeSlot.hour);
    }
  }, [onCalendarDrop]);
  
  // Handle event creation
  const handleSaveEvent = (eventData: Omit<EventType, 'id'>) => {
    if (selectedEvent) {
      // Update existing event
      onEventUpdate({
        ...selectedEvent,
        ...eventData,
      });
    } else {
      // Create new event
      onEventCreate(eventData);
    }
    setIsModalOpen(false);
  };
  
  // Handle event deletion
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      onEventDelete(selectedEvent.id);
      setSelectedEvent(null);
      setIsModalOpen(false);
    }
  };
  
  // Navigation handlers
  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button variant="outline" onClick={goToToday}>Today</Button>
          <Button variant="ghost" onClick={goToPreviousWeek} className="ml-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={goToNextWeek}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h2 className="ml-4 text-xl font-semibold">
            {format(startOfCurrentWeek, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex">
          <Button variant="outline" className="mr-2">Day</Button>
          <Button variant="secondary" className="mr-2">Week</Button>
          <Button variant="outline" className="mr-2">Month</Button>
          <Button variant="outline">Year</Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 h-full">
          {/* Time column */}
          <div className="border-r">
            <div className="sticky top-0 h-12 bg-white z-10"></div>
            {timeSlots.map((timeSlot, index) => (
              <div 
                key={`time-${timeSlot.hour}`}
                className="h-16 border-t flex items-center justify-end pr-2 text-sm text-gray-500"
              >
                {format(new Date().setHours(timeSlot.hour, 0, 0, 0), 'h a')}
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {daysOfWeek.map((day, dayIndex) => (
            <div key={format(day, 'yyyy-MM-dd')} className="border-r">
              {/* Day header */}
              <div className={cn(
                "sticky top-0 h-12 flex flex-col items-center justify-center border-b",
                "bg-white z-10",
                isSameDay(day, new Date()) && "bg-blue-50"
              )}>
                <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 mt-1 rounded-full",
                  isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-gray-800"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
              
              {/* Time slots for the day */}
              {timeSlots.map((timeSlot) => {
                const eventsForSlot = getEventsForSlot(day, timeSlot);
                
                return (
                  <div 
                    key={`${day}-${timeSlot.hour}`}
                    className={cn(
                      "h-16 border-t relative",
                      isSameDay(day, new Date()) && "bg-blue-50"
                    )}
                    onClick={() => handleTimeSlotClick(day, timeSlot)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, timeSlot)}
                  >
                    {/* Events in this slot */}
                    {eventsForSlot.map((event) => (
                      <div
                        key={event.id}
                        className="absolute inset-x-1 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <Event event={event} onClick={() => handleEventClick(event)} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        initialEvent={selectedEvent || undefined}
        selectedTime={selectedTimeSlot || undefined}
      />
    </div>
  );
};

export default CalendarGrid;
