import React from "react";
import { HandoverNote } from "@/types";
import NoteCard from "./NoteCard";
import { ClipboardList, Clock } from "lucide-react";
import { useHandover } from "@/contexts/HandoverContext";
import { useTeamMembers } from "@/hooks/useTeamMembers";

interface HandoverNotesProps {
  notes: HandoverNote[];
  selectedDate: Date;
}

const HandoverNotes: React.FC<HandoverNotesProps> = ({
  notes,
  selectedDate,
}) => {
  const {
    handleCompleteNote,
    handleUncompleteNote,
    handleEditNote,
    handleDeleteNote,
    handleProcessAINote,
    handleAddQAAnnotation,
    formatDateForDisplay,
    getOverdueNotes,
    formatOriginalDate,
  } = useHandover();

  const { teamMembers } = useTeamMembers();

  const getUserById = (userId: string) => {
    console.log(userId,"userid")
    if (!teamMembers || teamMembers.length === 0) return null;
    return teamMembers.find((member) => member.id === userId) || null;
  };

  const overdueNotes = getOverdueNotes(selectedDate);
  const hasOverdueNotes = overdueNotes.length > 0;
  const formattedSelectedDay = formatDateForDisplay(selectedDate);
  const totalNotes = notes.length + overdueNotes.length;

  return (
    <div className="handover-section mb-10">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <ClipboardList size={18} />
        </div>
        <h2 className="font-semibold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent text-2xl">
          Notes for {formattedSelectedDay}
        </h2>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {totalNotes} {totalNotes === 1 ? "note" : "notes"} for this day
        {hasOverdueNotes && ` (including ${overdueNotes.length} overdue)`}
      </div>

      {hasOverdueNotes && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock size={14} />
            </div>
            <h3 className="font-medium text-amber-600 dark:text-amber-400">
              Overdue Notes
            </h3>
          </div>
          <div className="space-y-4">
            {overdueNotes.map((note, index) => (
              <NoteCard
                key={`overdue-${note.id}`}
                note={{
                  ...note,
                  content: `[Overdue from ${formatOriginalDate(note.date)}] ${
                    note.content
                  }`,
                }}
                user={getUserById(note.userId)}
                index={index}
                isOverdue={true}
                onComplete={handleCompleteNote}
                onUncomplete={handleUncompleteNote}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onAIProcess={handleProcessAINote}
                onAddQAAnnotation={handleAddQAAnnotation}
              />
            ))}
          </div>
        </div>
      )}

      {!hasOverdueNotes && totalNotes === 0 ? (
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-lg p-8 text-center border border-blue-100 dark:border-blue-800/30 transition-all duration-300">
          <p className="text-muted-foreground">
            No notes for {formattedSelectedDay}
          </p>
        </div>
      ) : (
        <>
          {notes.length > 0 && (
            <div className="space-y-4">
              {notes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  user={getUserById(note.userId)}
                  index={index}
                  onComplete={handleCompleteNote}
                  onUncomplete={handleUncompleteNote}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onAIProcess={handleProcessAINote}
                  onAddQAAnnotation={handleAddQAAnnotation}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HandoverNotes;
