
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface UserEmojiPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const COMMON_EMOJIS = [
  '👤', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🍳', '👨‍🍳', '👩‍🏫', '👨‍🏫',
  '👸', '🤴', '👷‍♀️', '👷‍♂️', '👩‍⚕️', '👨‍⚕️', '👮‍♀️', '👮‍♂️', '🧝‍♀️', '🧝‍♂️',
  '🧙‍♀️', '🧙‍♂️', '🦸‍♀️', '🦸‍♂️', '🦹‍♀️', '🦹‍♂️', '🧚‍♀️', '🧚‍♂️', '😊', '😎',
  '🤩', '😇', '🤓', '🥳', '😺', '🐱', '🐶', '🦊', '🦁', '🐯', '🐻', '🐼', '🐨',
];

const UserEmojiPicker: React.FC<UserEmojiPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(value || '👤');

  // Update the internal state when the prop changes
  useEffect(() => {
    console.log("UserEmojiPicker received value:", value);
    setSelectedEmoji(value || '👤');
  }, [value]);

  const handleEmojiSelect = (emoji: string) => {
    console.log("Emoji selected in picker:", emoji);
    setSelectedEmoji(emoji);
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-sm font-medium text-muted-foreground">User Avatar</div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-16 h-16 rounded-full text-3xl bg-secondary/50 border-2 border-primary/30 hover:border-primary/50 hover:bg-secondary/70 transition-all"
            onClick={() => console.log("Emoji button clicked, current value:", selectedEmoji)}
          >
            {selectedEmoji}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 p-2 bg-background/95 backdrop-blur-xl border border-primary/20"
          align="center"
        >
          <div className="space-y-2">
            <p className="text-sm text-center font-medium mb-2">Select an emoji</p>
            <div className="grid grid-cols-6 gap-2">
              {COMMON_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant="ghost"
                  className={`h-10 w-10 p-0 rounded-md ${selectedEmoji === emoji ? 'bg-primary/20 border border-primary/40' : 'hover:bg-secondary/60'}`}
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserEmojiPicker;
