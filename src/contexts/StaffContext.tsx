import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface IStaff {
  avatar_type: string;
  id: number;
  name: string;
  email?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface StaffContextType {
  staffMembers: IStaff[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  fetchStaffMembers: () => Promise<void>;
  createStaff: (
    staff: Omit<IStaff, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateStaff: (staff: Partial<IStaff> & { id: number }) => Promise<void>;
  deleteStaff: (id: number) => Promise<void>;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const useStaffContext = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaffContext must be used within a StaffProvider");
  }
  return context;
};

interface StaffProviderProps {
  children: ReactNode;
}

export const StaffProvider: React.FC<StaffProviderProps> = ({ children }) => {
  const [staffMembers, setStaffMembers] = useState<IStaff[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStaffMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setStaffMembers(data as unknown as IStaff[]);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to fetch staff members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const createStaff = async (
    staff: Omit<IStaff, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .insert(staff as any)
        .single();
      if (error) throw error;
      const newStaffMember = data as IStaff;
      setStaffMembers((prev) =>
        prev ? [...prev, newStaffMember] : [newStaffMember]
      );
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add staff member: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const updateStaff = async (
    staff: Partial<IStaff> & { id: number | string }
  ) => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .update(staff as any)
        .eq("id", staff.id as unknown as string)
        .single();

      if (error) throw error;
      if (data) {
        const updatedStaff = data as IStaff;
        setStaffMembers((prev) =>
          prev
            ? prev.map((item) =>
                item.id === staff.id ? { ...item, ...updatedStaff } : item
              )
            : [updatedStaff]
        );
      }
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update staff member: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const deleteStaff = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id as unknown as string);
      if (error) throw error;
      const numericId = Number(id);
      setStaffMembers((prev) => prev?.filter((item) => item.id !== numericId));
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete staff member: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const value: StaffContextType = {
    staffMembers,
    isLoading,
    isError,
    error,
    fetchStaffMembers,
    createStaff,
    updateStaff,
    deleteStaff,
  };

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
};

export default StaffProvider;
