import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import UserForm from "@/components/users/UserForm";
import UserList from "./users/UserList";
import DeleteUserDialog from "./users/DeleteUserDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/useAuthContext";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/integrations/supabase/teamMembers";
import { useTeamMembers } from "@/hooks/useTeamMembers";

type FormData = {
  id?: string;
  name: string;
  role: string;
  emoji: string;
};

const UserSection: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    teamMembers,
    refetchTeamMembers,
  } = useTeamMembers();

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<
    (typeof teamMembers)[0] | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<
    (typeof teamMembers)[0] | null
  >(null);

  const showToast = (description: string, type: "success" | "error") => {
    toast({
      title: type === "success" ? "Success" : "Error",
      description,
      variant: type === "error" ? "destructive" : undefined,
    });
  };

  const openUserForm = (member?: (typeof teamMembers)[0]) => {
    setEditingMember(member ?? null);
    setIsUserFormOpen(true);
  };

  const closeUserForm = () => {
    setIsUserFormOpen(false);
    setEditingMember(null);
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!user?.id) return;

    const isEdit = !!data.id;

    try {
      if (isEdit) {
        await updateTeamMember(
          user.id,
          data.id!,
          data.name,
          data.role,
          data.emoji
        );
      } else {
        await createTeamMember(user.id, data.name, data.role, data.emoji);
      }

      await refetchTeamMembers();

      showToast(
        `${data.name} has been ${isEdit ? "updated" : "added"} successfully`,
        "success"
      );
      closeUserForm();
    } catch {
      showToast(
        `Failed to ${isEdit ? "update" : "create"} team member`,
        "error"
      );
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete || !user?.id) return;

    try {
      await deleteTeamMember(user.id, memberToDelete.id);
      await refetchTeamMembers();

      showToast(
        `${memberToDelete.name} has been removed successfully`,
        "success"
      );
    } catch {
      showToast("Failed to delete team member", "error");
    } finally {
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  return (
    <>
      <Card className="border-border/50 backdrop-blur-sm bg-card/80 hover:shadow-md transition-all duration-300">
        <CardHeader className="border-b border-border/20">
          <CardTitle className="text-xl text-indigo-500 flex items-center">
            <UserPlus className="mr-2 h-5 w-5 text-primary" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage your team members. Add or remove team members.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <UserList
            teamMembers={teamMembers}
            isLoading={false}
            onAddMember={() => openUserForm()}
            onDeleteMember={(member) => {
              setMemberToDelete(member);
              setIsDeleteDialogOpen(true);
            }}
            onEditMember={openUserForm}
          />
        </CardContent>
      </Card>

      <Sheet open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto border-l border-primary/20 bg-background/95 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-indigo-500/5 pointer-events-none" />
          <SheetHeader>
            <SheetTitle className="text-xl bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </SheetTitle>
            <SheetDescription>
              {editingMember
                ? "Update team member information"
                : "Create a new team member"}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 relative z-10">
            <UserForm
              defaultValues={
                editingMember
                  ? {
                      id: editingMember.id,
                      name: editingMember.name,
                      role: editingMember.role,
                      emoji: editingMember.avatar_type,
                    }
                  : undefined
              }
              onSubmit={handleFormSubmit}
              onCancel={closeUserForm}
              isEditing={!!editingMember}
            />
          </div>
        </SheetContent>
      </Sheet>

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDeleteMember}
        userName={memberToDelete?.name || "this member"}
      />
    </>
  );
};

export default UserSection;
