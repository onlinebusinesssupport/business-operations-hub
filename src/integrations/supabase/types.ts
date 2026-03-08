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
      bank_statements: {
        Row: {
          account_number: string | null
          bank_name: string | null
          created_at: string
          file_name: string
          file_path: string | null
          id: string
          period_end: string | null
          period_start: string | null
          skipped_count: number | null
          status: string
          total_in: number | null
          total_out: number | null
          transaction_count: number | null
          upload_date: string
        }
        Insert: {
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          file_name: string
          file_path?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          skipped_count?: number | null
          status?: string
          total_in?: number | null
          total_out?: number | null
          transaction_count?: number | null
          upload_date?: string
        }
        Update: {
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          file_name?: string
          file_path?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          skipped_count?: number | null
          status?: string
          total_in?: number | null
          total_out?: number | null
          transaction_count?: number | null
          upload_date?: string
        }
        Relationships: []
      }
      chart_of_accounts: {
        Row: {
          category: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          tax_treatment: string
          type: Database["public"]["Enums"]["account_type"]
        }
        Insert: {
          category?: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          tax_treatment?: string
          type: Database["public"]["Enums"]["account_type"]
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          tax_treatment?: string
          type?: Database["public"]["Enums"]["account_type"]
        }
        Relationships: []
      }
      client_emails: {
        Row: {
          body_html: string | null
          body_text: string | null
          client_id: string | null
          created_at: string
          id: string
          sent_at: string | null
          sent_by: string
          status: string
          subject: string
          to_email: string
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          sent_at?: string | null
          sent_by: string
          status?: string
          subject: string
          to_email: string
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          sent_at?: string | null
          sent_by?: string
          status?: string
          subject?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_emails_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          account_owner: string | null
          avg_review_score: number | null
          contact_profile_id: string | null
          contract_renewal_date: string | null
          created_at: string
          email: string | null
          health_score: number | null
          id: string
          inquiry_type: string | null
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
          phone: string | null
          retainer_limit: number
          retainer_used: number
          review_count: number | null
          services: string[] | null
          source_page: string | null
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
          email?: string | null
          health_score?: number | null
          id?: string
          inquiry_type?: string | null
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
          phone?: string | null
          retainer_limit?: number
          retainer_used?: number
          review_count?: number | null
          services?: string[] | null
          source_page?: string | null
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
          email?: string | null
          health_score?: number | null
          id?: string
          inquiry_type?: string | null
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
          phone?: string | null
          retainer_limit?: number
          retainer_used?: number
          review_count?: number | null
          services?: string[] | null
          source_page?: string | null
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
      compliance_items: {
        Row: {
          body: Database["public"]["Enums"]["compliance_body"]
          created_at: string
          due_date: string
          frequency: string
          id: string
          notes: string | null
          status: string
          title: string
        }
        Insert: {
          body?: Database["public"]["Enums"]["compliance_body"]
          created_at?: string
          due_date: string
          frequency?: string
          id?: string
          notes?: string | null
          status?: string
          title: string
        }
        Update: {
          body?: Database["public"]["Enums"]["compliance_body"]
          created_at?: string
          due_date?: string
          frequency?: string
          id?: string
          notes?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          connect_preference: string | null
          created_at: string
          email: string
          id: string
          lifecycle_stage: string
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
          lifecycle_stage?: string
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
          lifecycle_stage?: string
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
          file_path: string | null
          id: string
          invoice_date: string
          invoice_number: string | null
          paid_date: string | null
          pop_details: Json | null
          pop_file_path: string | null
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
          file_path?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          paid_date?: string | null
          pop_details?: Json | null
          pop_file_path?: string | null
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
          file_path?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          paid_date?: string | null
          pop_details?: Json | null
          pop_file_path?: string | null
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
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          source: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_templates: {
        Row: {
          brand_name: string | null
          created_at: string
          created_by: string | null
          id: string
          tasks: Json
          updated_at: string
          va_mode: boolean
        }
        Insert: {
          brand_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          tasks?: Json
          updated_at?: string
          va_mode?: boolean
        }
        Update: {
          brand_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          tasks?: Json
          updated_at?: string
          va_mode?: boolean
        }
        Relationships: []
      }
      pods: {
        Row: {
          client_id: string
          config: Json | null
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          config?: Json | null
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          config?: Json | null
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pods_client_id_fkey"
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
          first_login: boolean
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
          first_login?: boolean
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
          first_login?: boolean
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
          admin_reply: string | null
          admin_reply_at: string | null
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
          admin_reply?: string | null
          admin_reply_at?: string | null
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
          admin_reply?: string | null
          admin_reply_at?: string | null
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
      signed_documents: {
        Row: {
          created_at: string
          esign_provider: string | null
          file_path: string | null
          id: string
          project_id: string
          signed_at: string | null
          signed_by_admin: boolean
          signed_by_client: boolean
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          esign_provider?: string | null
          file_path?: string | null
          id?: string
          project_id: string
          signed_at?: string | null
          signed_by_admin?: boolean
          signed_by_client?: boolean
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          esign_provider?: string | null
          file_path?: string | null
          id?: string
          project_id?: string
          signed_at?: string | null
          signed_by_admin?: boolean
          signed_by_client?: boolean
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signed_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "work_items"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_comments: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          author_id: string
          content: string
          created_at: string
          id: string
          stage_id: string
          work_item_id: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          author_id: string
          content: string
          created_at?: string
          id?: string
          stage_id: string
          work_item_id: string
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          stage_id?: string
          work_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_comments_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_comments_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_items"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          ai_category: string | null
          ai_confidence: number | null
          amount: number
          balance: number | null
          confirmed: boolean
          created_at: string
          date: string
          description: string
          id: string
          notes: string | null
          statement_id: string
          vat_amount: number | null
        }
        Insert: {
          account_id?: string | null
          ai_category?: string | null
          ai_confidence?: number | null
          amount?: number
          balance?: number | null
          confirmed?: boolean
          created_at?: string
          date: string
          description?: string
          id?: string
          notes?: string | null
          statement_id: string
          vat_amount?: number | null
        }
        Update: {
          account_id?: string | null
          ai_category?: string | null
          ai_confidence?: number | null
          amount?: number
          balance?: number | null
          confirmed?: boolean
          created_at?: string
          date?: string
          description?: string
          id?: string
          notes?: string | null
          statement_id?: string
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "bank_statements"
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
      workflow_stages: {
        Row: {
          created_at: string
          due_date: string | null
          feedback: Json | null
          id: string
          meeting_url: string | null
          name: string
          order_index: number
          status: string
          updated_at: string
          work_item_id: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          feedback?: Json | null
          id?: string
          meeting_url?: string | null
          name: string
          order_index?: number
          status?: string
          updated_at?: string
          work_item_id: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          feedback?: Json | null
          id?: string
          meeting_url?: string | null
          name?: string
          order_index?: number
          status?: string
          updated_at?: string
          work_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stages_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_items"
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
      account_type: "income" | "expense" | "asset" | "liability" | "equity"
      app_role: "admin" | "client"
      compliance_body: "SARS" | "CIPC" | "UIF" | "COIDA" | "Other"
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
      account_type: ["income", "expense", "asset", "liability", "equity"],
      app_role: ["admin", "client"],
      compliance_body: ["SARS", "CIPC", "UIF", "COIDA", "Other"],
    },
  },
} as const
