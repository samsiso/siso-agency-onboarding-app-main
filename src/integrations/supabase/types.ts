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
      automations: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          integration_url: string | null
          name: string
          platform: string | null
          profile_image_url: string | null
          setup_guide: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          integration_url?: string | null
          name: string
          platform?: string | null
          profile_image_url?: string | null
          setup_guide?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          integration_url?: string | null
          name?: string
          platform?: string | null
          profile_image_url?: string | null
          setup_guide?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      core_tools: {
        Row: {
          category: string
          created_at: string
          description: string | null
          downloads_count: number | null
          icon_url: string | null
          id: string
          likes_count: number | null
          name: string
          pricing_type: string | null
          profile_image_url: string | null
          rating: number | null
          reviews_count: number | null
          updated_at: string
          use_cases: string[] | null
          website_url: string | null
          youtube_url: string | null
          youtube_videos: Json | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          icon_url?: string | null
          id?: string
          likes_count?: number | null
          name: string
          pricing_type?: string | null
          profile_image_url?: string | null
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string
          use_cases?: string[] | null
          website_url?: string | null
          youtube_url?: string | null
          youtube_videos?: Json | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          icon_url?: string | null
          id?: string
          likes_count?: number | null
          name?: string
          pricing_type?: string | null
          profile_image_url?: string | null
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string
          use_cases?: string[] | null
          website_url?: string | null
          youtube_url?: string | null
          youtube_videos?: Json | null
        }
        Relationships: []
      }
      education_resources: {
        Row: {
          category: string
          content_type: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          profile_image_url: string | null
          resource_url: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          profile_image_url?: string | null
          resource_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          profile_image_url?: string | null
          resource_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      gpt_resources: {
        Row: {
          assistant_type: string | null
          category: string
          created_at: string
          description: string | null
          downloads_count: number | null
          gpt_id: string | null
          gpt_url: string | null
          id: string
          input_variables: string[] | null
          likes_count: number | null
          model_type: string | null
          name: string
          num_conversations_str: string | null
          profile_image_url: string | null
          prompt_template: string | null
          rating: number | null
          response_format: string | null
          review_average: number | null
          review_count: number | null
          review_total: number | null
          reviews_count: number | null
          short_url: string | null
          updated_at: string
          use_cases: string[] | null
        }
        Insert: {
          assistant_type?: string | null
          category: string
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          gpt_id?: string | null
          gpt_url?: string | null
          id?: string
          input_variables?: string[] | null
          likes_count?: number | null
          model_type?: string | null
          name: string
          num_conversations_str?: string | null
          profile_image_url?: string | null
          prompt_template?: string | null
          rating?: number | null
          response_format?: string | null
          review_average?: number | null
          review_count?: number | null
          review_total?: number | null
          reviews_count?: number | null
          short_url?: string | null
          updated_at?: string
          use_cases?: string[] | null
        }
        Update: {
          assistant_type?: string | null
          category?: string
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          gpt_id?: string | null
          gpt_url?: string | null
          id?: string
          input_variables?: string[] | null
          likes_count?: number | null
          model_type?: string | null
          name?: string
          num_conversations_str?: string | null
          profile_image_url?: string | null
          prompt_template?: string | null
          rating?: number | null
          response_format?: string | null
          review_average?: number | null
          review_count?: number | null
          review_total?: number | null
          reviews_count?: number | null
          short_url?: string | null
          updated_at?: string
          use_cases?: string[] | null
        }
        Relationships: []
      }
      networking_resources: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          join_url: string | null
          member_count: number | null
          name: string
          platform: string | null
          profile_image_url: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          join_url?: string | null
          member_count?: number | null
          name: string
          platform?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          join_url?: string | null
          member_count?: number | null
          name?: string
          platform?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          assistant_type: string | null
          category: string
          content_themes: string[] | null
          created_at: string
          description: string | null
          downloads_count: number | null
          gpt_id: string | null
          gpt_url: string | null
          icon_url: string | null
          id: string
          input_variables: string[] | null
          likes_count: number | null
          member_type: string | null
          model_type: string | null
          name: string
          num_conversations_str: string | null
          pricing_type: string | null
          profile_image_url: string | null
          prompt_template: string | null
          rating: number | null
          resource_type: string
          response_format: string | null
          review_average: number | null
          review_count: number | null
          review_total: number | null
          reviews_count: number | null
          short_url: string | null
          specialization: string[] | null
          updated_at: string
          use_cases: string[] | null
          website_url: string | null
          youtube_url: string | null
          youtube_videos: Json | null
        }
        Insert: {
          assistant_type?: string | null
          category: string
          content_themes?: string[] | null
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          gpt_id?: string | null
          gpt_url?: string | null
          icon_url?: string | null
          id?: string
          input_variables?: string[] | null
          likes_count?: number | null
          member_type?: string | null
          model_type?: string | null
          name: string
          num_conversations_str?: string | null
          pricing_type?: string | null
          profile_image_url?: string | null
          prompt_template?: string | null
          rating?: number | null
          resource_type?: string
          response_format?: string | null
          review_average?: number | null
          review_count?: number | null
          review_total?: number | null
          reviews_count?: number | null
          short_url?: string | null
          specialization?: string[] | null
          updated_at?: string
          use_cases?: string[] | null
          website_url?: string | null
          youtube_url?: string | null
          youtube_videos?: Json | null
        }
        Update: {
          assistant_type?: string | null
          category?: string
          content_themes?: string[] | null
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          gpt_id?: string | null
          gpt_url?: string | null
          icon_url?: string | null
          id?: string
          input_variables?: string[] | null
          likes_count?: number | null
          member_type?: string | null
          model_type?: string | null
          name?: string
          num_conversations_str?: string | null
          pricing_type?: string | null
          profile_image_url?: string | null
          prompt_template?: string | null
          rating?: number | null
          resource_type?: string
          response_format?: string | null
          review_average?: number | null
          review_count?: number | null
          review_total?: number | null
          reviews_count?: number | null
          short_url?: string | null
          specialization?: string[] | null
          updated_at?: string
          use_cases?: string[] | null
          website_url?: string | null
          youtube_url?: string | null
          youtube_videos?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
