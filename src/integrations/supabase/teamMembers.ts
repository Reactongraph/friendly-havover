import { supabase } from "./client";
import type { Tables } from "./types";

// Create Staff
export const createTeamMember = async (
  authUserId: string,
  name: string,
  role: string = "member",
  emoji: string = "👤"
) => {
  const { data, error } = await supabase
    .from("team_members")
    .insert([
      {
        auth_user_id: authUserId,
        name,
        role,
        avatar_type: emoji,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Tables<"team_members">;
};

// Read Staff
export const fetchTeamMembers = async (authUserId: string) => {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("auth_user_id", authUserId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Tables<"team_members">[];
};

// Update Staff
export const updateTeamMember = async (
  authUserId: string,
  memberId: string,
  name: string,
  role: string,
  emoji: string
) => {
  const { data, error } = await supabase
    .from("team_members")
    .update({
      name,
      role,
      avatar_type: emoji,
      updated_at: new Date().toISOString(),
    })
    .eq("id", memberId)
    .eq("auth_user_id", authUserId)
    .select()
    .single();

  if (error) throw error;
  return data as Tables<"team_members">;
};

// Delete Staff
export const deleteTeamMember = async (
  authUserId: string,
  memberId: string
) => {
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId)
    .eq("auth_user_id", authUserId);

  if (error) throw error;
  return true;
};
