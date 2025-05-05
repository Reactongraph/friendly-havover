
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquarePlus, Sparkles, X, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QAAnnotation } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  noteId: string;
  qaAnnotations?: QAAnnotation[];
  isOverdue?: boolean;
  isCompleted: boolean;
  showCommentInput: boolean;
  setShowCommentInput: (show: boolean) => void;
  onAddQAAnnotation?: (noteId: string, qa: { question: string, answer: string }) => void;
  onAIProcess?: (noteId: string) => void;
  content: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  noteId,
  qaAnnotations = [],
  isOverdue = false,
  isCompleted,
  showCommentInput,
  setShowCommentInput,
  onAddQAAnnotation,
  onAIProcess,
  content,
}) => {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [answer, setAnswer] = useState('');

  const handleAICheckboxChange = (checked: boolean) => {
    setAiEnabled(checked);
    if (checked) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmAI = () => {
    if (onAIProcess && noteId) {
      onAIProcess(noteId);
    }
    setShowConfirmation(false);
  };

  const handleAddQA = () => {
    if (onAddQAAnnotation && noteId && answer.trim()) {
      onAddQAAnnotation(noteId, { 
        question: content, 
        answer: answer.trim() 
      });
      setAnswer('');
      setShowCommentInput(false);
    }
  };

  const hasQAAnnotations = qaAnnotations.length > 0;

  return (
    <>
      {showCommentInput && (
        <div className={cn(
          "p-4 border-t-2 border-t-[#ea384c] animate-in slide-in-from-top-5 duration-200",
          isOverdue
            ? "bg-amber-50/70 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50"
            : isCompleted 
              ? "bg-green-50/70 dark:bg-green-900/10 border-green-200 dark:border-green-800/50" 
              : "bg-muted/20 border-border"
        )}>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor={`answer-${noteId}`} className="text-xs font-medium">Your Comment</Label>
              <Textarea
                id={`answer-${noteId}`}
                placeholder="Enter your comment..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`ai-gen-${noteId}`} 
                checked={aiEnabled}
                onCheckedChange={handleAICheckboxChange}
              />
              <label 
                htmlFor={`ai-gen-${noteId}`}
                className="text-xs cursor-pointer"
              >
                Generate AI Comment
              </label>
            </div>
            
            <div className="flex justify-end gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowCommentInput(false);
                  setAnswer('');
                  setAiEnabled(false);
                }}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddQA}
                disabled={!answer.trim()}
                className="h-8 text-xs"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {hasQAAnnotations && (
        <div className={cn(
          "border-t",
          isOverdue
            ? "border-amber-200 dark:border-amber-800/50"
            : isCompleted 
              ? "border-green-200 dark:border-green-800/50" 
              : "border-border"
        )}>
          <div className="p-4">
            <h4 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-3">
              <MessageSquarePlus size={16} />
              {qaAnnotations.length} {qaAnnotations.length === 1 ? 'Comment' : 'Comments'}
            </h4>
            <div className="space-y-3 mt-2">
              {qaAnnotations.map((qa) => (
                <div key={qa.id} className={cn(
                  "p-3 rounded-md border",
                  qa.isAIGenerated 
                    ? "bg-purple-50/70 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50" 
                    : "bg-blue-50/70 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50"
                )}>
                  <div className="text-xs text-right font-medium mb-1">
                    {qa.isAIGenerated ? (
                      <span className="inline-flex items-center text-purple-700 dark:text-purple-400">
                        <Sparkles size={12} className="mr-1" />
                        AI Generated
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(qa.createdAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <div className="text-sm">{qa.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate AI Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to generate an AI comment for this note? This will submit the note content for AI processing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {
              setShowConfirmation(false);
              setAiEnabled(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAI}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommentSection;
