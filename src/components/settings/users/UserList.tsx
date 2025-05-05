import React from 'react';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserListItem from './UserListItem';
import { IStaff } from '@/contexts/StaffContext';

type TeamMember = Database['public']['Tables']['team_members']['Row'];

interface UserListProps {
  teamMembers: TeamMember[] | IStaff[];
  isLoading: boolean;
  onAddMember: () => void;
  onDeleteMember: (member: TeamMember) => void;
  onEditMember?: (member: TeamMember) => void;
}

const UserList: React.FC<UserListProps> = ({ 
  teamMembers, 
  isLoading,
  onAddMember, 
  onDeleteMember,
  onEditMember 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">All Team Members</h3>
        <Button 
          onClick={onAddMember} 
          className="bg-gradient-to-r from-primary to-indigo-500 hover:opacity-90 group shadow-lg shadow-primary/20"
        >
          <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
          Add Member
        </Button>
      </div>
      
      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <UserListItem 
            key={member.id}
            member={member}
            onDelete={onDeleteMember}
            onEdit={onEditMember || (() => {})}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default UserList;
