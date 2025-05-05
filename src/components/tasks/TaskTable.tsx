
import React from 'react';
import { Task, TaskRole, Priority } from '@/types';
import { format } from 'date-fns';
import { Edit, Trash, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high': return 'text-red-500 bg-red-50 border-red-200';
    case 'medium': return 'text-amber-500 bg-amber-50 border-amber-200';
    case 'low': return 'text-green-500 bg-green-50 border-green-200';
    default: return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  if (!tasks.length) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-md">
        <p className="text-gray-500">No tasks found. Create your first task!</p>
      </div>
    );
  }

  // Helper function to format time strings safely
  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    // Extract HH:MM from HH:MM:SS format
    return timeString.substring(0, 5);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                </div>
              </TableCell>
              <TableCell>
                {formatTime(task.start_time)} - {formatTime(task.end_time)}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {task.type === 'recurring' ? (
                    <span className="flex items-center text-xs">
                      <RefreshCw className="mr-1 h-3 w-3" /> Recurring
                    </span>
                  ) : (
                    <span className="flex items-center text-xs">
                      <Calendar className="mr-1 h-3 w-3" /> 
                      {task.task_date ? format(new Date(task.task_date), 'MMM d, yyyy') : 'One-time'}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs capitalize border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(task)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the task "{task.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(task.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
