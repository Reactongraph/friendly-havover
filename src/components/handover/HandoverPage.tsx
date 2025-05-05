import React from "react";
import { HandoverProvider } from "@/contexts/HandoverContext";
import HandoverHeader from "./HandoverHeader";
import HandoverNotes from "./HandoverNotes";
import AddNoteSection from "./AddNoteSection";
import QuickAddNote from "./QuickAddNote";
import { useHandover } from "@/contexts/HandoverContext";
import { useAuth } from "@/contexts/auth";
import { User } from "@/types";
import { mockUsers } from "@/data/mockData";
import { Skeleton } from "@/components/ui/skeleton";

// Loading state component
const HandoverLoading = () => (
  <div className="space-y-8 mt-4">
    <div className="space-y-2">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-8 w-24" />
    </div>

    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  </div>
);

// This component uses the context values provided by HandoverProvider
const HandoverContent = () => {
  const {
    selectedDate,
    handleDateChange,
    handleOpenAddNoteForm,
    showAddNoteForm,
    getNotesForDate,
    isLoading,
  } = useHandover();
  const { currentAccount } = useAuth();

  // Get the notes for the selected day
  const notesForSelectedDate = getNotesForDate(selectedDate);

  return (
    <div className="max-w-5xl mx-auto">
      <HandoverHeader
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onAddNote={handleOpenAddNoteForm}
      />

      <div className="space-y-10">
        {/* Form for adding new notes */}
        <AddNoteSection />

        {/* Show loading state or notes */}
        {isLoading ? (
          <HandoverLoading />
        ) : (
          <>
            {/* Notes for the selected date */}
            <HandoverNotes
              notes={notesForSelectedDate}
              selectedDate={selectedDate}
            />

            {/* Quick add note form if not already showing the main form */}
            {!showAddNoteForm && notesForSelectedDate.length === 0 && (
              <QuickAddNote />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// This is the main component that wraps everything with the provider
const HandoverPage: React.FC = () => {
  return (
    <HandoverProvider>
      <HandoverContent />
    </HandoverProvider>
  );
};

export default HandoverPage;
