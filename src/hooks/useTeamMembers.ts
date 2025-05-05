import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchTeamMembers } from "@/integrations/supabase/teamMembers";
import { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/auth";

export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

export function useTeamMembers() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const initialSelectedUserId = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedUserId");
    }
    return null;
  }, []);

  const [userSelected, setUserSelected] = useState<string | null>(initialSelectedUserId);

  // Extracted loading logic into a reusable function
  const refetchTeamMembers = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const members = await fetchTeamMembers(user.id);
      setTeamMembers(members);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refetchTeamMembers();
  }, [refetchTeamMembers]);

  const currentUser = useMemo(() => {
    return teamMembers.find((u) => u.id === userSelected) || teamMembers[0];
  }, [teamMembers, userSelected]);
useEffect(()=>{
  console.log(userSelected,">>>>>>>>>>>>>>>>>")
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  userSelected
},[])
  const changeUser = useCallback((id: string) => {
  console.log("clicked")
    setUserSelected(id);
    console.log(id,"checking staff id ")
    localStorage.setItem("selectedUserId", id);
  }, []);

  return {
    teamMembers,
    currentUser,
    userSelected,
    changeUser,
    loading,
    refetchTeamMembers,
  };
}
