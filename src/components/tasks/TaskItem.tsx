import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Undo, XCircle, User, TriangleAlert } from "lucide-react";
import { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  onMarkDone: (taskId: string) => void;
  onMarkNotDone: (taskId: string) => void;
  selectedDate: Date;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onMarkDone,
  onMarkNotDone,
  selectedDate
}) => {
  console.log(selectedDate,"selectedDate")
  const date = new Date();
  const isToday = date.toDateString() === selectedDate.toDateString();
  console.log(isToday,"isToday")

  return (
    <div
      className={cn(
        "p-3.5 rounded-lg border shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        task.status === "completed" &&
          "border-green-500/20 bg-green-50 dark:bg-green-950/20",
        task.status === "overdue" && "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium mb-1 text-lg">{task.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {task.description}
          </p>

          {task.status === "overdue" && task.reason && (
            <div className="mt-2 p-2 border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-xs flex items-center text-gray-600 dark:text-gray-300">
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
  {isToday && (
    task.status === "completed" ? (
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
          className="h-7 w-7 p-0 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          title="Mark as overdue"
        >
          <XCircle size={14} />
        </Button>
      </>
    )
  )}
</div>

      </div>
    </div>
  );
};

export default TaskItem;
