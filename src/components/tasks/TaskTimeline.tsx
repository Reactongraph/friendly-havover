import React, { useState, useMemo } from "react";
import { Clock } from "lucide-react";
import { Task } from "@/types";
import TimeBlock from "./TimeBlock";
import NotDoneDialog from "./NotDoneDialog";
import { groupTasksByTime } from "./TaskData";
import { markTaskDone, markTaskNotDone } from "@/utils/taskUtils";
import TaskLoadingState from "./TaskLoadingState";
import { useTeamMembers } from "@/hooks/useTeamMembers";

interface TaskTimelineProps {
  date: Date;
  selectedRole: string | null;
  account?: unknown;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isLoading: boolean;
}

const TaskTimeline: React.FC<TaskTimelineProps> = ({
  date,
  selectedRole,
  account,
  tasks,
  setTasks,
  isLoading,
}) => {
  const [notDoneDialogOpen, setNotDoneDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const { currentUser } = useTeamMembers();
console.log(date,"date-----tasktimeline")
  const updateTaskState = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const handleMarkTaskDone = async (taskId: string) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",tasks)
    await markTaskDone(taskId, currentUser, updateTaskState, tasks);
  };

  const openNotDoneDialog = (taskId: string) => {
    setCurrentTaskId(taskId);
    setNotDoneDialogOpen(true);
  };

  const handleNotDoneSubmit = async () => {
    if (!currentTaskId) return;

    const success = await markTaskNotDone(
      currentTaskId,
      reason,
      updateTaskState
    );

    if (success) {
      setReason("");
      setCurrentTaskId(null);
      setNotDoneDialogOpen(false);
    }
  };

  const filteredTasks = useMemo(
    () => (selectedRole ? tasks.filter((task) => task.role === selectedRole) : tasks),
    [tasks, selectedRole]
  );

  const { groupedTasks, sortedTimeBlocks } = useMemo(
    () => groupTasksByTime(filteredTasks),
    [filteredTasks]
  );

  if (isLoading) {
    return <TaskLoadingState />;
  }

  return (
    <div className="relative px-4">
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <Clock className="mr-2 text-primary" size={20} />
        Today's Schedule{" "}
        {selectedRole && (
          <span className="text-sm ml-2 font-normal text-gray-500">
            ({selectedRole})
          </span>
        )}
      </h3>

      <div className="relative px-2">
        {sortedTimeBlocks.length > 0 ? (
          sortedTimeBlocks.map((timeBlock) => (
            <TimeBlock
              key={timeBlock}
              timeLabel={timeBlock}
              tasks={groupedTasks[timeBlock]}
              onMarkDone={handleMarkTaskDone}
              onMarkNotDone={openNotDoneDialog}
              selectedDate={date}
            />
          ))
        ) : (
          <div className="py-14 text-center text-gray-500">
            {selectedRole
              ? `No tasks scheduled for ${selectedRole} role today`
              : "No tasks scheduled for today"}
          </div>
        )}
      </div>

      <NotDoneDialog
        open={notDoneDialogOpen}
        onOpenChange={setNotDoneDialogOpen}
        reason={reason}
        onReasonChange={setReason}
        onSubmit={handleNotDoneSubmit}
      />
    </div>
  );
};

export default TaskTimeline;