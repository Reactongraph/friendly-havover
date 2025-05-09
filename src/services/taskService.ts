import { supabase } from "@/integrations/supabase/client";
import {
  Task,
  TaskRole,
  RecurringDays,
  RecursiveAction,
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
  const today = new Date()
    const isCompleted = dbTask.recursive_actions?.some(
      (action: any) => {
        const actionDate = new Date(action.timestamp);
        console.log(actionDate.toDateString(),"actionDate",today.toDateString())
        return true;
        // return actionDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === today.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()

      }
    );
  return {
    ...dbTask,
    recurring_days,
    isCompleted,
  } as Task;
};

// export async function fetchTasks() {
//   const { data, error } = await supabase
//     .from("tasks")
//     .select("*")
//     .order("start_time");

//   if (error) {
//     console.error("Error fetching tasks:", error);
//     throw error;
//   }

//   return data.map(mapDbTaskToTask);
// }

export async function fetchTasksByRole(
  role: TaskRole,
  userId: string,
  date?: Date
) {
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

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const formattedDate = localDate.toISOString().split("T")[0];
  const weekday = localDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

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
console.log(data,"data")

  const filteredTasks = data.filter((task) => {
    const isOneTimeMatch =
      task.type === "one-time" && task.task_date === formattedDate;
      // console.log(filteredTasks,"filteredTasks")
    const isRecurringMatch =
      task.type === "recurring" &&
      task.recurring_days?.[weekday] === true &&
      !task?.recurring_actions?.some(
        (entry: any) => entry.date === formattedDate && entry.status === "completed"
      );

    return isOneTimeMatch || isRecurringMatch;
  });
const statusMapTask = filteredTasks.map((task) => {
  console.log(task,"taskbyAmit")
  const isCompleted = task.recursive_actions?.some(
    (action: any) => {
      const actionDate = new Date(action.timestamp);
      // console.log(actionDate.toDateString(),"actionDatewill",date?.toDateString())
      return  actionDate.toDateString() === date?.toDateString();
    }

  );

  return {
    ...task,
    status:isCompleted ? "completed" : "pending"
  }
}
)
  return statusMapTask.map(mapDbTaskToTask);
}


function upsertRecursiveAction(
  actions: any[] = [],
  newAction: { action: string; day: string; completed_by: string; timestamp: string }
) {
  console.log("actions",actions)
  console.log("in the upsertRecursiveAction function")
  // Remove any existing action with same type and day
  const filtered = actions.filter(
    (a) => !(a.action === newAction.action && a.day === newAction.day)
  );
  console.log("filtered",filtered)
  return [...filtered, newAction];
}


export async function createTask(
  task: Omit<Task, "id" | "status" | "reason" | "created_at" | "updated_at">,
  userId: string
) {
  console.log("LAVESH ---------CREATE TASK")
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  }).toLowerCase();
  const dateString = new Date().toISOString().split("T")[0];

  if (task.type === "recurring") {
    // 1. Check if a task of the same title, role, and start_time already exists for today
    const { data: existingTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("title", task.title)
      .eq("role", task.role)
      .eq("created_by", userId)
      // .eq("task_date", dateString); // add a `task_date` on insertion too

    if (existingTasks && existingTasks.length > 0) {
      console.log("Recurring task already created for today:", task.title);
      return null;
    }
  }

  const timestamp = new Date().toISOString();

  const enhancedTask = {
    ...task,
    task_date: new Date().toISOString().split("T")[0],
    status: "pending",
    recursive_actions:[]
      
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(enhancedTask)
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }

  return mapDbTaskToTask(data as DbTask);
}




export async function updateTask(
  task: Partial<Task> & { id: string },
  complete: boolean = false,
  userId?: string
) {
  console.log(complete,"Updating task with data:", task,"------",userId);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

  if (task.status === "pending"||task.status === "completed") {
    // console.log("complete",complete,"userId",userId);
    console.log("in the pending block")
    task.status = "completed";
    task.recursive_actions = upsertRecursiveAction(task.recursive_actions, {
      action: "complete",
      day: today,
      completed_by: task.id,
      timestamp: new Date().toISOString(),
    });
  }

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
