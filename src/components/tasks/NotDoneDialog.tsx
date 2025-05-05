
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface NotDoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
}

const NotDoneDialog: React.FC<NotDoneDialogProps> = ({ 
  open, 
  onOpenChange, 
  reason, 
  onReasonChange, 
  onSubmit 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={20} />
            <DialogTitle>Task Not Completed</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Please provide a reason why this task could not be completed. It will be moved to tomorrow's schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea 
            placeholder="Enter reason here..." 
            value={reason} 
            onChange={(e) => onReasonChange(e.target.value)}
            className="min-h-[120px] resize-none focus-visible:ring-primary"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            className="bg-primary hover:bg-primary/90"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotDoneDialog;
