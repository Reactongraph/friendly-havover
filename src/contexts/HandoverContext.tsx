
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HandoverNote, Priority, QAAnnotation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format, isAfter, isEqual, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth';

interface HandoverContextProps {
  notes: HandoverNote[];
  selectedDate: Date;
  showAddNoteForm: boolean;
  isLoading: boolean;
  setShowAddNoteForm: (show: boolean) => void;
  getNotesForDate: (date: Date) => HandoverNote[];
  handleCompleteNote: (noteId: string) => void;
  handleUncompleteNote: (noteId: string) => void;
  handleAddNote: (note: { userId: string; content: string; priority: Priority; date: string }) => void;
  handleEditNote: (updatedNote: HandoverNote) => void;
  handleDeleteNote: (noteId: string) => void;
  handleDateChange: (date: Date) => void;
  handleOpenAddNoteForm: () => void;
  formatDateForDisplay: (date: Date) => string;
  getOverdueNotes: (date: Date) => HandoverNote[];
  formatOriginalDate: (dateString: string) => string;
  handleProcessAINote: (noteId: string) => void;
  handleAddQAAnnotation: (noteId: string, qa: { question: string, answer: string }) => void;
}

const HandoverContext = createContext<HandoverContextProps | undefined>(undefined);

export const HandoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [notes, setNotes] = useState<HandoverNote[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
const {user}=useAuth()
  // Fetch notes from Supabase when the component mounts

  useEffect(() => {
    if (user && user.id) {
      fetchNotes(user.id);
    }
  }, [user?.id]);
  
  const fetchNotes = async (user_id) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('handover_notes')
        .select('*')
        .eq('created_by', user_id); 
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform data from DB to match our HandoverNote type
        const transformedNotes: HandoverNote[] = data.map(note => ({
          id: note.id,
          userId: note.user_id,
          content: note.content,
          priority: note.priority as Priority,
          date: note.date,
          isCompleted: note.is_completed,
          createdAt: note.created_at,
          completedAt: note.completed_at,
          editedAt: note.edited_at,
          qaAnnotations: note.qa_annotations ? note.qa_annotations as QAAnnotation[] : []
        }));
        
        setNotes(transformedNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error fetching notes",
        description: "There was an error loading your notes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clean date and convert to string format for comparison
  const getDateString = (date: Date): string => {
    // Create a clean date string in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Get notes for a specific date
  const getNotesForDate = (date: Date) => {
    const dateString = getDateString(date);
    return notes.filter(note => note.date === dateString);
  };
  
  // Get overdue notes (incomplete notes from previous days)
  const getOverdueNotes = (date: Date) => {
    const dateString = getDateString(date);
    const todayString = getDateString(new Date());
    
    // Only show overdue notes on current or future dates
    if (dateString < todayString) {
      return [];
    }
    
    return notes.filter(note => {
      // Check if note is from a previous date and is not completed
      const noteDate = parseISO(note.date);
      const selectedDate = parseISO(dateString);
      
      return (
        !note.isCompleted && 
        note.date < dateString && 
        (isAfter(selectedDate, noteDate) || isEqual(selectedDate, noteDate))
      );
    });
  };
  
  // Format original date for display in overdue notes
  const formatOriginalDate = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Handlers
  const handleCompleteNote = async (noteId: string) => {
    try {
      const completedAt = new Date().toISOString();
      
      // Update in Supabase
      const { error } = await supabase
        .from('handover_notes')
        .update({
          is_completed: true,
          completed_at: completedAt
        })
        .eq('id', noteId);
        
      if (error) throw error;
      
      // Update local state
      setNotes(prevNotes => prevNotes.map(note => note.id === noteId ? {
        ...note,
        isCompleted: true,
        completedAt
      } : note));
      
      toast({
        title: "Note marked as complete",
        description: "The note has been marked as completed."
      });
    } catch (error) {
      console.error('Error completing note:', error);
      toast({
        title: "Error",
        description: "Failed to mark note as complete.",
        variant: "destructive"
      });
    }
  };

  const handleUncompleteNote = async (noteId: string) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('handover_notes')
        .update({
          is_completed: false,
          completed_at: null
        })
        .eq('id', noteId);
        
      if (error) throw error;
      
      // Update local state
      setNotes(prevNotes => prevNotes.map(note => note.id === noteId ? {
        ...note,
        isCompleted: false,
        completedAt: undefined
      } : note));
      
      toast({
        title: "Completion undone",
        description: "The note has been marked as incomplete."
      });
    } catch (error) {
      console.error('Error uncompleting note:', error);
      toast({
        title: "Error",
        description: "Failed to mark note as incomplete.",
        variant: "destructive"
      });
    }
  };

  const handleAddNote = async ({
    userId,
    content,
    priority,
    date
  }: {
    userId: string;
    content: string;
    priority: Priority;
    date: string;
  }) => {
    try {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      
      const newNote: HandoverNote = {
        id,
        userId,
        content,
        priority,
        date,
        isCompleted: false,
        createdAt
      };
      console.log(newNote,"checking")
      // Insert into Supabase
      const { error } = await supabase
        .from('handover_notes')
        .insert({
          id,
          user_id: userId,
          content,
          priority,
          date,
          is_completed: false,
          created_at: createdAt
        });
        
      if (error) throw error;
      
      // Update local state
      setNotes(prevNotes => [...prevNotes, newNote]);
      setShowAddNoteForm(false);
      
      toast({
        title: "Note added",
        description: "Your note has been successfully added."
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note.",
        variant: "destructive"
      });
    }
  };

  const handleEditNote = async (updatedNote: HandoverNote) => {
    try {
      const editedAt = new Date().toISOString();
      
      // Update in Supabase
      const { error } = await supabase
        .from('handover_notes')
        .update({
          content: updatedNote.content,
          priority: updatedNote.priority,
          date: updatedNote.date,
          edited_at: editedAt
        })
        .eq('id', updatedNote.id);
        
      if (error) throw error;
      
      // Update local state
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === updatedNote.id ? { ...updatedNote, editedAt } : note
      ));
      
      toast({
        title: "Note updated",
        description: "The note has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('handover_notes')
        .delete()
        .eq('id', noteId);
        
      if (error) throw error;
      
      // Update local state
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      toast({
        title: "Note deleted",
        description: "The note has been deleted."
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive"
      });
    }
  };

  const handleOpenAddNoteForm = () => {
    setShowAddNoteForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateChange = (date: Date) => {
    // Ensure date is at midnight
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0, 0, 0
    );
    
    console.log('HandoverContext date change:', {
      currentDate: getDateString(newDate),
      currentDateObjString: newDate.toString(),
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate()
    });
    
    setSelectedDate(newDate);
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const handleProcessAINote = async (noteId: string) => {
    try {
      // Find the note by ID
      const noteToProcess = notes.find(note => note.id === noteId);
      
      if (!noteToProcess) {
        toast({
          title: "Error",
          description: "Note not found.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Processing note for AI comment:', noteToProcess);
      
      // For the demo, we'll create a mock Q&A
      const newQA: QAAnnotation = {
        id: uuidv4(),
        question: noteToProcess.content,
        answer: `This appears to be about ${noteToProcess.content.split(' ').slice(0, 3).join(' ')}. Here's some additional context that might be helpful: ${noteToProcess.content}`,
        createdAt: new Date().toISOString(),
        isAIGenerated: true
      };
      
      // Get current annotations or empty array
      const currentAnnotations = noteToProcess.qaAnnotations || [];
      const updatedAnnotations = [...currentAnnotations, newQA];
      
      // Update in Supabase
      const { error } = await supabase
        .from('handover_notes')
        .update({
          qa_annotations: updatedAnnotations
        })
        .eq('id', noteId);
        
      if (error) throw error;
      
      // Update local state
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === noteId 
          ? { 
              ...note, 
              qaAnnotations: updatedAnnotations
            } 
          : note
      ));
      
      toast({
        title: "AI Comment Generated",
        description: "An AI-generated comment has been added to your note.",
      });
    } catch (error) {
      console.error('Error processing AI note:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI comment.",
        variant: "destructive"
      });
    }
  };
  
  // Handler for adding manual Q&A annotations
  const handleAddQAAnnotation = async (noteId: string, qa: { question: string, answer: string }) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      
      if (!noteToUpdate) {
        toast({
          title: "Error",
          description: "Note not found.",
          variant: "destructive"
        });
        return;
      }
      
      const newQA: QAAnnotation = {
        id: uuidv4(),
        question: qa.question,
        answer: qa.answer,
        createdAt: new Date().toISOString(),
        isAIGenerated: false
      };
      
      // Get current annotations or empty array
      const currentAnnotations = noteToUpdate.qaAnnotations || [];
      const updatedAnnotations = [...currentAnnotations, newQA];
      
      // Update in Supabase
      const { error } = await supabase
        .from('handover_notes')
        .update({
          qa_annotations: updatedAnnotations
        })
        .eq('id', noteId);
        
      if (error) throw error;
      
      // Update local state
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === noteId 
          ? { 
              ...note, 
              qaAnnotations: updatedAnnotations
            } 
          : note
      ));
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the note.",
      });
    } catch (error) {
      console.error('Error adding QA annotation:', error);
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive"
      });
    }
  };

  const value = {
    notes,
    selectedDate,
    showAddNoteForm,
    isLoading,
    setShowAddNoteForm,
    getNotesForDate,
    handleCompleteNote,
    handleUncompleteNote,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleOpenAddNoteForm,
    handleDateChange,
    formatDateForDisplay,
    getOverdueNotes,
    formatOriginalDate,
    handleProcessAINote,
    handleAddQAAnnotation
  };

  return (
    <HandoverContext.Provider value={value}>
      {children}
    </HandoverContext.Provider>
  );
};

export const useHandover = (): HandoverContextProps => {
  const context = useContext(HandoverContext);
  if (context === undefined) {
    throw new Error('useHandover must be used within a HandoverProvider');
  }
  return context;
};
