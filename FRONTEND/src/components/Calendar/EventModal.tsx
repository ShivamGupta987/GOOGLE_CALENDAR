
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Event } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  onDelete?: () => void;
  initialEvent?: Event;
  selectedTime?: { startTime: string; endTime: string };
  initialTitle?: string;
  initialCategory?: Category;
}

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialEvent,
  selectedTime,
  initialTitle = '',
  initialCategory,
}: EventModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setCategory(initialEvent.category);
      setStartTime(initialEvent.startTime);
      setEndTime(initialEvent.endTime);
      setFormattedStartDate(format(parseISO(initialEvent.startTime), 'yyyy-MM-dd\'T\'HH:mm'));
      setFormattedEndDate(format(parseISO(initialEvent.endTime), 'yyyy-MM-dd\'T\'HH:mm'));
    } else if (selectedTime) {
      setStartTime(selectedTime.startTime);
      setEndTime(selectedTime.endTime);
      setFormattedStartDate(format(parseISO(selectedTime.startTime), 'yyyy-MM-dd\'T\'HH:mm'));
      setFormattedEndDate(format(parseISO(selectedTime.endTime), 'yyyy-MM-dd\'T\'HH:mm'));
      
      // Set initial title and category if provided (for task drag & drop)
      if (initialTitle) setTitle(initialTitle);
      if (initialCategory) setCategory(initialCategory);
    }
  }, [initialEvent, selectedTime, isOpen, initialTitle, initialCategory]);

  const handleSave = () => {
    const eventData = {
      title,
      category,
      startTime,
      endTime,
      taskId: initialEvent?.taskId
    };
    
    onSave(eventData);
    resetForm();
  };

  const resetForm = () => {
    if (!initialEvent) {
      setTitle('');
      setCategory('work');
      setStartTime('');
      setEndTime('');
      setFormattedStartDate('');
      setFormattedEndDate('');
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormattedStartDate(e.target.value);
    try {
      const date = new Date(e.target.value);
      setStartTime(date.toISOString());
    } catch (err) {
      console.error('Invalid date format');
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormattedEndDate(e.target.value);
    try {
      const date = new Date(e.target.value);
      setEndTime(date.toISOString());
    } catch (err) {
      console.error('Invalid date format');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialEvent ? 'Edit Event' : initialTitle ? 'Schedule Task' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Title</span>
            </div>
            <Input 
              placeholder="Event title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Category</span>
            </div>
            <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="eating">Eating</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="relax">Relax</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Start Time</span>
            </div>
            <Input 
              type="datetime-local" 
              value={formattedStartDate}
              onChange={handleStartDateChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">End Time</span>
            </div>
            <Input 
              type="datetime-local" 
              value={formattedEndDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {initialEvent && onDelete && (
              <Button variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {initialEvent ? 'Update' : initialTitle ? 'Schedule' : 'Create'} Event
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
