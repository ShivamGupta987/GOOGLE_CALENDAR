
import React, { useState, useEffect } from 'react';
import { Goal, Task } from '@/lib/types';
import GoalItem from './GoalItem';
import TaskItem from './TaskItem';

interface SidebarProps {
  goals: Goal[];
  tasks: Task[];
  onTaskDragStart: (task: Task) => void;
  selectedGoalId: string | null;
  onGoalSelect: (goal: Goal | null) => void;
}

const Sidebar = ({ 
  goals, 
  tasks, 
  onTaskDragStart, 
  selectedGoalId,
  onGoalSelect 
}: SidebarProps) => {
  
  const handleGoalClick = (goal: Goal) => {
    onGoalSelect(selectedGoalId === goal.id ? null : goal);
  };
  
  const filteredTasks = selectedGoalId 
    ? tasks.filter(task => task.goalId === selectedGoalId)
    : tasks;
  
  const getGoalColor = (goalId: string): string => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.color : '#000000';
  };

  return (
    <div className="w-64 border-r h-full overflow-y-auto bg-gray-50 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800 mb-3">GOALS</h2>
        <div className="space-y-1">
          {goals.map(goal => (
            <GoalItem 
              key={goal.id} 
              goal={goal} 
              isSelected={selectedGoalId === goal.id}
              onClick={() => handleGoalClick(goal)}
            />
          ))}
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <h2 className="text-lg font-bold text-gray-800 mb-3">TASKS</h2>
        <div className="space-y-1">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              goalColor={getGoalColor(task.goalId)}
              onDragStart={onTaskDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
