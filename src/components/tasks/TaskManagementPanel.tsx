
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

interface TaskTemplateProps {
  id: string;
  title: string;
  description: string;
  defaultRole: 'receptionist' | 'host' | 'nightshift';
  defaultStartTime: string;
  defaultEndTime: string;
  priority: 'low' | 'medium' | 'high';
}

interface TaskManagementPanelProps {
  onClose: () => void;
}

const taskTemplates: TaskTemplateProps[] = [
  {
    id: 'temp1',
    title: 'Morning Room Check',
    description: 'Inspect all vacant rooms for cleanliness and maintenance issues.',
    defaultRole: 'host',
    defaultStartTime: '08:00',
    defaultEndTime: '10:00',
    priority: 'medium'
  },
  {
    id: 'temp2',
    title: 'Guest Check-in',
    description: 'Greet arriving guests, verify reservations, and complete check-in process.',
    defaultRole: 'receptionist',
    defaultStartTime: '14:00',
    defaultEndTime: '18:00',
    priority: 'high'
  },
  {
    id: 'temp3',
    title: 'Security Rounds',
    description: 'Walk the premises checking all doors and windows are secure.',
    defaultRole: 'nightshift',
    defaultStartTime: '23:00',
    defaultEndTime: '23:30',
    priority: 'high'
  },
  {
    id: 'temp4',
    title: 'Breakfast Preparation',
    description: 'Set up breakfast area, prepare food items, and ensure supplies are stocked.',
    defaultRole: 'host',
    defaultStartTime: '05:30',
    defaultEndTime: '07:00',
    priority: 'medium'
  }
];

const TaskManagementPanel: React.FC<TaskManagementPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskRole, setTaskRole] = useState<string>('receptionist');
  const [taskStartTime, setTaskStartTime] = useState('09:00');
  const [taskEndTime, setTaskEndTime] = useState('10:00');
  const [taskPriority, setTaskPriority] = useState<string>('medium');
  const [taskType, setTaskType] = useState<string>('one-time');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });

  const handleDayToggle = (day: keyof typeof recurringDays) => {
    setRecurringDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleTemplateSelect = (template: TaskTemplateProps) => {
    setTaskTitle(template.title);
    setTaskDescription(template.description);
    setTaskRole(template.defaultRole);
    setTaskStartTime(template.defaultStartTime);
    setTaskEndTime(template.defaultEndTime);
    setTaskPriority(template.priority);
  };

  const handleTaskTypeChange = (value: string) => {
    setTaskType(value);
    setIsRecurring(value === 'recurring');
  };

  const handleCreateTask = () => {
    // Here you would implement the logic to create a new task
    console.log({
      title: taskTitle,
      description: taskDescription,
      role: taskRole,
      startTime: taskStartTime,
      endTime: taskEndTime,
      priority: taskPriority,
      type: taskType,
      recurring: isRecurring ? recurringDays : null
    });
    
    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setTaskRole('receptionist');
    setTaskStartTime('09:00');
    setTaskEndTime('10:00');
    setTaskPriority('medium');
    setTaskType('one-time');
    setIsRecurring(false);
    setRecurringDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    });

    // Show a toast or some feedback that the task was created
  };

  return (
    <Card className="shadow-md border-border/50 backdrop-blur-sm bg-card/80 animate-in slide-in-from-right-10 duration-300">
      <CardHeader className="border-b border-border/20 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-indigo-500">Task Management</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X size={16} />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="create">Create Task</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Assigned Role</Label>
                <Select value={taskRole} onValueChange={setTaskRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                    <SelectItem value="nightshift">Nightshift</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={taskStartTime}
                    onChange={(e) => setTaskStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={taskEndTime}
                    onChange={(e) => setTaskEndTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={taskPriority} onValueChange={setTaskPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="taskType">Task Type</Label>
                <Select value={taskType} onValueChange={handleTaskTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isRecurring && (
                <div className="space-y-2">
                  <Label>Recurring Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(recurringDays).map(([day, isSelected]) => (
                      <Button
                        key={day}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(day as keyof typeof recurringDays)}
                        className="capitalize"
                      >
                        {day.substring(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleCreateTask} 
                className="w-full mt-6"
                disabled={!taskTitle || !taskDescription}
              >
                Create Task
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4 mt-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Select a template to quickly create common tasks</p>
              
              {taskTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{template.title}</h4>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                          {template.defaultRole}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                        <span>{template.defaultStartTime} - {template.defaultEndTime}</span>
                        <span className="capitalize">{template.priority} priority</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                Add New Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskManagementPanel;
