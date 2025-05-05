
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import AddNoteForm from './AddNoteForm';
import { useHandover } from '@/contexts/HandoverContext';
import { getActiveUser } from '@/data/mockData';

const AddNoteSection: React.FC = () => {
  const { 
    showAddNoteForm, 
    setShowAddNoteForm, 
    selectedDate, 
    handleAddNote, 
    handleDateChange,
    formatDateForDisplay
  } = useHandover();
  
  const activeUser = getActiveUser();

  if (!showAddNoteForm) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 rounded-xl p-4 sm:p-6 border border-indigo-200/50 dark:border-indigo-700/30 shadow-lg mb-8 animate-scale-in relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzODJiNWYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnYtMm0tMTAtOGgydjJoLTJ2LTJtNCAwaDF2MmgtMXYtMm0tOCAwaDF2MmgtMXYtMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 dark:opacity-10"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center">
            <span className="mr-2">✨</span>
            Add Note for {formatDateForDisplay(selectedDate)}
          </h2>
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={() => setShowAddNoteForm(false)} 
            aria-label="Close form" 
            className="shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 w-8 h-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 sm:p-5 shadow-sm border border-indigo-100/80 dark:border-indigo-800/30 relative">
          <AddNoteForm 
            targetDate={selectedDate} 
            currentUser={activeUser} 
            onAddNote={handleAddNote} 
            onDateChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AddNoteSection;
