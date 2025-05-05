import { supabase } from "@/integrations/supabase/client";
import {
  Task,
  TaskRole,
  RecurringDays,
  DbTask,
} from "@/types";

// Helper function to convert database response to Task type
const mapDbTaskToTask = (dbTask: DbTask): Task => {
  // Handle recurring_days conversion from JSON to RecurringDays type
  let recurring_days: RecurringDays | null = null;
  if (dbTask.recurring_days) {
    // Make sure we have a proper RecurringDays object
    recurring_days = {
      monday: !!dbTask.recurring_days.monday,
      tuesday: !!dbTask.recurring_days.tuesday,
      wednesday: !!dbTask.recurring_days.wednesday,
      thursday: !!dbTask.recurring_days.thursday,
      friday: !!dbTask.recurring_days.friday,
      saturday: !!dbTask.recurring_days.saturday,
      sunday: !!dbTask.recurring_days.sunday,
    };
  }

  return {
    ...dbTask,
    recurring_days,
  } as Task;
};

export async function fetchTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("start_time");

  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }

  return data.map(mapDbTaskToTask);
}

export async function fetchTasksByRole(
  role: TaskRole,
  userId: string,
  date?: Date
) {
  // If no date is provided, we can't filter recurring tasks by day
  if (!date) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("role", role)
      .eq("created_by", userId)
      .order("start_time");

    if (error) {
      console.error(`Error fetching tasks for role ${role} and user ${userId}:`, error);
      throw error;
    }

    return data.map(mapDbTaskToTask);
  }

  // Format the date and weekday
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const formattedDate = localDate.toISOString().split("T")[0];
  const weekday = localDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  // Fetch tasks for the user and role
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("role", role)
    .eq("created_by", userId)
    .order("start_time");

  if (error) {
    console.error(`Error fetching tasks for role ${role} and user ${userId}:`, error);
    throw error;
  }

  if (!data) return [];

  // Filter for one-time and recurring tasks
  const filteredTasks = data.filter((task) => {
    const isOneTimeMatch =
      task.type === "one-time" && task.task_date === formattedDate;

    const isRecurringMatch =
      task.type === "recurring" && task.recurring_days?.[weekday] === true;

    return isOneTimeMatch || isRecurringMatch;
  });

  return filteredTasks.map(mapDbTaskToTask);
}


export async function createTask(
  task: Omit<Task, "id" | "status" | "reason" | "created_at" | "updated_at">
) {
  // For the database, ensure recurring_days is properly formatted as JSON
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }

  return mapDbTaskToTask(data as DbTask);
}

export async function updateTask(task: Partial<Task> & { id: string }) {
  const { data, error } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", task.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }

  return mapDbTaskToTask(data as DbTask);
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }

  return true;
}
