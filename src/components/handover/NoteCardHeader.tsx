
import React from 'react';
import { cn } from '@/lib/utils';
import UserAvatar from '../common/UserAvatar';
import { CheckCircle, AlertTriangle, User as UserIcon } from 'lucide-react';
import { Priority, User } from '@/types';

interface NoteCardHeaderProps {
  user: User | null;
  priority: Priority;
  isOverdue?: boolean;
  isCompleted: boolean;
}

const NoteCardHeader: React.FC<NoteCardHeaderProps> = ({
  user,
  priority,
  isOverdue = false,
  isCompleted,
}) => {
  const priorityClasses = {
    low: 'bg-green-50 border-green-200 text-priority-low',
    medium: 'bg-amber-50 border-amber-200 text-priority-medium',
    high: 'bg-red-50 border-red-200 text-priority-high'
  };
  
  const priorityLabel = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority'
  };

  return (
    <div className={cn(
      "p-4 border-b",
      isOverdue
        ? "border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-900/30"
        : isCompleted 
          ? "border-green-200 dark:border-green-800 bg-green-50/80 dark:bg-green-900/30" 
          : "border-border bg-muted/30"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          {user ? (
            <UserAvatar user={user} size="sm" />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <UserIcon size={16} />
            </div>
          )}
          <div>
            <h3 className="font-medium text-sm">{user?.name || 'Unknown User'}</h3>
            <p className="text-xs text-muted-foreground">{user?.role || 'No role'}</p>
          </div>
        </div>
        
        {isOverdue ? (
          <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300 flex items-center">
            <AlertTriangle size={14} className="mr-1.5" />
            Overdue
          </div>
        ) : isCompleted ? (
          <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300 flex items-center">
            <CheckCircle size={14} className="mr-1.5" />
            Completed
          </div>
        ) : (
          <div className={cn("px-2 py-1 rounded-full text-xs font-medium", priorityClasses[priority])}>
            {priorityLabel[priority]}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCardHeader;
