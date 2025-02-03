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
      ai_news: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          id: string
          image_url: string | null
          impact: string
          source: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          image_url?: string | null
          impact: string
          source: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          impact?: string
          source?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_news_summaries: {
        Row: {
          created_at: string
          id: string
          news_id: string
          summary: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          news_id: string
          summary: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          news_id?: string
          summary?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_news_summaries_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: true
            referencedRelation: "ai_news"
            referencedColumns: ["id"]
          },
        ]
      }
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
      crypto_transactions: {
        Row: {
          created_at: string
          id: string
          points_exchanged: number
          status: string | null
          tokens_received: number
          transaction_hash: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_exchanged: number
          status?: string | null
          tokens_received: number
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_exchanged?: number
          status?: string | null
          tokens_received?: number
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      education_creators: {
        Row: {
          content_themes: string[] | null
          created_at: string
          description: string | null
          id: string
          member_type: string | null
          name: string
          profile_image_url: string | null
          specialization: string[] | null
          updated_at: string
          website_url: string | null
          youtube_url: string | null
          youtube_videos: Json | null
        }
        Insert: {
          content_themes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          member_type?: string | null
          name: string
          profile_image_url?: string | null
          specialization?: string[] | null
          updated_at?: string
          website_url?: string | null
          youtube_url?: string | null
          youtube_videos?: Json | null
        }
        Update: {
          content_themes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          member_type?: string | null
          name?: string
          profile_image_url?: string | null
          specialization?: string[] | null
          updated_at?: string
          website_url?: string | null
          youtube_url?: string | null
          youtube_videos?: Json | null
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
      leaderboard: {
        Row: {
          achievements: Json | null
          avatar_url: string | null
          contribution_count: number | null
          created_at: string
          id: string
          kda: number | null
          losses: number | null
          points: number | null
          rank: string | null
          referral_count: number | null
          season_rank: string | null
          siso_tokens: number | null
          updated_at: string
          user_id: string
          wins: number | null
        }
        Insert: {
          achievements?: Json | null
          avatar_url?: string | null
          contribution_count?: number | null
          created_at?: string
          id?: string
          kda?: number | null
          losses?: number | null
          points?: number | null
          rank?: string | null
          referral_count?: number | null
          season_rank?: string | null
          siso_tokens?: number | null
          updated_at?: string
          user_id: string
          wins?: number | null
        }
        Update: {
          achievements?: Json | null
          avatar_url?: string | null
          contribution_count?: number | null
          created_at?: string
          id?: string
          kda?: number | null
          losses?: number | null
          points?: number | null
          rank?: string | null
          referral_count?: number | null
          season_rank?: string | null
          siso_tokens?: number | null
          updated_at?: string
          user_id?: string
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      login_streaks: {
        Row: {
          created_at: string
          current_streak: number | null
          id: string
          last_login: string | null
          longest_streak: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_login?: string | null
          longest_streak?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_login?: string | null
          longest_streak?: number | null
          updated_at?: string
          user_id?: string
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
      news_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          news_id: string
          updated_at: string
          user_email: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          news_id: string
          updated_at?: string
          user_email: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          news_id?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_comments_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "ai_news"
            referencedColumns: ["id"]
          },
        ]
      }
      news_sources: {
        Row: {
          api_key: string | null
          created_at: string
          fetch_frequency_minutes: number | null
          id: string
          is_active: boolean | null
          last_fetched_at: string | null
          name: string
          source_type: Database["public"]["Enums"]["news_source_type"]
          updated_at: string
          url: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          fetch_frequency_minutes?: number | null
          id?: string
          is_active?: boolean | null
          last_fetched_at?: string | null
          name: string
          source_type: Database["public"]["Enums"]["news_source_type"]
          updated_at?: string
          url: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          fetch_frequency_minutes?: number | null
          id?: string
          is_active?: boolean | null
          last_fetched_at?: string | null
          name?: string
          source_type?: Database["public"]["Enums"]["news_source_type"]
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      nft_collections: {
        Row: {
          benefits: Json
          chain_id: string
          contract_address: string
          created_at: string
          crypto_cost: number
          description: string | null
          id: string
          image_url: string | null
          name: string
          opensea_url: string
          points_cost: number
          points_multiplier: number
          quantity: number
          tier: Database["public"]["Enums"]["nft_tier"]
          updated_at: string
          weekly_bonus: number
        }
        Insert: {
          benefits: Json
          chain_id: string
          contract_address: string
          created_at?: string
          crypto_cost: number
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          opensea_url: string
          points_cost: number
          points_multiplier: number
          quantity: number
          tier: Database["public"]["Enums"]["nft_tier"]
          updated_at?: string
          weekly_bonus: number
        }
        Update: {
          benefits?: Json
          chain_id?: string
          contract_address?: string
          created_at?: string
          crypto_cost?: number
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          opensea_url?: string
          points_cost?: number
          points_multiplier?: number
          quantity?: number
          tier?: Database["public"]["Enums"]["nft_tier"]
          updated_at?: string
          weekly_bonus?: number
        }
        Relationships: []
      }
      nfts: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          mint_address: string
          owner_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata: Json
          mint_address: string
          owner_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          mint_address?: string
          owner_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      point_configurations: {
        Row: {
          action: string
          cooldown_minutes: number | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          points: number
          requirements: Json | null
          updated_at: string
        }
        Insert: {
          action: string
          cooldown_minutes?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          points: number
          requirements?: Json | null
          updated_at?: string
        }
        Update: {
          action?: string
          cooldown_minutes?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          points?: number
          requirements?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      points_log: {
        Row: {
          action: string
          created_at: string
          id: string
          points_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          points_earned: number
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          points_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_budget_range: string | null
          ai_expertise_level: string | null
          ai_implementation_priorities: string[] | null
          annual_revenue_range: string | null
          automation_priorities: string[] | null
          avatar_url: string | null
          bio: string | null
          business_challenges: string[] | null
          business_name: string | null
          business_size: string | null
          business_type: string | null
          created_at: string
          current_tools_used: string[] | null
          departments: string[] | null
          email: string | null
          full_name: string | null
          geographic_markets: string[] | null
          growth_targets: Json | null
          has_completed_social_info: boolean | null
          id: string
          industry: string | null
          instagram_url: string | null
          interests: string[] | null
          linkedin_url: string | null
          long_term_goals: string[] | null
          moralis_provider_id: string | null
          points: number | null
          professional_role: string | null
          rank: string | null
          short_term_goals: string[] | null
          social_info_completed_at: string | null
          solana_wallet_address: string | null
          target_market: string[] | null
          team_size: number | null
          twitter_url: string | null
          updated_at: string
          wallet_address: string | null
          web3_metadata: Json | null
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          ai_budget_range?: string | null
          ai_expertise_level?: string | null
          ai_implementation_priorities?: string[] | null
          annual_revenue_range?: string | null
          automation_priorities?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          business_challenges?: string[] | null
          business_name?: string | null
          business_size?: string | null
          business_type?: string | null
          created_at?: string
          current_tools_used?: string[] | null
          departments?: string[] | null
          email?: string | null
          full_name?: string | null
          geographic_markets?: string[] | null
          growth_targets?: Json | null
          has_completed_social_info?: boolean | null
          id: string
          industry?: string | null
          instagram_url?: string | null
          interests?: string[] | null
          linkedin_url?: string | null
          long_term_goals?: string[] | null
          moralis_provider_id?: string | null
          points?: number | null
          professional_role?: string | null
          rank?: string | null
          short_term_goals?: string[] | null
          social_info_completed_at?: string | null
          solana_wallet_address?: string | null
          target_market?: string[] | null
          team_size?: number | null
          twitter_url?: string | null
          updated_at?: string
          wallet_address?: string | null
          web3_metadata?: Json | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          ai_budget_range?: string | null
          ai_expertise_level?: string | null
          ai_implementation_priorities?: string[] | null
          annual_revenue_range?: string | null
          automation_priorities?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          business_challenges?: string[] | null
          business_name?: string | null
          business_size?: string | null
          business_type?: string | null
          created_at?: string
          current_tools_used?: string[] | null
          departments?: string[] | null
          email?: string | null
          full_name?: string | null
          geographic_markets?: string[] | null
          growth_targets?: Json | null
          has_completed_social_info?: boolean | null
          id?: string
          industry?: string | null
          instagram_url?: string | null
          interests?: string[] | null
          linkedin_url?: string | null
          long_term_goals?: string[] | null
          moralis_provider_id?: string | null
          points?: number | null
          professional_role?: string | null
          rank?: string | null
          short_term_goals?: string[] | null
          social_info_completed_at?: string | null
          solana_wallet_address?: string | null
          target_market?: string[] | null
          team_size?: number | null
          twitter_url?: string | null
          updated_at?: string
          wallet_address?: string | null
          web3_metadata?: Json | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      project_documentation: {
        Row: {
          content: Json
          created_at: string
          id: string
          implementation_status: string | null
          priority: number | null
          related_components: string[] | null
          section: Database["public"]["Enums"]["doc_section_type"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          implementation_status?: string | null
          priority?: number | null
          related_components?: string[] | null
          section: Database["public"]["Enums"]["doc_section_type"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          implementation_status?: string | null
          priority?: number | null
          related_components?: string[] | null
          section?: Database["public"]["Enums"]["doc_section_type"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          milestone_reached: boolean | null
          referred_id: string
          referrer_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          milestone_reached?: boolean | null
          referred_id: string
          referrer_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          milestone_reached?: boolean | null
          referred_id?: string
          referrer_id?: string
          status?: string | null
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
      user_nfts: {
        Row: {
          collection_id: string | null
          created_at: string
          id: string
          points_multiplier: number | null
          rank: Database["public"]["Enums"]["user_rank"]
          tier: Database["public"]["Enums"]["nft_tier"] | null
          token_id: string
          updated_at: string
          user_id: string | null
          verified_at: string | null
          weekly_bonus: number | null
        }
        Insert: {
          collection_id?: string | null
          created_at?: string
          id?: string
          points_multiplier?: number | null
          rank?: Database["public"]["Enums"]["user_rank"]
          tier?: Database["public"]["Enums"]["nft_tier"] | null
          token_id: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
          weekly_bonus?: number | null
        }
        Update: {
          collection_id?: string | null
          created_at?: string
          id?: string
          points_multiplier?: number | null
          rank?: Database["public"]["Enums"]["user_rank"]
          tier?: Database["public"]["Enums"]["nft_tier"] | null
          token_id?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
          weekly_bonus?: number | null
        }
        Relationships: []
      }
      video_discussions: {
        Row: {
          content: string
          created_at: string
          id: string
          sentiment_score: number | null
          updated_at: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sentiment_score?: number | null
          updated_at?: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sentiment_score?: number | null
          updated_at?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_discussions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "youtube_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_summaries: {
        Row: {
          created_at: string
          id: string
          key_points: string[] | null
          summary: string
          updated_at: string
          video_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key_points?: string[] | null
          summary: string
          updated_at?: string
          video_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key_points?: string[] | null
          summary?: string
          updated_at?: string
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
      wallet_nonces: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          nonce: string
          public_key: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          nonce: string
          public_key: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          nonce?: string
          public_key?: string
        }
        Relationships: []
      }
      web3_users: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          moralis_provider_id: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          moralis_provider_id: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          moralis_provider_id?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      welcome_nft_mints: {
        Row: {
          attempted_at: string | null
          completed_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          status: Database["public"]["Enums"]["nft_mint_status"] | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["nft_mint_status"] | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["nft_mint_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      youtube_channel_details: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          channel_id: string
          channel_name: string
          channel_url: string | null
          created_at: string
          description: string | null
          id: string
          input_channel_url: string | null
          is_verified: boolean | null
          joined_date: string | null
          location: string | null
          subscriber_count: number | null
          total_videos: number | null
          total_views: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          channel_id: string
          channel_name: string
          channel_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          input_channel_url?: string | null
          is_verified?: boolean | null
          joined_date?: string | null
          location?: string | null
          subscriber_count?: number | null
          total_videos?: number | null
          total_views?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          channel_id?: string
          channel_name?: string
          channel_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          input_channel_url?: string | null
          is_verified?: boolean | null
          joined_date?: string | null
          location?: string | null
          subscriber_count?: number | null
          total_videos?: number | null
          total_views?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      youtube_channels: {
        Row: {
          channel_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          profile_image_url: string | null
          subscriber_count: number | null
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          profile_image_url?: string | null
          subscriber_count?: number | null
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          profile_image_url?: string | null
          subscriber_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          channel_details_id: string | null
          channel_id: string | null
          comment_count: number | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration: string | null
          from_channel_list_page: boolean | null
          from_ytu: boolean | null
          id: string
          input: string | null
          is_age_restricted: boolean | null
          like_count: number | null
          order: number | null
          progress_key: string | null
          progress_key_label: string | null
          progress_key_url: string | null
          published_at: string | null
          standardized_url: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          topics: string[] | null
          updated_at: string
          video_id: string
          view_count: number | null
        }
        Insert: {
          channel_details_id?: string | null
          channel_id?: string | null
          comment_count?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration?: string | null
          from_channel_list_page?: boolean | null
          from_ytu?: boolean | null
          id?: string
          input?: string | null
          is_age_restricted?: boolean | null
          like_count?: number | null
          order?: number | null
          progress_key?: string | null
          progress_key_label?: string | null
          progress_key_url?: string | null
          published_at?: string | null
          standardized_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string
          video_id: string
          view_count?: number | null
        }
        Update: {
          channel_details_id?: string | null
          channel_id?: string | null
          comment_count?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration?: string | null
          from_channel_list_page?: boolean | null
          from_ytu?: boolean | null
          id?: string
          input?: string | null
          is_age_restricted?: boolean | null
          like_count?: number | null
          order?: number | null
          progress_key?: string | null
          progress_key_label?: string | null
          progress_key_url?: string | null
          published_at?: string | null
          standardized_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string
          video_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "youtube_videos_channel_details_id_fkey"
            columns: ["channel_details_id"]
            isOneToOne: false
            referencedRelation: "youtube_channel_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youtube_videos_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "youtube_channels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_onboarding_completion: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      doc_section_type:
        | "overview"
        | "features"
        | "backend_design"
        | "data_flow"
        | "ai_integration"
        | "implementation"
        | "technical_specs"
      news_source_type: "rss" | "api" | "manual"
      nft_mint_status: "pending" | "completed" | "failed"
      nft_tier:
        | "ai_artist"
        | "system_synthesizer"
        | "algo_architect"
        | "code_crafter"
      point_action_type:
        | "daily_login"
        | "login_streak"
        | "referral_signup"
        | "referral_milestone"
        | "read_article"
        | "share_article"
        | "comment_article"
        | "suggest_article"
        | "use_tool"
        | "submit_tool"
        | "receive_tool_like"
        | "receive_tool_star"
        | "write_tool_review"
        | "watch_tutorial"
        | "submit_education"
        | "receive_education_like"
        | "receive_education_star"
        | "create_tutorial"
        | "use_automation"
        | "submit_automation"
        | "receive_automation_like"
        | "receive_automation_star"
        | "share_workflow"
        | "network_reply"
        | "network_discussion"
        | "network_referral"
        | "host_event"
        | "use_assistant"
        | "suggest_assistant"
        | "assistant_feedback"
        | "train_assistant"
        | "complete_challenge"
        | "beta_testing"
        | "report_bug"
        | "promotional_share"
      user_rank: "bronze" | "silver" | "gold" | "diamond"
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
