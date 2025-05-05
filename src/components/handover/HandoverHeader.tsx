import React from 'react';
import DateNavigation from '../common/DateNavigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
interface HandoverHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddNote: () => void;
}
const HandoverHeader: React.FC<HandoverHeaderProps> = ({
  selectedDate,
  onDateChange,
  onAddNote
}) => {
  // Format the date as YYYY-MM-DD without timezone issues
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const formattedDate = formatDateString(selectedDate);

  // Handle date change from DateNavigation
  const handleDateSelection = (dateString: string) => {
    // Parse the string date into a Date object
    const [year, month, day] = dateString.split('-').map(Number);

    // Create date at midnight to avoid timezone issues
    const newDate = new Date(year, month - 1, day, 0, 0, 0);
    console.log('HandoverHeader date change:', {
      dateString,
      newDate: newDate.toString(),
      year,
      month,
      day
    });
    onDateChange(newDate);
  };
  return <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 space-y-4 md:space-y-0 relative p-6 rounded-xl overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 dark:opacity-20 animate-gradient-x"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      <div className="animate-fade-in relative z-10" style={{
      animationDelay: '0.1s'
    }}>
        <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-purple-600 via-violet-500 to-purple-700 bg-clip-text text-transparent">Handover</h1>
        <p className="text-muted-foreground mt-1">Exchange information between shifts</p>
      </div>
      
      <div className="flex items-center space-x-3 relative z-10">
        <DateNavigation currentDate={formattedDate} onDateChange={handleDateSelection} />
        
        <Button onClick={onAddNote} size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> Add Note
        </Button>
      </div>
    </div>;
};
export default HandoverHeader;