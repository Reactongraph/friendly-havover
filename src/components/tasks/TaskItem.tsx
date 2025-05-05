import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Undo, XCircle, User, TriangleAlert } from "lucide-react";
import { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  onMarkDone: (taskId: string) => void;
  onMarkNotDone: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onMarkDone,
  onMarkNotDone,
}) => {
  return (
    <div
      className={cn(
        "p-3.5 rounded-lg border shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        task.status === "completed" &&
          "border-green-500/20 bg-green-50 dark:bg-green-950/20",
        task.status === "overdue" && "border-destructive/20 bg-destructive/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium mb-1 text-lg">{task.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {task.description}
          </p>

          {task.status === "overdue" && task.reason && (
            <div className="mt-2 p-2 border-l-4 border-red-600 bg-red-50 dark:bg-red-900 text-xs flex items-center text-red-800 dark:text-red-200">
              <TriangleAlert size={16} className="mr-2" />
              <span className="ml-1">{task.reason}</span>
            </div>
          )}

          {task.status === "completed" && task.completed_by && (
            <div className="mt-2 text-xs flex items-center text-green-600 dark:text-green-400">
              <User size={12} className="mr-1" />
              <span>Completed by {task.completed_by}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2 shrink-0">
          {task.status === "completed" ? (
            <Button
              onClick={() => onMarkNotDone(task.id)}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              title="Return to pending"
            >
              <Undo size={14} />
            </Button>
          ) : (
            <>
              <Button
                onClick={() => onMarkDone(task.id)}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/20"
                title="Mark as complete"
              >
                <Check size={14} />
              </Button>
              <Button
                onClick={() => onMarkNotDone(task.id)}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive dark:bg-destructive/20"
                title="Mark as overdue"
              >
                <XCircle size={14} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
