import React from 'react';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import UserAvatar from '@/components/common/UserAvatar';

type TeamMember = Database['public']['Tables']['team_members']['Row'];

interface UserListItemProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  index: number;
}

const UserListItem: React.FC<UserListItemProps> = ({ 
  member, 
  onEdit,
  onDelete,
  index
}) => {
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/40 transition-all"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: "translateY(0)",
        opacity: 1,
        transition: "all 0.3s ease" 
      }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <UserAvatar user={member} />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-card"></span>
        </div>
        <div>
          <h4 className="font-medium">{member.name}</h4>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="border-primary/30 hover:border-primary hover:bg-primary/5 backdrop-blur-sm transition-all duration-300"
          onClick={() => onEdit(member)}
        >
          <Pencil size={14} className="mr-1" />
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-destructive border-destructive/30 hover:border-destructive/70 hover:bg-destructive/5 transition-all duration-300"
          onClick={() => onDelete(member)}
        >
          <Trash2 size={14} className="mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default UserListItem;
