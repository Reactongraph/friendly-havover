
import React from 'react';
import { cn } from '@/lib/utils';

interface NoteContentProps {
  content: string;
  isOverdue?: boolean;
  isCompleted: boolean;
}

const NoteContent: React.FC<NoteContentProps> = ({
  content,
  isOverdue = false,
  isCompleted,
}) => {
  const formattedContent = content.split('\n').map((line, i) => (
    <span key={i} className="block font-normal text-lg">
      {line}
    </span>
  ));

  return (
    <div className={cn(
      "p-5", 
      isOverdue
        ? "bg-amber-50/90 dark:bg-amber-900/20"
        : isCompleted 
          ? "bg-green-50/90 dark:bg-green-900/20" 
          : "bg-card"
    )}>
      <div className="prose prose-sm max-w-none">
        {formattedContent}
      </div>
    </div>
  );
};

export default NoteContent;
