
import React, { useState } from 'react';
import { HandoverNote, User } from '@/types';
import { cn } from '@/lib/utils';
import NoteCardHeader from './NoteCardHeader';
import NoteContent from './NoteContent';
import CommentSection from './CommentSection';
import NoteFooter from './NoteFooter';

interface NoteCardProps {
  note: HandoverNote;
  user: User | null;
  index: number;
  isOverdue?: boolean;
  onComplete?: (noteId: string) => void;
  onUncomplete?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
  onEdit?: (note: HandoverNote) => void;
  onAIProcess?: (noteId: string) => void;
  onAddQAAnnotation?: (noteId: string, qa: { question: string, answer: string }) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  user,
  index,
  isOverdue = false,
  onComplete,
  onUncomplete,
  onDelete,
  onEdit,
  onAIProcess,
  onAddQAAnnotation,
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  
  const cardBgClasses = {
    low: isOverdue ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-green-400',
    medium: isOverdue ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-amber-400',
    high: isOverdue ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-red-400'
  };

  return (
    <div 
      className={cn(
        "note-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-elevated transform hover:-translate-y-1",
        cardBgClasses[note.priority],
        isOverdue 
          ? "bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30" 
          : note.isCompleted 
            ? "bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700" 
            : "bg-white dark:bg-zinc-900/90"
      )} 
      style={{
        '--index': index
      } as React.CSSProperties}
    >
      <NoteCardHeader 
        user={user}
        priority={note.priority}
        isOverdue={isOverdue}
        isCompleted={note.isCompleted}
      />
      
      <NoteContent 
        content={note.content}
        isOverdue={isOverdue}
        isCompleted={note.isCompleted}
      />
      
      <CommentSection
        noteId={note.id}
        qaAnnotations={note.qaAnnotations}
        isOverdue={isOverdue}
        isCompleted={note.isCompleted}
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        onAddQAAnnotation={onAddQAAnnotation}
        onAIProcess={onAIProcess}
        content={note.content}
      />
      
      <NoteFooter
        noteId={note.id}
        createdAt={note.createdAt}
        isCompleted={note.isCompleted}
        isOverdue={isOverdue}
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        onComplete={onComplete}
        onUncomplete={onUncomplete}
        onDelete={onDelete}
        onEdit={onEdit}
        note={note}
      />
    </div>
  );
};

export default NoteCard;
