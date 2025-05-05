
import React from 'react';
import { Task } from '@/types';
import TaskItem from './TaskItem';

interface TimeBlockProps {
  timeLabel: string;
  tasks: Task[];
  onMarkDone: (taskId: string) => void;
  onMarkNotDone: (taskId: string) => void;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ timeLabel, tasks, onMarkDone, onMarkNotDone }) => {
  return (
    <div className="mb-6 relative">
      {/* Time block label with marker */}
      <div className="flex items-center mb-2">
        {/* Smaller time marker positioned inline */}
        <div className="w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-primary flex items-center justify-center shadow-sm mr-2">
          <div className="w-1 h-1 bg-primary rounded-full"></div>
        </div>
        
        {/* Time label */}
        <h4 className="text-sm font-medium text-primary/90">{timeLabel}</h4>
      </div>

      {/* Tasks for this time block */}
      <div className="ml-6 space-y-2">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id}
            task={task}
            onMarkDone={onMarkDone}
            onMarkNotDone={onMarkNotDone}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeBlock;
