
import React, { useState } from 'react';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, User2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import TaskTimeline from '@/components/tasks/TaskTimeline';
import TaskManagementPanel from '@/components/tasks/TaskManagementPanel';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Account } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { capitalizeFirstLetter } from '@/lib/utils';

interface TasksProps {
  account?: Account;
}

const Tasks: React.FC<TasksProps> = ({ account }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [showManagementPanel, setShowManagementPanel] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>('receptionist');

  const { tasks, setTasks, isLoading } = useTasks({ selectedRole, date: selectedDate });
  
  const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'completed').length : 0;
  const totalTasks = Array.isArray(tasks) ? tasks.length : 20;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100) || 0;

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const getRoleLabel = () => {
    return selectedRole ? capitalizeFirstLetter(selectedRole) : "receptionist";
  };

  return <Layout account={account}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Header Card - Updated with primary purple background color */}
        <Card className="mb-8 bg-primary/10 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Top section with title and controls */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                {/* Title and subtitle */}
                <div>
                  <h1 className="text-4xl font-bold text-primary">Daily Staff Tasks</h1>
                  <p className="text-gray-600 mt-1">Standard daily timeline for hotel staff</p>
                  
                  <div className="flex items-center mt-2">
                    <span className="text-[#4B5563] text-xl">{format(selectedDate, "EEEE, MMMM do, yyyy")}</span>
                    {isToday(selectedDate) && <span className="ml-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">Today</span>}
                  </div>
                </div>
                
                {/* Control elements moved up here */}
                <div className="flex flex-col md:flex-row items-end gap-3">
                  {/* Role Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-white h-10 gap-2 rounded-lg px-4 w-full md:w-auto">
                        <User2 className="h-5 w-5" />
                        {getRoleLabel()}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setSelectedRole("receptionist")}>
                          Receptionist
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedRole("host")}>
                          Host
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedRole("nightshift")}>
                          Nightshift
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Date Navigation */}
                  <div className="bg-white rounded-lg shadow p-1 flex items-center">
                    <Button variant="ghost" onClick={() => navigateDate('prev')} className="h-8 w-8 p-0 rounded-full">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="px-3 flex gap-2 items-center h-8">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {format(selectedDate, "MMM d, yyyy")}
                            {isToday(selectedDate) && <span className="ml-1 text-primary">(Today)</span>}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar mode="single" selected={selectedDate} onSelect={date => date && setSelectedDate(date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                    
                    <Button variant="ghost" onClick={() => navigateDate('next')} className="h-8 w-8 p-0 rounded-full">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Add Task button */}
                  
                </div>
              </div>
              
              {/* Progress bar - moved below the controls */}
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-base">Daily Progress: {completedTasks} of {totalTasks} tasks completed</span>
                  <span className="font-medium text-sm">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-gray-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Section with improved spacing */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Card className="shadow-md border-gray-200 dark:border-gray-800">
              <CardContent className="p-4 md:p-6">
                <TaskTimeline 
                  date={selectedDate} 
                  selectedRole={selectedRole} 
                  account={account}
                  tasks={tasks}
                  setTasks={setTasks}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {showManagementPanel && <div className="w-full md:w-96">
              <TaskManagementPanel onClose={() => setShowManagementPanel(false)} />
            </div>}
        </div>
      </div>
    </Layout>;
};

export default Tasks;
