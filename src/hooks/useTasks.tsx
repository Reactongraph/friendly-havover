import { useState, useEffect, useCallback, useMemo } from "react";
import { Task, TaskRole } from "@/types";
import { fetchTasksByRole } from "@/services/taskService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth";

interface UseTasksProps {
  selectedRole: string | null;
  date?: Date;
}

export function useTasks({ selectedRole, date }: UseTasksProps) {
  const {user} = useAuth()
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const roles = useMemo(() => ["receptionist", "host", "nightshift"], []);

  const loadTasks = useCallback(async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      const tasksData = await fetchTasksByRole(selectedRole as TaskRole,user.id, date);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedRole, date, toast]);

  const loadAllTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const tasksData = await Promise.all(
        roles.map((role) => fetchTasksByRole(role as TaskRole,user.id))
      );
      setTasks(tasksData.flat());
    } catch (error) {
      console.error("Failed to load all tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [roles, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedRole || date) {
        loadTasks();
      } else {
        loadAllTasks();
      }
    }, 300); // Debounce delay

    return () => clearTimeout(timeoutId);
  }, [selectedRole, date, loadTasks, loadAllTasks]);

  return {
    tasks,
    setTasks,
    isLoading,
  };
}
