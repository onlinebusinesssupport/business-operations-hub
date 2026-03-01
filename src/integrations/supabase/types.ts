export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          client_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          client_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          client_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          admin_notes: string | null
          areas_of_support: string[] | null
          business_name: string
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          industry: string | null
          intent: string | null
          pain_points: string | null
          primary_channel: string | null
          revenue_range: string | null
          status: string
          team_size: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          admin_notes?: string | null
          areas_of_support?: string[] | null
          business_name: string
          country?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          industry?: string | null
          intent?: string | null
          pain_points?: string | null
          primary_channel?: string | null
          revenue_range?: string | null
          status?: string
          team_size?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          admin_notes?: string | null
          areas_of_support?: string[] | null
          business_name?: string
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          industry?: string | null
          intent?: string | null
          pain_points?: string | null
          primary_channel?: string | null
          revenue_range?: string | null
          status?: string
          team_size?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          account_owner: string | null
          avg_review_score: number | null
          contact_profile_id: string | null
          contract_renewal_date: string | null
          created_at: string
          health_score: number | null
          id: string
          last_activity_at: string | null
          lead_score: number | null
          lead_source: string | null
          lead_tags: string[] | null
          lifecycle_stage: string | null
          lifetime_revenue: number | null
          linkedin_url: string | null
          monthly_rate: number | null
          name: string
          notes: string | null
          nps_score: number | null
          retainer_limit: number
          retainer_used: number
          review_count: number | null
          services: string[] | null
          status: string
          subscription_status: string
          tier: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          account_owner?: string | null
          avg_review_score?: number | null
          contact_profile_id?: string | null
          contract_renewal_date?: string | null
          created_at?: string
          health_score?: number | null
          id?: string
          last_activity_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_tags?: string[] | null
          lifecycle_stage?: string | null
          lifetime_revenue?: number | null
          linkedin_url?: string | null
          monthly_rate?: number | null
          name: string
          notes?: string | null
          nps_score?: number | null
          retainer_limit?: number
          retainer_used?: number
          review_count?: number | null
          services?: string[] | null
          status?: string
          subscription_status?: string
          tier?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          account_owner?: string | null
          avg_review_score?: number | null
          contact_profile_id?: string | null
          contract_renewal_date?: string | null
          created_at?: string
          health_score?: number | null
          id?: string
          last_activity_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_tags?: string[] | null
          lifecycle_stage?: string | null
          lifetime_revenue?: number | null
          linkedin_url?: string | null
          monthly_rate?: number | null
          name?: string
          notes?: string | null
          nps_score?: number | null
          retainer_limit?: number
          retainer_used?: number
          review_count?: number | null
          services?: string[] | null
          status?: string
          subscription_status?: string
          tier?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_contact_profile_id_fkey"
            columns: ["contact_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          company: string | null
          connect_preference: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          service_interest: string | null
          website: string | null
        }
        Insert: {
          company?: string | null
          connect_preference?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          service_interest?: string | null
          website?: string | null
        }
        Update: {
          company?: string | null
          connect_preference?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          service_interest?: string | null
          website?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          client_id: string
          created_at: string
          file_url: string | null
          id: string
          name: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          client_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          name: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          client_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          name?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          currency: string
          description: string | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string | null
          paid_date: string | null
          services: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          paid_date?: string | null
          services?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          paid_date?: string | null
          services?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          industry: string | null
          onboarding_completed: boolean
          phone: string | null
          referral_source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          referral_source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          referral_source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          priority: string | null
          status: string
          submitted_by: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          priority?: string | null
          status?: string
          submitted_by: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          priority?: string | null
          status?: string
          submitted_by?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      review_requests: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          id: string
          opened_at: string | null
          reminder_count: number | null
          review_id: string
          sent_at: string | null
          status: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          opened_at?: string | null
          reminder_count?: number | null
          review_id: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          opened_at?: string | null
          reminder_count?: number | null
          review_id?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          almost_stopped: string | null
          biggest_transformation: string | null
          client_id: string
          created_at: string
          engagement_type: string | null
          id: string
          impact_areas: string[] | null
          improvement_suggestion: string | null
          nps_recommendation: string | null
          nps_score: number | null
          one_sentence: string | null
          reviewer_company: string | null
          reviewer_name: string | null
          reviewer_photo_url: string | null
          reviewer_website: string | null
          score_commercial_value: number | null
          score_communication: number | null
          score_overall: number | null
          score_overall_impact: number | null
          score_speed: number | null
          score_strategic_clarity: number | null
          services_reviewed: string[] | null
          status: string
          submitted_at: string | null
          token: string
          updated_at: string
          value_rating: string | null
          value_reason: string | null
          visibility: string | null
          work_item_id: string | null
        }
        Insert: {
          almost_stopped?: string | null
          biggest_transformation?: string | null
          client_id: string
          created_at?: string
          engagement_type?: string | null
          id?: string
          impact_areas?: string[] | null
          improvement_suggestion?: string | null
          nps_recommendation?: string | null
          nps_score?: number | null
          one_sentence?: string | null
          reviewer_company?: string | null
          reviewer_name?: string | null
          reviewer_photo_url?: string | null
          reviewer_website?: string | null
          score_commercial_value?: number | null
          score_communication?: number | null
          score_overall?: number | null
          score_overall_impact?: number | null
          score_speed?: number | null
          score_strategic_clarity?: number | null
          services_reviewed?: string[] | null
          status?: string
          submitted_at?: string | null
          token?: string
          updated_at?: string
          value_rating?: string | null
          value_reason?: string | null
          visibility?: string | null
          work_item_id?: string | null
        }
        Update: {
          almost_stopped?: string | null
          biggest_transformation?: string | null
          client_id?: string
          created_at?: string
          engagement_type?: string | null
          id?: string
          impact_areas?: string[] | null
          improvement_suggestion?: string | null
          nps_recommendation?: string | null
          nps_score?: number | null
          one_sentence?: string | null
          reviewer_company?: string | null
          reviewer_name?: string | null
          reviewer_photo_url?: string | null
          reviewer_website?: string | null
          score_commercial_value?: number | null
          score_communication?: number | null
          score_overall?: number | null
          score_overall_impact?: number | null
          score_speed?: number | null
          score_strategic_clarity?: number | null
          services_reviewed?: string[] | null
          status?: string
          submitted_at?: string | null
          token?: string
          updated_at?: string
          value_rating?: string | null
          value_reason?: string | null
          visibility?: string | null
          work_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_items"
            referencedColumns: ["id"]
          },
        ]
      }
      updates: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          posted_by: string | null
          update_type: string | null
          work_item_id: string | null
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          posted_by?: string | null
          update_type?: string | null
          work_item_id?: string | null
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          posted_by?: string | null
          update_type?: string | null
          work_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "updates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "updates_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_items: {
        Row: {
          client_id: string
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          internal_notes: string | null
          priority: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          internal_notes?: string | null
          priority?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          internal_notes?: string | null
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_client_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client"],
    },
  },
} as const
