export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      account_users: {
        Row: {
          account_id: string
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_users_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          account_id: string
          created_at: string
          description: string | null
          id: number
          name: string
          ordering: number | null
          parent_id: number | null
          updated_at: string
        }
        Insert: {
          account_id?: string
          created_at?: string
          description?: string | null
          id?: number
          name: string
          ordering?: number | null
          parent_id?: number | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          ordering?: number | null
          parent_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      handover_notes: {
        Row: {
          completed_at: string | null
          content: string
          created_at: string
          date: string
          edited_at: string | null
          id: string
          is_completed: boolean
          priority: string
          qa_annotations: Json | null
          user_id: string
          created_by:string
        }
        Insert: {
          completed_at?: string | null
          content: string
          created_at?: string
          date: string
          edited_at?: string | null
          id?: string
          is_completed?: boolean
          priority: string
          qa_annotations?: Json | null
          user_id: string
          // created_by:string
        }
        Update: {
          completed_at?: string | null
          content?: string
          created_at?: string
          date?: string
          edited_at?: string | null
          id?: string
          is_completed?: boolean
          priority?: string
          qa_annotations?: Json | null
          user_id?: string
          // created_by:string
        }
        Relationships: []
      }
      knowledge_entries: {
        Row: {
          account_id: string
          category_id: number | null
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          account_id: string
          category_id?: number | null
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          category_id?: number | null
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_entries_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          account_id: string
          created_at: string
          description: string | null
          floor: string | null
          id: string
          name: string
          room_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          description?: string | null
          floor?: string | null
          id?: string
          name: string
          room_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          description?: string | null
          floor?: string | null
          id?: string
          name?: string
          room_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string
          end_time: string
          id: string
          priority: string
          reason: string | null
          recurring_days: Json | null
          role: string
          start_time: string
          status: string
          task_date: string | null
          title: string
          type: string
          created_by:string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_time: string
          id?: string
          priority: string
          reason?: string | null
          recurring_days?: Json | null
          role: string
          start_time: string
          status?: string
          task_date?: string | null
          title: string
          type: string

          // created_by:string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_time?: string
          id?: string
          priority?: string
          reason?: string | null
          recurring_days?: Json | null
          role?: string
          start_time?: string
          status?: string
          task_date?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          avatar_type: string;
          auth_user_id: string;
          created_at: string;
          updated_at: string;
        };
        
        Insert: {
          id?: string;
          name: string;
          role: string;
          avatar_type: string;
          auth_user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        
        Update: {
          id?: string;
          name?: string;
          role?: string;
          avatar_type?: string;
          auth_user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        
        Relationships: [
          {
            foreignKeyName: "team_members_auth_user_id_fkey";
            columns: ["auth_user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_claims: {
        Args: {
          jwt: Json
        }
        Returns: Json
      }
      get_primary_account_id: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      get_user_account_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      is_account_admin: {
        Args: {
          check_account_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
