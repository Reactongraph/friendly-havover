import React from 'react';
import { Button } from '@/components/ui/button';
import { addDays, format, subDays, isToday, isTomorrow } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface DateNavigationProps {
  currentDate: string;
  onDateChange: (date: string) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  currentDate,
  onDateChange
}) => {
  // Create a date object from YYYY-MM-DD string without timezone issues
  const parseISODate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date with midnight time to avoid any timezone shifts
    const date = new Date(year, month - 1, day, 0, 0, 0);
    return date;
  };
  
  const currentDateObj = parseISODate(currentDate);
  
  // Create today's date with midnight time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = addDays(today, 1);
  
  const getDateCategory = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (date < today) return 'Past';
    return 'Future';
  };
  
  const dateCategory = getDateCategory(currentDateObj);
  
  const goToPreviousDay = () => {
    const newDate = subDays(currentDateObj, 1);
    onDateChange(formatISODate(newDate));
  };

  const goToNextDay = () => {
    const newDate = addDays(currentDateObj, 1);
    onDateChange(formatISODate(newDate));
  };

  // Custom format function to ensure consistent date strings
  const formatISODate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    // Create a clean date string directly from the date components
    // This avoids any timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log('Calendar selection:', {
      originalDate: date.toString(),
      formattedDate,
      year, month, day
    });
    
    onDateChange(formattedDate);
  };

  // Determine colors based on date category
  const getCategoryStyles = (category: string) => {
    switch(category) {
      case 'Today':
        return {
          bg: "from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20",
          border: "border-indigo-100/70 dark:border-indigo-800/30",
          text: "text-indigo-600 dark:text-indigo-400",
          icon: "text-indigo-500"
        };
      case 'Tomorrow':
        return {
          bg: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20", 
          border: "border-blue-100/70 dark:border-blue-800/30",
          text: "text-blue-600 dark:text-blue-400",
          icon: "text-blue-500"
        };
      case 'Past':
        return {
          bg: "from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20",
          border: "border-gray-100/70 dark:border-gray-800/30",
          text: "text-gray-600 dark:text-gray-400",
          icon: "text-gray-500"
        };
      case 'Future':
        return {
          bg: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
          border: "border-purple-100/70 dark:border-purple-800/30",
          text: "text-purple-600 dark:text-purple-400",
          icon: "text-purple-500"
        };
      default:
        return {
          bg: "from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20",
          border: "border-indigo-100/70 dark:border-indigo-800/30",
          text: "text-indigo-600 dark:text-indigo-400",
          icon: "text-indigo-500"
        };
    }
  };
  
  const styles = getCategoryStyles(dateCategory);

  // Get day of week
  const dayOfWeek = format(currentDateObj, 'EEEE');

  // Debug log to show what's happening
  console.log('DateNavigation:', {
    currentDate,
    currentDateObjString: currentDateObj.toString(),
    year: currentDateObj.getFullYear(),
    month: currentDateObj.getMonth() + 1,
    day: currentDateObj.getDate(),
    category: dateCategory
  });

  return (
    <div className="date-navigation flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={goToPreviousDay} className="h-10 w-10 rounded-full border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn(
            `bg-gradient-to-r ${styles.bg} ${styles.border} rounded-full px-4 py-2 h-10 flex items-center cursor-pointer hover:border-indigo-200 transition-colors`
          )}>
            <Calendar className={cn(
              "h-5 w-5 mr-2",
              styles.icon
            )} />
            <span className={cn(
              "text-sm font-medium", 
              styles.text
            )}>
              <span className="font-semibold">{dayOfWeek}</span> - {format(currentDateObj, 'MMMM d, yyyy')} {`(${dateCategory})`}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover" align="center">
          <CalendarComponent 
            mode="single" 
            selected={currentDateObj}
            onSelect={handleSelectDate}
            initialFocus
            className="rounded-md border pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <Button variant="outline" size="sm" onClick={goToNextDay} className="h-10 w-10 rounded-full border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default DateNavigation;
