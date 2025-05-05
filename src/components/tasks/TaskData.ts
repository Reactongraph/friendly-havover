
import { Task } from '@/types';

// Mock tasks data with hourly time blocks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Start the day - Handover, Music, Candles, Fireplace',
    description: 'Get the lobby ready for guests with proper ambiance',
    role: 'receptionist',
    start_time: '07:00:00',
    end_time: '08:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Go through arrival list for the day, Inform housekeeping',
    description: 'Check all arriving guests and make sure rooms are ready',
    role: 'receptionist',
    start_time: '07:00:00',
    end_time: '08:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Charge Pre-Paid Expedia bookings',
    description: 'Process all pre-paid Expedia reservations',
    role: 'receptionist',
    start_time: '08:00:00',
    end_time: '09:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Check events for conferences today',
    description: 'Review all scheduled events and prepare accordingly',
    role: 'host',
    start_time: '08:00:00',
    end_time: '09:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Talk with the kitchen about details and program for the day',
    description: 'Coordinate with kitchen staff about meal plans',
    role: 'host',
    start_time: '08:00:00',
    end_time: '09:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'medium'
  },
  {
    id: '6',
    title: 'Read latest News with Recap',
    description: 'Stay updated on current events to inform guests if asked',
    role: 'receptionist',
    start_time: '08:00:00',
    end_time: '09:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'low'
  },
  {
    id: '7',
    title: 'Change table lights with the ones charging',
    description: 'Ensure all table lights are functional',
    role: 'host',
    start_time: '10:00:00',
    end_time: '12:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'medium'
  },
  {
    id: '8',
    title: 'Prepare Kiosk. Is the bar ready for the evening? Refill',
    description: 'Stock the bar for evening service',
    role: 'host',
    start_time: '10:00:00',
    end_time: '12:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'high'
  },
  {
    id: '9',
    title: 'Put menu cards out on all the tables',
    description: 'Ensure all tables have current menus',
    role: 'host',
    start_time: '10:00:00',
    end_time: '12:00:00',
    status: 'pending',
    type: 'recurring',
    priority: 'medium'
  },
  {
    id: '10',
    title: 'Mid-day update. Is the early-check-in-rooms ready? Has everybody checked out?',
    description: 'Coordinate with housekeeping about room status',
    role: 'receptionist',
    start_time: '12:15:00',
    end_time: '12:30:00',
    status: 'pending',
    type: 'recurring',
    priority: 'high'
  },
  {
    id: '11',
    title: 'Reply to reviews via Trust you',
    description: 'Respond to guest reviews online',
    role: 'receptionist',
    start_time: '13:00:00',
    end_time: '14:30:00',
    status: 'pending',
    type: 'recurring',
    priority: 'medium'
  },
  {
    id: '12',
    title: 'Allocate rooms for tomorrow',
    description: 'Assign rooms for upcoming arrivals',
    role: 'receptionist',
    start_time: '13:00:00',
    end_time: '14:30:00',
    status: 'pending',
    type: 'recurring',
    priority: 'high'
  }
];

// Group tasks by time
export const groupTasksByTime = (tasks: Task[]) => {
  const groupedTasks: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    // Format the time strings directly without trying to convert to Date objects
    const startTimeFormatted = task.start_time.substring(0, 5); // Extract HH:MM from HH:MM:SS
    const endTimeFormatted = task.end_time.substring(0, 5);     // Extract HH:MM from HH:MM:SS
    
    const timeKey = `${startTimeFormatted} – ${endTimeFormatted}`;
    
    if (!groupedTasks[timeKey]) {
      groupedTasks[timeKey] = [];
    }
    groupedTasks[timeKey].push(task);
  });

  // Sort time blocks chronologically
  const sortedTimeBlocks = Object.keys(groupedTasks).sort((a, b) => {
    const timeA = a.split(' – ')[0];
    const timeB = b.split(' – ')[0];
    return timeA.localeCompare(timeB);
  });

  return { groupedTasks, sortedTimeBlocks };
};
