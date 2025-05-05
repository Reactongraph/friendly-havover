
import { Task } from '@/types';
import { updateTask } from '@/services/taskService';
import { toast as showToast } from "@/components/ui/use-toast";

export const getCurrentUserName = (account: any): string => {
  if (!account || !account.users) return "Unknown user";
  const currentUser = account.users.find((user: any) => user.id === account.currentUserId);
  return currentUser ? currentUser.name : "Unknown user";
};

export const markTaskDone = async (
  taskId: string, 
  account: any, 
  updateTasksState: (taskId: string, updates: Partial<Task>) => void
) => {
  try {
    const userName = getCurrentUserName(account);
    
    await updateTask({
      id: taskId,
      status: 'completed',
      completed_by: userName
    });
    
    updateTasksState(taskId, { 
      status: 'completed', 
      completed_by: userName 
    });
    
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
