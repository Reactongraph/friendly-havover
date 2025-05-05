
import React from 'react';
import { Button } from '@/components/ui/button';
import { useHandover } from '@/contexts/HandoverContext';

const QuickAddNote: React.FC = () => {
  const { handleOpenAddNoteForm, selectedDate, formatDateForDisplay } = useHandover();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-lg p-8 text-center border border-blue-100 dark:border-blue-800/30 transition-all duration-300">
      <Button 
        onClick={handleOpenAddNoteForm}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
      >
       
        <span className="ml-1 text-lg">Add a note for {formatDateForDisplay(selectedDate)}</span> 
      </Button>
    </div>
  );
};

export default QuickAddNote;
