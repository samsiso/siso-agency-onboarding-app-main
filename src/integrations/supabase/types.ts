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
      agencies: {
        Row: {
          address: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          phone_number: string | null
          primary_color: string | null
          secondary_color: string | null
          slug: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone_number?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone_number?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_messages: {
        Row: {
          ai_response: string
          created_at: string
          id: string
          user_message: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          id?: string
          user_message: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          id?: string
          user_message?: string
        }
        Relationships: []
      }
      ai_news: {
        Row: {
          content: string
          created_at: string | null
          id: string
          published_at: string | null
          source: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          source?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          source?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_news_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          news_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          news_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          news_id?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_news_daily_summaries: {
        Row: {
          action_items: string[] | null
          created_at: string | null
          date: string
          executive_summary: string | null
          generated_with: string
          id: string
          industry_impacts: Json | null
          key_developments: string[] | null
          summary: string
          updated_at: string | null
        }
        Insert: {
          action_items?: string[] | null
          created_at?: string | null
          date: string
          executive_summary?: string | null
          generated_with: string
          id?: string
          industry_impacts?: Json | null
          key_developments?: string[] | null
          summary: string
          updated_at?: string | null
        }
        Update: {
          action_items?: string[] | null
          created_at?: string | null
          date?: string
          executive_summary?: string | null
          generated_with?: string
          id?: string
          industry_impacts?: Json | null
          key_developments?: string[] | null
          summary?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_news_video_processing: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          status: string
          updated_at: string | null
          video_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          video_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          video_id?: string
        }
        Relationships: []
      }
      app_plans: {
        Row: {
          agency_id: string
          created_at: string
          description: string | null
          features: Json
          id: string
          status: string
          title: string
          total_cost: number | null
          updated_at: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          status?: string
          title: string
          total_cost?: number | null
          updated_at?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          status?: string
          title?: string
          total_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_plans_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      assistant_metadata: {
        Row: {
          assistant_id: string
          created_at: string
          id: string
          instructions: string | null
          metadata: Json | null
          model: string
          name: string
          tools: Json | null
          updated_at: string
        }
        Insert: {
          assistant_id: string
          created_at?: string
          id?: string
          instructions?: string | null
          metadata?: Json | null
          model: string
          name: string
          tools?: Json | null
          updated_at?: string
        }
        Update: {
          assistant_id?: string
          created_at?: string
          id?: string
          instructions?: string | null
          metadata?: Json | null
          model?: string
          name?: string
          tools?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      assistant_versions: {
        Row: {
          assistant_id: string
          configuration: Json
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          version: string
        }
        Insert: {
          assistant_id: string
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          version: string
        }
        Update: {
          assistant_id?: string
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_versions_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "assistant_metadata"
            referencedColumns: ["assistant_id"]
          },
        ]
      }
      automations: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty: string
          id: string
          name: string
          platform: string
          pricing: string | null
          setup_time: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          difficulty: string
          id?: string
          name: string
          platform: string
          pricing?: string | null
          setup_time: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string
          id?: string
          name?: string
          platform?: string
          pricing?: string | null
          setup_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      banner_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_default: boolean | null
          metadata: Json | null
          name: string
          template_type: string
          text_overlay: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          metadata?: Json | null
          name: string
          template_type: string
          text_overlay?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          metadata?: Json | null
          name?: string
          template_type?: string
          text_overlay?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_users: {
        Row: {
          airtable_id: string | null
          chat_history: string | null
          chat_url: string | null
          client_page_data: string | null
          created_at: string | null
          id: string
          last_message: string | null
          last_message_date: string | null
          name: string
          notes: string | null
          profile_url: string | null
          recent_message: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          airtable_id?: string | null
          chat_history?: string | null
          chat_url?: string | null
          client_page_data?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_date?: string | null
          name: string
          notes?: string | null
          profile_url?: string | null
          recent_message?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          airtable_id?: string | null
          chat_history?: string | null
          chat_url?: string | null
          client_page_data?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_date?: string | null
          name?: string
          notes?: string | null
          profile_url?: string | null
          recent_message?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_notes: {
        Row: {
          client_id: string
          content: string | null
          created_at: string
          created_by: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content?: string | null
          created_at?: string
          created_by: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string | null
          created_at?: string
          created_by?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_pages: {
        Row: {
          client_id: string
          content: Json | null
          created_at: string
          created_by: string
          icon: string | null
          id: string
          last_edited_by: string | null
          page_type: string | null
          parent_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content?: Json | null
          created_at?: string
          created_by: string
          icon?: string | null
          id?: string
          last_edited_by?: string | null
          page_type?: string | null
          parent_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: Json | null
          created_at?: string
          created_by?: string
          icon?: string | null
          id?: string
          last_edited_by?: string | null
          page_type?: string | null
          parent_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_pages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "client_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          assigned_admin: string | null
          company: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_admin?: string | null
          company?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_admin?: string | null
          company?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          accent_color: string | null
          banner_url: string | null
          company_name: string | null
          company_type: string | null
          created_at: string | null
          description: string | null
          email: string | null
          employee_count: number | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          mission: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          social_links: Json | null
          updated_at: string | null
          user_id: string
          vision: string | null
          website: string | null
          year_founded: number | null
        }
        Insert: {
          accent_color?: string | null
          banner_url?: string | null
          company_name?: string | null
          company_type?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          employee_count?: number | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          mission?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          social_links?: Json | null
          updated_at?: string | null
          user_id: string
          vision?: string | null
          website?: string | null
          year_founded?: number | null
        }
        Update: {
          accent_color?: string | null
          banner_url?: string | null
          company_name?: string | null
          company_type?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          employee_count?: number | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          mission?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string
          vision?: string | null
          website?: string | null
          year_founded?: number | null
        }
        Relationships: []
      }
      connection_list: {
        Row: {
          airtable_id: string | null
          created_at: string | null
          id: string
          page_number: string
          page_url: string | null
          page_url_long: string | null
          record_id: string | null
          search_term: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          airtable_id?: string | null
          created_at?: string | null
          id?: string
          page_number: string
          page_url?: string | null
          page_url_long?: string | null
          record_id?: string | null
          search_term?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          airtable_id?: string | null
          created_at?: string | null
          id?: string
          page_number?: string
          page_url?: string | null
          page_url_long?: string | null
          record_id?: string | null
          search_term?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          airtable_id: string | null
          company: string | null
          connected: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          airtable_id?: string | null
          company?: string | null
          connected?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          airtable_id?: string | null
          company?: string | null
          connected?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_schedule: {
        Row: {
          airtable_id: string | null
          created_at: string | null
          date: string | null
          id: string
          post_content: string | null
          status: string | null
          time: string | null
          transcription: string | null
          updated_at: string | null
          url: string | null
          video_name: string
        }
        Insert: {
          airtable_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          post_content?: string | null
          status?: string | null
          time?: string | null
          transcription?: string | null
          updated_at?: string | null
          url?: string | null
          video_name: string
        }
        Update: {
          airtable_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          post_content?: string | null
          status?: string | null
          time?: string | null
          transcription?: string | null
          updated_at?: string | null
          url?: string | null
          video_name?: string
        }
        Relationships: []
      }
      core_tools: {
        Row: {
          category: string | null
          created_at: string | null
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
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
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
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
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
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      crypto_transactions: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          points_exchanged: number
          status: string
          tokens_received: number
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          points_exchanged: number
          status?: string
          tokens_received: number
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          points_exchanged?: number
          status?: string
          tokens_received?: number
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          airtable_id: string | null
          connection_requests: number | null
          created_at: string | null
          date: string
          follow_requests: number | null
          followers_count: number | null
          id: string
          post_comments: number | null
          post_likes: number | null
          profile_views: number | null
          updated_at: string | null
        }
        Insert: {
          airtable_id?: string | null
          connection_requests?: number | null
          created_at?: string | null
          date: string
          follow_requests?: number | null
          followers_count?: number | null
          id?: string
          post_comments?: number | null
          post_likes?: number | null
          profile_views?: number | null
          updated_at?: string | null
        }
        Update: {
          airtable_id?: string | null
          connection_requests?: number | null
          created_at?: string | null
          date?: string
          follow_requests?: number | null
          followers_count?: number | null
          id?: string
          post_comments?: number | null
          post_likes?: number | null
          profile_views?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      direct_connections: {
        Row: {
          airtable_id: string | null
          company: string | null
          connected_date: string | null
          created_at: string | null
          created_time: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          record_id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          username: string | null
          week: string | null
          week_identifier: string | null
          weekly_link: string | null
        }
        Insert: {
          airtable_id?: string | null
          company?: string | null
          connected_date?: string | null
          created_at?: string | null
          created_time?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          record_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          username?: string | null
          week?: string | null
          week_identifier?: string | null
          weekly_link?: string | null
        }
        Update: {
          airtable_id?: string | null
          company?: string | null
          connected_date?: string | null
          created_at?: string | null
          created_time?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          record_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          username?: string | null
          week?: string | null
          week_identifier?: string | null
          weekly_link?: string | null
        }
        Relationships: []
      }
      documentation_articles: {
        Row: {
          category_id: string
          content: string | null
          created_at: string | null
          difficulty: string | null
          display_order: number | null
          excerpt: string | null
          id: string
          last_updated: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          content?: string | null
          created_at?: string | null
          difficulty?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string
          last_updated?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          content?: string | null
          created_at?: string | null
          difficulty?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string
          last_updated?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "documentation_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documentation_feedback: {
        Row: {
          created_at: string | null
          feedback_type: string
          id: string
          question_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_type: string
          id?: string
          question_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_type?: string
          id?: string
          question_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_feedback_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "documentation_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_questions: {
        Row: {
          answer: string
          created_at: string | null
          display_order: number | null
          id: string
          question: string
          section_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
          section_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
          section_id?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "documentation_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_sections: {
        Row: {
          article_id: string
          created_at: string | null
          display_order: number | null
          id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          article_id: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          article_id?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_sections_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "documentation_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      education_creators: {
        Row: {
          channel_avatar_url: string | null
          channel_id: string
          created_at: string | null
          description: string | null
          id: string
          last_sync_error: string | null
          last_synced_at: string | null
          name: string
          number_of_subscribers: number | null
          slug: string
          specialization: string[] | null
          sync_completed_at: string | null
          sync_started_at: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          channel_avatar_url?: string | null
          channel_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          last_sync_error?: string | null
          last_synced_at?: string | null
          name: string
          number_of_subscribers?: number | null
          slug: string
          specialization?: string[] | null
          sync_completed_at?: string | null
          sync_started_at?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_avatar_url?: string | null
          channel_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          last_sync_error?: string | null
          last_synced_at?: string | null
          name?: string
          number_of_subscribers?: number | null
          slug?: string
          specialization?: string[] | null
          sync_completed_at?: string | null
          sync_started_at?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          time: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          time: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          base_cost: number
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          base_cost: number
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          base_cost?: number
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      followed_connections: {
        Row: {
          airtable_id: string | null
          company: string | null
          created_at: string | null
          created_time: string | null
          followed_date: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          record_id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          username: string | null
          week: string | null
          week_identifier: string | null
          week_link: string | null
        }
        Insert: {
          airtable_id?: string | null
          company?: string | null
          created_at?: string | null
          created_time?: string | null
          followed_date?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          record_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          username?: string | null
          week?: string | null
          week_identifier?: string | null
          week_link?: string | null
        }
        Update: {
          airtable_id?: string | null
          company?: string | null
          created_at?: string | null
          created_time?: string | null
          followed_date?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          record_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          username?: string | null
          week?: string | null
          week_identifier?: string | null
          week_link?: string | null
        }
        Relationships: []
      }
      login_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_login: string | null
          longest_streak: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_login?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_login?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      networking_resources: {
        Row: {
          category: string
          community_count: number | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          community_count?: number | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          community_count?: number | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          news_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          news_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          news_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string | null
          id: string
          page_url: string
          ttfb: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_url: string
          ttfb: number
        }
        Update: {
          created_at?: string | null
          id?: string
          page_url?: string
          ttfb?: number
        }
        Relationships: []
      }
      plan_chat_history: {
        Row: {
          ai_response: string
          conversation_id: string | null
          created_at: string
          form_data: Json | null
          id: string
          message_order: number | null
          metadata: Json | null
          plan_id: string | null
          user_id: string | null
          user_message: string
        }
        Insert: {
          ai_response: string
          conversation_id?: string | null
          created_at?: string
          form_data?: Json | null
          id?: string
          message_order?: number | null
          metadata?: Json | null
          plan_id?: string | null
          user_id?: string | null
          user_message: string
        }
        Update: {
          ai_response?: string
          conversation_id?: string | null
          created_at?: string
          form_data?: Json | null
          id?: string
          message_order?: number | null
          metadata?: Json | null
          plan_id?: string | null
          user_id?: string | null
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_chat_history_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "project_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      point_configurations: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          points: number
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
        }
        Relationships: []
      }
      points_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          points_earned: number
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: []
      }
      portfolio_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          challenge: string
          client: string
          created_at: string
          date: string
          description: string
          duration: string
          featured: boolean
          features: string[]
          full_description: string
          gallery: string[]
          id: string
          image: string
          results: string
          solution: string
          tags: string[]
          technologies: string[]
          testimonial: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          challenge: string
          client: string
          created_at?: string
          date: string
          description: string
          duration: string
          featured?: boolean
          features?: string[]
          full_description: string
          gallery?: string[]
          id?: string
          image: string
          results: string
          solution: string
          tags?: string[]
          technologies?: string[]
          testimonial?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          challenge?: string
          client?: string
          created_at?: string
          date?: string
          description?: string
          duration?: string
          featured?: boolean
          features?: string[]
          full_description?: string
          gallery?: string[]
          id?: string
          image?: string
          results?: string
          solution?: string
          tags?: string[]
          technologies?: string[]
          testimonial?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_interactions: {
        Row: {
          action: string | null
          airtable_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          interaction_date: string | null
          interaction_type: string | null
          name: string
          notes: string | null
          post_comments: string | null
          post_content: string | null
          post_likes: string | null
          post_type: string | null
          post_url: string | null
          post_user: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          action?: string | null
          airtable_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string | null
          name: string
          notes?: string | null
          post_comments?: string | null
          post_content?: string | null
          post_likes?: string | null
          post_type?: string | null
          post_url?: string | null
          post_user?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          action?: string | null
          airtable_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string | null
          name?: string
          notes?: string | null
          post_comments?: string | null
          post_content?: string | null
          post_likes?: string | null
          post_type?: string | null
          post_url?: string | null
          post_user?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          categories: string[] | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          marketing_strategy: string | null
          name: string
          offering_type: string | null
          pricing: string | null
          product_link: string | null
          updated_at: string
        }
        Insert: {
          categories?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          marketing_strategy?: string | null
          name: string
          offering_type?: string | null
          pricing?: string | null
          product_link?: string | null
          updated_at?: string
        }
        Update: {
          categories?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          marketing_strategy?: string | null
          name?: string
          offering_type?: string | null
          pricing?: string | null
          product_link?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          achievements: Json | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          business_name: string | null
          business_type: string | null
          contribution_count: number | null
          created_at: string
          full_name: string | null
          id: string
          industry: string | null
          instagram_url: string | null
          interests: string[] | null
          linkedin_url: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          phone_number: string | null
          points: number | null
          professional_role: string | null
          rank: string | null
          referral_count: number | null
          role: Database["public"]["Enums"]["app_role"]
          siso_tokens: number | null
          solana_wallet_address: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          achievements?: Json | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          business_name?: string | null
          business_type?: string | null
          contribution_count?: number | null
          created_at?: string
          full_name?: string | null
          id: string
          industry?: string | null
          instagram_url?: string | null
          interests?: string[] | null
          linkedin_url?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone_number?: string | null
          points?: number | null
          professional_role?: string | null
          rank?: string | null
          referral_count?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          siso_tokens?: number | null
          solana_wallet_address?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          achievements?: Json | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          business_name?: string | null
          business_type?: string | null
          contribution_count?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          industry?: string | null
          instagram_url?: string | null
          interests?: string[] | null
          linkedin_url?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone_number?: string | null
          points?: number | null
          professional_role?: string | null
          rank?: string | null
          referral_count?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          siso_tokens?: number | null
          solana_wallet_address?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      project_details: {
        Row: {
          business_context: Json | null
          created_at: string
          features: Json | null
          goals: string | null
          id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          business_context?: Json | null
          created_at?: string
          features?: Json | null
          goals?: string | null
          id?: string
          project_id: string
          updated_at?: string
        }
        Update: {
          business_context?: Json | null
          created_at?: string
          features?: Json | null
          goals?: string | null
          id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_details_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documentation: {
        Row: {
          content: string
          created_at: string | null
          id: string
          implementation_status: string
          priority: string
          related_components: string[] | null
          section: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          implementation_status: string
          priority: string
          related_components?: string[] | null
          section: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          implementation_status?: string
          priority?: string
          related_components?: string[] | null
          section?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_plans: {
        Row: {
          budget: string | null
          created_at: string
          description: string | null
          features: Json | null
          id: string
          requirements: Json | null
          status: string | null
          technical_specs: Json | null
          timeline: Json | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          requirements?: Json | null
          status?: string | null
          technical_specs?: Json | null
          timeline?: Json | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          requirements?: Json | null
          status?: string | null
          technical_specs?: Json | null
          timeline?: Json | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      project_threads: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          project_id: string
          thread_id: string
          thread_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id: string
          thread_id: string
          thread_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string
          thread_id?: string
          thread_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_threads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "project_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "resource_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_paths: {
        Row: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          level: number | null
          name: string
          updated_at: string | null
          xp_required: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          level?: number | null
          name: string
          updated_at?: string | null
          xp_required?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          level?: number | null
          name?: string
          updated_at?: string | null
          xp_required?: number | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          description: string
          icon: string | null
          id: string
          name: string
          path_id: string | null
          skill_id: string
          updated_at: string | null
          xp_value: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          name: string
          path_id?: string | null
          skill_id: string
          updated_at?: string | null
          xp_value?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          name?: string
          path_id?: string | null
          skill_id?: string
          updated_at?: string | null
          xp_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "skill_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      task_steps: {
        Row: {
          created_at: string
          description: string
          id: string
          output: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          step_number: number
          task_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          output?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          step_number: number
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          output?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          step_number?: number
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_steps_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_crypto_history: {
        Row: {
          created_at: string | null
          id: string
          points_exchanged: number
          status: string
          tokens_received: number
          transaction_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          points_exchanged: number
          status?: string
          tokens_received: number
          transaction_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          points_exchanged?: number
          status?: string
          tokens_received?: number
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_search_history: {
        Row: {
          created_at: string | null
          id: string
          query: string
          result_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          result_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          result_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_skill_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          last_completed_at: string | null
          level: number | null
          progress: number | null
          skill_id: string
          skill_name: string
          times_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_completed_at?: string | null
          level?: number | null
          progress?: number | null
          skill_id: string
          skill_name: string
          times_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_completed_at?: string | null
          level?: number | null
          progress?: number | null
          skill_id?: string
          skill_name?: string
          times_completed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_threads: {
        Row: {
          assistant_id: string
          created_at: string | null
          description: string | null
          id: string
          last_message_at: string | null
          message_count: number | null
          metadata: Json | null
          status: string | null
          thread_id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assistant_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          metadata?: Json | null
          status?: string | null
          thread_id: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assistant_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          metadata?: Json | null
          status?: string | null
          thread_id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      vector_storage: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      video_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_bookmarks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "youtube_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      video_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          progress: number | null
          updated_at: string | null
          user_id: string
          video_id: string
          watched: boolean | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          progress?: number | null
          updated_at?: string | null
          user_id: string
          video_id: string
          watched?: boolean | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          progress?: number | null
          updated_at?: string | null
          user_id?: string
          video_id?: string
          watched?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "youtube_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_summaries: {
        Row: {
          created_at: string | null
          id: string
          key_points: Json | null
          summary: string | null
          updated_at: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_points?: Json | null
          summary?: string | null
          updated_at?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key_points?: Json | null
          summary?: string | null
          updated_at?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_summaries_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "youtube_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_sync_history: {
        Row: {
          api_quota_used: number | null
          completed_at: string | null
          creator_id: string | null
          error_message: string | null
          id: string
          started_at: string | null
          status: string
          videos_synced: number | null
        }
        Insert: {
          api_quota_used?: number | null
          completed_at?: string | null
          creator_id?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string
          videos_synced?: number | null
        }
        Update: {
          api_quota_used?: number | null
          completed_at?: string | null
          creator_id?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string
          videos_synced?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_sync_history_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "education_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_nonces: {
        Row: {
          created_at: string | null
          id: string
          nonce: string
          public_key: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nonce: string
          public_key: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nonce?: string
          public_key?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      welcome_nft_mints: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          channel_id: string
          created_at: string | null
          date: string | null
          duration: string | null
          education_creators: Json | null
          id: string
          thumbnail_url: string | null
          thumbnailurl: string | null
          title: string
          updated_at: string | null
          url: string
          viewcount: number | null
        }
        Insert: {
          channel_id: string
          created_at?: string | null
          date?: string | null
          duration?: string | null
          education_creators?: Json | null
          id: string
          thumbnail_url?: string | null
          thumbnailurl?: string | null
          title: string
          updated_at?: string | null
          url: string
          viewcount?: number | null
        }
        Update: {
          channel_id?: string
          created_at?: string | null
          date?: string | null
          duration?: string | null
          education_creators?: Json | null
          id?: string
          thumbnail_url?: string | null
          thumbnailurl?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          viewcount?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string | null
          points: number | null
          rank: string | null
          siso_tokens: number | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string | null
          points?: number | null
          rank?: string | null
          siso_tokens?: number | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string | null
          points?: number | null
          rank?: string | null
          siso_tokens?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      create_user_threads_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
      point_action_type:
        | "login"
        | "complete_task"
        | "bookmark_article"
        | "analyze_article"
        | "daily_login"
        | "streak_bonus"
        | "create_project"
        | "share_content"
        | "watch_video"
        | "contribute"
      task_status: "pending" | "in_progress" | "completed" | "failed"
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
