
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskTable } from '@/components/tasks/TaskTable';
import { Task, TaskRole } from '@/types';
import { fetchTasksByRole, createTask, updateTask, deleteTask } from '@/services/taskService';
import { useAuth } from '@/contexts/auth';

const TaskSection: React.FC = () => {
  const { toast } = useToast();
  const {user}= useAuth()
  const [taskRoleTab, setTaskRoleTab] = useState<TaskRole>("receptionist");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [taskRoleTab]);
  console.log(user,">>>>>>>>>>>>>>>>")
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const tasksData = await fetchTasksByRole(taskRoleTab,user.id);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTask = async (formData: any) => {
    try {
      const newTask = await createTask(formData);
      setTasks(prev => [...prev, newTask]);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateTask = async (formData: any) => {
    if (!editingTask) return;
    
    try {
      const updatedTask = await updateTask({
        id: editingTask.id,
        ...formData,
      });
      
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      
      setEditingTask(null);
      setIsFormOpen(false);
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleOpenForm = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <>
      <Card className="border-border/50 backdrop-blur-sm bg-card/80 hover:shadow-md transition-all duration-300">
        <CardHeader className="border-b border-border/20">
          <CardTitle className="text-xl text-indigo-500 flex items-center">
            <ClipboardList className="mr-2 h-5 w-5 text-primary" />
            Task Management
          </CardTitle>
          <CardDescription>
            Manage the daily tasks for hotel staff. Create, edit, or remove tasks for specific roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="receptionist" value={taskRoleTab} onValueChange={(value) => setTaskRoleTab(value as TaskRole)} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-background/50 border border-primary/10 backdrop-blur-sm p-1 rounded-full">
                <TabsTrigger 
                  value="receptionist" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-indigo-400/80 data-[state=active]:shadow-md data-[state=active]:text-white transition-all duration-300 rounded-full px-4 py-1.5"
                >
                  Receptionist
                </TabsTrigger>
                <TabsTrigger 
                  value="host" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-indigo-400/80 data-[state=active]:shadow-md data-[state=active]:text-white transition-all duration-300 rounded-full px-4 py-1.5"
                >
                  Host
                </TabsTrigger>
                <TabsTrigger 
                  value="nightshift" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-indigo-400/80 data-[state=active]:shadow-md data-[state=active]:text-white transition-all duration-300 rounded-full px-4 py-1.5"
                >
                  Nightshift
                </TabsTrigger>
              </TabsList>
              
              <Button 
                onClick={() => handleOpenForm()} 
                className="bg-gradient-to-r from-primary to-indigo-500 hover:opacity-90 group shadow-lg shadow-primary/20 transition-all duration-300"
              >
                <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
                Add Task
              </Button>
            </div>
            
            <div className="mt-4 relative">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse"></div>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                  <span className="ml-3 bg-gradient-to-r from-primary/90 to-indigo-500/90 bg-clip-text text-transparent font-medium">Loading tasks...</span>
                </div>
              ) : (
                <TaskTable 
                  tasks={tasks} 
                  onEdit={handleOpenForm} 
                  onDelete={handleDeleteTask} 
                />
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto border-l border-primary/20 bg-background/95 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-indigo-500/5 pointer-events-none"></div>
          <SheetHeader>
            <SheetTitle className="text-xl bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">{editingTask ? 'Edit Task' : 'Create New Task'}</SheetTitle>
            <SheetDescription>
              {editingTask ? 'Update the details for this task' : 'Add a new task to the schedule'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 relative z-10">
            <TaskForm 
              defaultValues={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCloseForm}
              isEditing={!!editingTask}
              selectedRole={taskRoleTab}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TaskSection;
