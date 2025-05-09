import { Task } from '@/types';
import { createTask, updateTask } from '@/services/taskService';
import { format, addDays } from 'date-fns';
import { toast as showToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  role?: string;
  avatar_type?: string;
}
function getNextRecurringDate(task: {
  recurring_days: { [key: string]: boolean };
}): string {
  const today = new Date();
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];

  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const dayName = weekdays[nextDate.getDay()];

    if (task.recurring_days[dayName]) {
      return nextDate.toISOString().split("T")[0]; // returns date in YYYY-MM-DD
    }
  }

  // fallback: return tomorrow if nothing is matched (shouldn’t happen)
  const fallback = new Date(today);
  fallback.setDate(today.getDate() + 1);
  return fallback.toISOString().split("T")[0];
}


export const getCurrentUserName = (currentUser: User | null): string => {
  if (!currentUser) return "Unknown user";
  return currentUser.name || "Unknown user";
};

export const markTaskDone = async (
  taskId: string, 
  currentUser: User | null, 
  updateTasksState: (taskId: string, updates: Partial<Task>) => void,
  tasks?: Task[] // pass full task data here
) => {
  try {
    const userName = getCurrentUserName(currentUser);
    const taskData = tasks?.find((task: Task) => task.id === taskId);
    await updateTask({
      id: taskId,
      status: 'completed',
      completed_by: userName,
      recursive_actions: taskData?.recursive_actions
    });
    
    updateTasksState(taskId, { 
      status: 'completed', 
      completed_by: userName 
    });
    console.log(tasks,"taskdata")
    

    console.log(taskData,"taskdata")
    if (taskData?.type === "recurring") {
      console.log("recurring")
      const nextDate = getNextRecurringDate(taskData);
      console.log(nextDate,"nextdate") // your helper function
      const newTask = {
        ...taskData,
        id: undefined, // Let DB generate a new ID
        status: "pending",
        completed_by: null,
        task_date: nextDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // await createTask(newTask,currentUser?.id); // This should hit your task creation API
    }

    showToast({
      title: "Success",
      description: "Task marked as completed",
    });
  } catch (error) {
    console.error('Failed to update task status:', error);
    showToast({
      title: "Error",
      description: "Failed to update task status. Please try again.",
      variant: "destructive",
    });
  }
};

const getNextRecurrenceDate = (date: string, pattern: 'daily' | 'weekly' | 'monthly') => {
  const base = new Date(date);
  if (pattern === 'daily') return format(addDays(base, 1), 'yyyy-MM-dd');
  if (pattern === 'weekly') return format(addDays(base, 7), 'yyyy-MM-dd');
  if (pattern === 'monthly') return format(addDays(base, 30), 'yyyy-MM-dd');
  return date;
};

export const markTaskNotDone = async (
  taskId: string,
  reason: string,
  updateTasksState: (taskId: string, updates: Partial<Task>) => void
) => {
  try {
    await updateTask({
      id: taskId,
      status: 'overdue',
      reason
    });
    
    updateTasksState(taskId, { 
      status: 'overdue', 
      reason 
    });
    
    showToast({
      title: "Task status updated",
      description: "Task marked as not completed with reason noted.",
    });
    
    return true;
  } catch (error) {
    console.error('Failed to update task status:', error);
    showToast({
      title: "Error",
      description: "Failed to update task status. Please try again.",
      variant: "destructive",
    });
    
    return false;
  }
};
