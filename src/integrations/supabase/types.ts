export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaign_instances: {
        Row: {
          campaign_id: string
          completion_rate: number | null
          created_at: string
          ends_at: string
          id: string
          period_number: number
          starts_at: string
          status: Database["public"]["Enums"]["instance_status"]
          updated_at: string
        }
        Insert: {
          campaign_id: string
          completion_rate?: number | null
          created_at?: string
          ends_at: string
          id?: string
          period_number: number
          starts_at: string
          status?: Database["public"]["Enums"]["instance_status"]
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          completion_rate?: number | null
          created_at?: string
          ends_at?: string
          id?: string
          period_number?: number
          starts_at?: string
          status?: Database["public"]["Enums"]["instance_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_instances_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "survey_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_instances_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "top_performing_surveys"
            referencedColumns: ["campaign_id"]
          },
        ]
      }
      email_config: {
        Row: {
          created_at: string
          from_email: string
          from_name: string
          id: string
          is_singleton: boolean | null
          provider: Database["public"]["Enums"]["email_provider"]
          provider_settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_email: string
          from_name: string
          id?: string
          is_singleton?: boolean | null
          provider?: Database["public"]["Enums"]["email_provider"]
          provider_settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_email?: string
          from_name?: string
          id?: string
          is_singleton?: boolean | null
          provider?: Database["public"]["Enums"]["email_provider"]
          provider_settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      employee_roles: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["employee_role_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["employee_role_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["employee_role_status"]
          updated_at?: string
        }
        Relationships: []
      }
      employee_types: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["employee_type_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["employee_type_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["employee_type_status"]
          updated_at?: string
        }
        Relationships: []
      }
      employment_types: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["employment_type_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["employment_type_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["employment_type_status"]
          updated_at?: string
        }
        Relationships: []
      }
      levels: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["level_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["level_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["level_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          google_maps_url: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          google_maps_url?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          google_maps_url?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          designation: string | null
          email: string
          employee_role_id: string | null
          employee_type_id: string | null
          employment_type_id: string | null
          first_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          last_name: string | null
          level_id: string | null
          location_id: string | null
          org_id: string | null
          profile_image_url: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          designation?: string | null
          email: string
          employee_role_id?: string | null
          employee_type_id?: string | null
          employment_type_id?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          last_name?: string | null
          level_id?: string | null
          location_id?: string | null
          org_id?: string | null
          profile_image_url?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          designation?: string | null
          email?: string
          employee_role_id?: string | null
          employee_type_id?: string | null
          employment_type_id?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          last_name?: string | null
          level_id?: string | null
          location_id?: string | null
          org_id?: string | null
          profile_image_url?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_employee_role_id_fkey"
            columns: ["employee_role_id"]
            isOneToOne: false
            referencedRelation: "employee_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_employee_type_id_fkey"
            columns: ["employee_type_id"]
            isOneToOne: false
            referencedRelation: "employee_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_employment_type_id_fkey"
            columns: ["employment_type_id"]
            isOneToOne: false
            referencedRelation: "employment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      sbus: {
        Row: {
          created_at: string
          head_id: string | null
          id: string
          name: string
          profile_image_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          head_id?: string | null
          id?: string
          name: string
          profile_image_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          head_id?: string | null
          id?: string
          name?: string
          profile_image_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sbus_head_id_fkey"
            columns: ["head_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbus_head_id_fkey"
            columns: ["head_id"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_assignments: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          created_by: string
          due_date: string | null
          id: string
          is_organization_wide: boolean | null
          last_reminder_sent: string | null
          public_access_token: string | null
          status: Database["public"]["Enums"]["assignment_status"] | null
          survey_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          created_by: string
          due_date?: string | null
          id?: string
          is_organization_wide?: boolean | null
          last_reminder_sent?: string | null
          public_access_token?: string | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          survey_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          created_by?: string
          due_date?: string | null
          id?: string
          is_organization_wide?: boolean | null
          last_reminder_sent?: string | null
          public_access_token?: string | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          survey_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_assignments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "survey_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_assignments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "top_performing_surveys"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "survey_assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_assignments_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_campaigns: {
        Row: {
          anonymous: boolean
          campaign_type: string
          completion_rate: number | null
          created_at: string
          created_by: string
          description: string | null
          ends_at: string | null
          id: string
          instance_duration_days: number | null
          instance_end_time: string | null
          is_recurring: boolean | null
          name: string
          recurring_days: number[] | null
          recurring_ends_at: string | null
          recurring_frequency: string | null
          starts_at: string
          status: string
          survey_id: string
          updated_at: string
        }
        Insert: {
          anonymous?: boolean
          campaign_type?: string
          completion_rate?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          ends_at?: string | null
          id?: string
          instance_duration_days?: number | null
          instance_end_time?: string | null
          is_recurring?: boolean | null
          name: string
          recurring_days?: number[] | null
          recurring_ends_at?: string | null
          recurring_frequency?: string | null
          starts_at: string
          status?: string
          survey_id: string
          updated_at?: string
        }
        Update: {
          anonymous?: boolean
          campaign_type?: string
          completion_rate?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          instance_duration_days?: number | null
          instance_end_time?: string | null
          is_recurring?: boolean | null
          name?: string
          recurring_days?: number[] | null
          recurring_ends_at?: string | null
          recurring_frequency?: string | null
          starts_at?: string
          status?: string
          survey_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_campaigns_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          assignment_id: string
          campaign_instance_id: string | null
          created_at: string | null
          id: string
          response_data: Json
          state_data: Json | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignment_id: string
          campaign_instance_id?: string | null
          created_at?: string | null
          id?: string
          response_data: Json
          state_data?: Json | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignment_id?: string
          campaign_instance_id?: string | null
          created_at?: string | null
          id?: string
          response_data?: Json
          state_data?: Json | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "survey_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "upcoming_survey_deadlines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_campaign_instance_id_fkey"
            columns: ["campaign_instance_id"]
            isOneToOne: false
            referencedRelation: "campaign_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_campaign_instance_id_fkey"
            columns: ["campaign_instance_id"]
            isOneToOne: false
            referencedRelation: "top_performing_surveys"
            referencedColumns: ["instance_id"]
          },
          {
            foreignKeyName: "survey_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          json_data: Json
          name: string
          status: Database["public"]["Enums"]["survey_status"] | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          json_data: Json
          name: string
          status?: Database["public"]["Enums"]["survey_status"] | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          json_data?: Json
          name?: string
          status?: Database["public"]["Enums"]["survey_status"] | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sbus: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          sbu_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          sbu_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          sbu_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sbus_sbu_id_fkey"
            columns: ["sbu_id"]
            isOneToOne: false
            referencedRelation: "sbus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sbus_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sbus_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_supervisors: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          supervisor_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          supervisor_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          supervisor_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_supervisors_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_supervisors_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_supervisors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_supervisors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      demographic_employment_analysis: {
        Row: {
          employment_type: string | null
          response_count: number | null
        }
        Relationships: []
      }
      demographic_gender_analysis: {
        Row: {
          gender: string | null
          response_count: number | null
        }
        Relationships: []
      }
      demographic_location_analysis: {
        Row: {
          location: string | null
          response_count: number | null
        }
        Relationships: []
      }
      department_performance: {
        Row: {
          completed_responses: number | null
          completion_rate: number | null
          sbu_name: string | null
          total_assignments: number | null
        }
        Relationships: []
      }
      managers_needing_improvement: {
        Row: {
          average_score: number | null
          improvement_rank: number | null
          manager_id: string | null
          manager_name: string | null
          total_ratings: number | null
          total_respondents: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_supervisors_supervisor_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_supervisors_supervisor_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      recent_activities: {
        Row: {
          activity_time: string | null
          activity_type: string | null
          campaign_name: string | null
          id: string | null
          survey_name: string | null
          user_name: string | null
        }
        Relationships: []
      }
      response_trends: {
        Row: {
          response_count: number | null
          response_date: string | null
          unique_respondents: number | null
        }
        Relationships: []
      }
      silent_employees: {
        Row: {
          designation: string | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          last_response_date: string | null
          level: string | null
          location: string | null
          participation_status: string | null
          sbu_name: string | null
          total_assignments: number | null
          total_responses: number | null
        }
        Relationships: []
      }
      survey_overview_metrics: {
        Row: {
          active_campaigns: number | null
          avg_completion_rate: number | null
          completed_campaigns: number | null
          total_responses: number | null
          total_surveys: number | null
        }
        Relationships: []
      }
      survey_response_trends: {
        Row: {
          date: string | null
          response_count: number | null
          unique_respondents: number | null
        }
        Relationships: []
      }
      top_performing_managers: {
        Row: {
          average_score: number | null
          manager_id: string | null
          manager_name: string | null
          rank: number | null
          total_ratings: number | null
          total_respondents: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_supervisors_supervisor_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_supervisors_supervisor_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "silent_employees"
            referencedColumns: ["id"]
          },
        ]
      }

      top_performing_surveys: {
        Row: {
          campaign_id: string | null
          campaign_name: string | null
          completion_rate: number | null
          ends_at: string | null
          instance_id: string | null
          period_number: number | null
          starts_at: string | null
          survey_name: string | null
          total_responses: number | null
        }
        Relationships: []
      }
      upcoming_survey_deadlines: {
        Row: {
          campaign_name: string | null
          due_date: string | null
          id: string | null
          pending_responses: number | null
          survey_name: string | null
          total_assignments: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: {
          user_uid: string
        }
        Returns: boolean
      }
      search_users:
        | {
            Args: {
              search_text: string
              page_number: number
              page_size: number
              sbu_filter?: string
            }
            Returns: {
              profile: Json
              total_count: number
            }[]
          }
        | {
            Args: {
              search_text: string
              page_number: number
              page_size: number
              sbu_filter?: string
              level_filter?: string
              location_filter?: string
              employment_type_filter?: string
              employee_role_filter?: string
              employee_type_filter?: string
            }
            Returns: {
              profile: Json
              total_count: number
            }[]
          }
    }
    Enums: {
      assignment_status: "pending" | "completed" | "expired"
      campaign_status: "draft" | "active" | "completed" | "archived"
      email_provider: "resend"
      employee_role_status: "active" | "inactive"
      employee_type_status: "active" | "inactive"
      employment_type_status: "active" | "inactive"
      gender_type: "male" | "female" | "other"
      instance_status: "upcoming" | "active" | "completed"
      level_status: "active" | "inactive"
      profile_status: "active" | "disabled"
      recurring_frequency:
        | "one_time"
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
      survey_status: "draft" | "published" | "archived"
      user_role: "admin" | "user"
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
