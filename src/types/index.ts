export type User = {
  id?: string;
  name?: string;
  role?: string;
  emoji?: string;
  avatar_type?: string;
};

export type Priority = "low" | "medium" | "high";

export type QAAnnotation = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  isAIGenerated: boolean;
};

export type HandoverNote = {
  id: string;
  userId: string;
  priority: Priority;
  content: string;
  date: string; // YYYY-MM-DD format
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  editedAt?: string;
  qaAnnotations?: QAAnnotation[];
};

export type Account = {
  id: string;
  name: string;
  email: string;
  subscriptionTier: "basic" | "premium" | "enterprise";
  users: User[];
  currentUserId: string;
};

export type TaskRole = "receptionist" | "host" | "nightshift";
export type TaskStatus = "pending" | "completed" | "overdue";
export type TaskType = "recurring" | "one-time";

export type RecurringDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};
export interface RecursiveAction {
  actionType: "completed" | "incomplete";
  actionDate: string; // in 'YYYY-MM-DD' format
  remarks?: string | null;
}
export type Task = {
  id: string;
  title: string;
  description: string;
  role: TaskRole;
  start_time: string; // Database column name
  end_time: string; // Database column name
  status: TaskStatus;
  type: TaskType;
  priority: Priority;
  reason?: string;
  completed_by?: string; // Name of the user who completed the task
  recurring_days?: RecurringDays | null;
  task_date?: string | null;
  created_at?: string;
  updated_at?: string;
  recursive_actions?: RecursiveAction[];
};

export type DbTask = {
  id: string;
  title: string;
  use
  description: string;
  role: string;
  start_time: string;
  end_time: string;
  type: string;
  created_by:string,
  priority: string;
  status: string;
  reason: string;
  created_at: string;
  updated_at: string;
  recurring_days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  } | null;
  task_date: string;
  completed_by: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recursive_actions?: any; 
};
