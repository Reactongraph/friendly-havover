
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, Undo, Edit, Trash, PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface NoteFooterProps {
  noteId: string;
  createdAt: string;
  isCompleted: boolean;
  isOverdue?: boolean;
  showCommentInput: boolean;
  setShowCommentInput: (show: boolean) => void;
  onComplete?: (noteId: string) => void;
  onUncomplete?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
  onEdit?: (note: any) => void;
  note: any;
}

const NoteFooter: React.FC<NoteFooterProps> = ({
  noteId,
  createdAt,
  isCompleted,
  isOverdue = false,
  showCommentInput,
  setShowCommentInput,
  onComplete,
  onUncomplete,
  onDelete,
  onEdit,
  note,
}) => {
  return (
    <div className={cn(
      "p-3 flex items-center justify-between border-t",
      isOverdue
        ? "bg-amber-50/70 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50"
        : isCompleted 
          ? "bg-green-50/70 dark:bg-green-900/10 border-green-200 dark:border-green-800/50" 
          : "bg-muted/20 border-border"
    )}>
      <div className="flex items-center text-xs text-muted-foreground space-x-1">
        <Clock size={12} />
        <span>
          {createdAt ? formatDistanceToNow(new Date(createdAt), {
            addSuffix: true
          }) : 'Unknown time'}
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        {!isCompleted && onComplete && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onComplete(noteId)} 
            className="text-xs h-8 px-2 hover:bg-green-50 hover:text-green-600 transition-colors"
          >
            <CheckCircle size={14} className="mr-1" />
            Mark Complete
          </Button>
        )}
        
        {isCompleted && onUncomplete && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onUncomplete(noteId)} 
            className="text-xs h-8 px-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Undo size={14} className="mr-1" />
            Undo Complete
          </Button>
        )}
        
        {isCompleted && !onUncomplete && (
          <span className="text-xs text-green-600 flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Completed
          </span>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowCommentInput(!showCommentInput)} 
          className="text-xs h-8 px-2 ml-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          {showCommentInput ? (
            <>
              <X size={14} className="mr-1" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle size={14} className="mr-1" />
              Add Comment
            </>
          )}
        </Button>
        
        {onEdit && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(note)} 
            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Edit size={14} />
          </Button>
        )}
        
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(noteId)} 
            className="h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NoteFooter;
