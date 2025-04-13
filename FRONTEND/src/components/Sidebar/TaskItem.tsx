
import React from 'react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  goalColor: string;
  onDragStart: (task: Task) => void;
}

const TaskItem = ({ task, goalColor, onDragStart }: TaskItemProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    onDragStart(task);
  };

  return (
    <div 
      className={cn(
        "flex items-center p-2 rounded-md cursor-pointer border mb-1",
        "hover:bg-gray-50 transition-colors"
      )}
      draggable
      onDragStart={handleDragStart}
    >
      <div 
        className="w-4 h-4 rounded-full mr-3" 
        style={{ backgroundColor: goalColor }}
      />
      <span className="text-sm font-medium">{task.title}</span>
    </div>
  );
};

export default TaskItem;
