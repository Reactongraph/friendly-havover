import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Priority, User } from "@/types";
import { Flag, Sparkles } from "lucide-react";
import { DatePicker } from "../common/DatePicker";
import { useTeamMembers } from "@/hooks/useTeamMembers";

interface AddNoteFormProps {
  targetDate: Date;
  currentUser: User;
  onAddNote: (note: {
    userId: string;
    content: string;
    priority: Priority;
    date: string;
  }) => void;
  onDateChange?: (date: Date) => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({
  targetDate,
  currentUser,
  onAddNote,
  onDateChange,
}) => {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [selectedDate, setSelectedDate] = useState<Date>(targetDate);

  const { userSelected } = useTeamMembers();
console.log(userSelected,"userselected")
  // Update internal state when prop changes
  useEffect(() => {
    // Create a clean date without time components
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const day = targetDate.getDate();
    const cleanDate = new Date(year, month, day, 0, 0, 0);
    setSelectedDate(cleanDate);
  }, [targetDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Create a clean date string in YYYY-MM-DD format
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    onAddNote({
      userId: userSelected,
      content: content.trim(),
      priority,
      date: dateString,
    });

    // Reset form
    setContent("");
    setPriority("medium");
  };

  const handleDateChange = (date: Date) => {
    console.log("AddNoteForm date change:", {
      original: date.toString(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });

    setSelectedDate(date);

    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Text area - give it more space and make it more prominent */}
      <div className="flex flex-col w-full">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="min-h-[200px] md:min-h-[250px] w-full bg-white/90 dark:bg-gray-950/80 resize-none border-indigo-100 dark:border-indigo-800/40 shadow-inner focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-500"
        />
      </div>

      {/* Form controls organized in a more responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Date picker - 1 column on small, 5 on large */}
        <div className="sm:col-span-1 lg:col-span-5 bg-white/70 dark:bg-gray-900/40 rounded-lg p-2 border border-indigo-100/70 dark:border-indigo-800/30 shadow-sm">
          <DatePicker
            date={selectedDate}
            onDateChange={handleDateChange}
            className="w-full bg-white/80 dark:bg-gray-900/70 border-indigo-100 dark:border-indigo-800/40 text-sm h-9"
          />
        </div>

        {/* Priority selector - takes full width on mobile, 5 columns on large */}
        <div className="sm:col-span-2 lg:col-span-5 bg-white/70 dark:bg-gray-900/40 rounded-lg p-2 border border-indigo-100/70 dark:border-indigo-800/30 shadow-sm flex items-center">
          <Flag className="h-4 w-4 text-indigo-500 mx-1 shrink-0" />
          <div className="flex gap-1 flex-1">
            <Button
              type="button"
              size="sm"
              variant={priority === "low" ? "default" : "outline"}
              className={`flex-1 text-xs ${
                priority === "low"
                  ? "bg-green-500 hover:bg-green-600 shadow-md"
                  : "hover:border-green-500 hover:text-green-500 border-green-200 dark:border-green-900/50"
              }`}
              onClick={() => setPriority("low")}
            >
              Low
            </Button>
            <Button
              type="button"
              size="sm"
              variant={priority === "medium" ? "default" : "outline"}
              className={`flex-1 text-xs ${
                priority === "medium"
                  ? "bg-amber-500 hover:bg-amber-600 shadow-md"
                  : "hover:border-amber-500 hover:text-amber-500 border-amber-200 dark:border-amber-900/50"
              }`}
              onClick={() => setPriority("medium")}
            >
              Med
            </Button>
            <Button
              type="button"
              size="sm"
              variant={priority === "high" ? "default" : "outline"}
              className={`flex-1 text-xs ${
                priority === "high"
                  ? "bg-red-500 hover:bg-red-600 shadow-md"
                  : "hover:border-red-500 hover:text-red-500 border-red-200 dark:border-red-900/50"
              }`}
              onClick={() => setPriority("high")}
            >
              High
            </Button>
          </div>
        </div>

        {/* Submit button - takes full width on small, 2 columns on large */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Button
            type="submit"
            className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
            disabled={!content.trim()}
          >
            <Sparkles className="h-4 w-4" />
            <span className="ml-1 text-lg">Add</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddNoteForm;
