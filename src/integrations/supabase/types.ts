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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          application_id: string | null
          category: string
          created_at: string
          deal_id: string | null
          description: string | null
          follow_up_completed: boolean
          follow_up_date: string | null
          id: string
          is_internal: boolean
          mentions: string[] | null
          merchant_id: string | null
          metadata: Json | null
          priority: string | null
          requires_follow_up: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          application_id?: string | null
          category: string
          created_at?: string
          deal_id?: string | null
          description?: string | null
          follow_up_completed?: boolean
          follow_up_date?: string | null
          id?: string
          is_internal?: boolean
          mentions?: string[] | null
          merchant_id?: string | null
          metadata?: Json | null
          priority?: string | null
          requires_follow_up?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          application_id?: string | null
          category?: string
          created_at?: string
          deal_id?: string | null
          description?: string | null
          follow_up_completed?: boolean
          follow_up_date?: string | null
          id?: string
          is_internal?: boolean
          mentions?: string[] | null
          merchant_id?: string | null
          metadata?: Json | null
          priority?: string | null
          requires_follow_up?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ambassadors: {
        Row: {
          active: boolean
          code: string
          created_at: string
          id: string
          name: string | null
          notes: string | null
          payout_pct: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          id?: string
          name?: string | null
          notes?: string | null
          payout_pct?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          id?: string
          name?: string | null
          notes?: string | null
          payout_pct?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          application_number: string
          application_type: string
          approval_recommendation: string | null
          approved_amount: number | null
          approved_factor_rate: number | null
          approved_holdback_percentage: number | null
          approved_payback_amount: number | null
          approved_payback_period: number | null
          average_daily_balance: number
          average_monthly_deposits: number
          created_at: string
          deal_id: string | null
          decision: string | null
          decision_date: string | null
          decision_notes: string | null
          decision_reason: string | null
          desired_factor_rate: number | null
          document_completeness: number
          documents: Json
          existing_mcas: Json | null
          id: string
          internal_notes: string | null
          merchant_id: string
          monthly_revenue: number
          outstanding_debts: number | null
          priority: string
          purpose_of_funds: string
          requested_amount: number
          review_completed_at: string | null
          review_started_at: string | null
          reviewed_by: string | null
          risk_score: number | null
          status: string
          submitted_at: string
          submitted_by: string | null
          tags: string[] | null
          time_to_decision: number | null
          underwriting_notes: string | null
          underwriting_status: string | null
          updated_at: string
        }
        Insert: {
          application_number: string
          application_type: string
          approval_recommendation?: string | null
          approved_amount?: number | null
          approved_factor_rate?: number | null
          approved_holdback_percentage?: number | null
          approved_payback_amount?: number | null
          approved_payback_period?: number | null
          average_daily_balance: number
          average_monthly_deposits: number
          created_at?: string
          deal_id?: string | null
          decision?: string | null
          decision_date?: string | null
          decision_notes?: string | null
          decision_reason?: string | null
          desired_factor_rate?: number | null
          document_completeness?: number
          documents?: Json
          existing_mcas?: Json | null
          id?: string
          internal_notes?: string | null
          merchant_id: string
          monthly_revenue: number
          outstanding_debts?: number | null
          priority?: string
          purpose_of_funds: string
          requested_amount: number
          review_completed_at?: string | null
          review_started_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          status?: string
          submitted_at: string
          submitted_by?: string | null
          tags?: string[] | null
          time_to_decision?: number | null
          underwriting_notes?: string | null
          underwriting_status?: string | null
          updated_at?: string
        }
        Update: {
          application_number?: string
          application_type?: string
          approval_recommendation?: string | null
          approved_amount?: number | null
          approved_factor_rate?: number | null
          approved_holdback_percentage?: number | null
          approved_payback_amount?: number | null
          approved_payback_period?: number | null
          average_daily_balance?: number
          average_monthly_deposits?: number
          created_at?: string
          deal_id?: string | null
          decision?: string | null
          decision_date?: string | null
          decision_notes?: string | null
          decision_reason?: string | null
          desired_factor_rate?: number | null
          document_completeness?: number
          documents?: Json
          existing_mcas?: Json | null
          id?: string
          internal_notes?: string | null
          merchant_id?: string
          monthly_revenue?: number
          outstanding_debts?: number | null
          priority?: string
          purpose_of_funds?: string
          requested_amount?: number
          review_completed_at?: string | null
          review_started_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          status?: string
          submitted_at?: string
          submitted_by?: string | null
          tags?: string[] | null
          time_to_decision?: number | null
          underwriting_notes?: string | null
          underwriting_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blackjack_games: {
        Row: {
          bet_amount: number
          created_at: string | null
          dealer_hand: Json | null
          dealer_score: number | null
          finished_at: string | null
          game_status: string | null
          id: string
          player_hand: Json | null
          player_id: string | null
          player_score: number | null
          room_id: string | null
        }
        Insert: {
          bet_amount: number
          created_at?: string | null
          dealer_hand?: Json | null
          dealer_score?: number | null
          finished_at?: string | null
          game_status?: string | null
          id?: string
          player_hand?: Json | null
          player_id?: string | null
          player_score?: number | null
          room_id?: string | null
        }
        Update: {
          bet_amount?: number
          created_at?: string | null
          dealer_hand?: Json | null
          dealer_score?: number | null
          finished_at?: string | null
          game_status?: string | null
          id?: string
          player_hand?: Json | null
          player_id?: string | null
          player_score?: number | null
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blackjack_games_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blackjack_games_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          author_avatar: string | null
          author_role: string | null
          category: string
          content: string
          created_at: string | null
          description: string
          featured: boolean | null
          featured_image: string | null
          id: string
          published_at: string
          read_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string
          author_avatar?: string | null
          author_role?: string | null
          category: string
          content: string
          created_at?: string | null
          description: string
          featured?: boolean | null
          featured_image?: string | null
          id?: string
          published_at: string
          read_time?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          author_avatar?: string | null
          author_role?: string | null
          category?: string
          content?: string
          created_at?: string | null
          description?: string
          featured?: boolean | null
          featured_image?: string | null
          id?: string
          published_at?: string
          read_time?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      brand_bible_leads: {
        Row: {
          created_at: string | null
          drip_stage: number | null
          email: string
          id: string
          last_sent_at: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          drip_stage?: number | null
          email: string
          id?: string
          last_sent_at?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          drip_stage?: number | null
          email?: string
          id?: string
          last_sent_at?: string | null
          name?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      client_intake: {
        Row: {
          brand: string
          budget: string
          created_at: string | null
          email: string | null
          goals: string
          id: string
          name: string
          source: string | null
        }
        Insert: {
          brand: string
          budget: string
          created_at?: string | null
          email?: string | null
          goals: string
          id?: string
          name: string
          source?: string | null
        }
        Update: {
          brand?: string
          budget?: string
          created_at?: string | null
          email?: string | null
          goals?: string
          id?: string
          name?: string
          source?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          application_date: string | null
          application_id: string | null
          approval_date: string | null
          approved_amount: number | null
          assigned_to: string | null
          commission_amount: number | null
          commission_paid: boolean
          commission_rate: number | null
          contract_sent_date: string | null
          contract_signed_date: string | null
          created_at: string
          created_by: string
          days_in_stage: number
          deal_number: string
          decline_date: string | null
          decline_notes: string | null
          decline_reason: string | null
          expected_close_date: string | null
          expected_payoff_date: string | null
          factor_rate: number
          funded_amount: number | null
          funding_date: string | null
          holdback_percentage: number | null
          id: string
          last_viewed_at: string | null
          last_viewed_by: string | null
          merchant_id: string
          notes: string | null
          payback_amount: number | null
          payback_period: number | null
          priority: string
          probability: number
          requested_amount: number
          stage: string
          status: string
          tags: string[] | null
          time_to_close: number | null
          updated_at: string
          view_count: number
        }
        Insert: {
          application_date?: string | null
          application_id?: string | null
          approval_date?: string | null
          approved_amount?: number | null
          assigned_to?: string | null
          commission_amount?: number | null
          commission_paid?: boolean
          commission_rate?: number | null
          contract_sent_date?: string | null
          contract_signed_date?: string | null
          created_at?: string
          created_by: string
          days_in_stage?: number
          deal_number: string
          decline_date?: string | null
          decline_notes?: string | null
          decline_reason?: string | null
          expected_close_date?: string | null
          expected_payoff_date?: string | null
          factor_rate: number
          funded_amount?: number | null
          funding_date?: string | null
          holdback_percentage?: number | null
          id?: string
          last_viewed_at?: string | null
          last_viewed_by?: string | null
          merchant_id: string
          notes?: string | null
          payback_amount?: number | null
          payback_period?: number | null
          priority?: string
          probability?: number
          requested_amount: number
          stage: string
          status?: string
          tags?: string[] | null
          time_to_close?: number | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          application_date?: string | null
          application_id?: string | null
          approval_date?: string | null
          approved_amount?: number | null
          assigned_to?: string | null
          commission_amount?: number | null
          commission_paid?: boolean
          commission_rate?: number | null
          contract_sent_date?: string | null
          contract_signed_date?: string | null
          created_at?: string
          created_by?: string
          days_in_stage?: number
          deal_number?: string
          decline_date?: string | null
          decline_notes?: string | null
          decline_reason?: string | null
          expected_close_date?: string | null
          expected_payoff_date?: string | null
          factor_rate?: number
          funded_amount?: number | null
          funding_date?: string | null
          holdback_percentage?: number | null
          id?: string
          last_viewed_at?: string | null
          last_viewed_by?: string | null
          merchant_id?: string
          notes?: string | null
          payback_amount?: number | null
          payback_period?: number | null
          priority?: string
          probability?: number
          requested_amount?: number
          stage?: string
          status?: string
          tags?: string[] | null
          time_to_close?: number | null
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_last_viewed_by_fkey"
            columns: ["last_viewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      designs: {
        Row: {
          back_path: string | null
          category: string
          collection: string | null
          created_at: string | null
          description: string | null
          front_path: string
          id: string
          name: string
          slug: string
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          back_path?: string | null
          category: string
          collection?: string | null
          created_at?: string | null
          description?: string | null
          front_path: string
          id?: string
          name: string
          slug: string
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          back_path?: string | null
          category?: string
          collection?: string | null
          created_at?: string | null
          description?: string | null
          front_path?: string
          id?: string
          name?: string
          slug?: string
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          access_level: string
          application_id: string | null
          category: string
          created_at: string
          deal_id: string | null
          description: string | null
          document_type: string
          download_count: number
          expiration_reminder: string | null
          expires_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          last_downloaded_at: string | null
          last_downloaded_by: string | null
          last_viewed_at: string | null
          last_viewed_by: string | null
          merchant_id: string
          original_file_name: string
          previous_version_id: string | null
          shared_with: string[] | null
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string
          uploaded_by: string
          verification_notes: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
          version: number
          view_count: number
        }
        Insert: {
          access_level?: string
          application_id?: string | null
          category: string
          created_at?: string
          deal_id?: string | null
          description?: string | null
          document_type: string
          download_count?: number
          expiration_reminder?: string | null
          expires_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          last_downloaded_at?: string | null
          last_downloaded_by?: string | null
          last_viewed_at?: string | null
          last_viewed_by?: string | null
          merchant_id: string
          original_file_name: string
          previous_version_id?: string | null
          shared_with?: string[] | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          version?: number
          view_count?: number
        }
        Update: {
          access_level?: string
          application_id?: string | null
          category?: string
          created_at?: string
          deal_id?: string | null
          description?: string | null
          document_type?: string
          download_count?: number
          expiration_reminder?: string | null
          expires_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          last_downloaded_at?: string | null
          last_downloaded_by?: string | null
          last_viewed_at?: string | null
          last_viewed_by?: string | null
          merchant_id?: string
          original_file_name?: string
          previous_version_id?: string | null
          shared_with?: string[] | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by?: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          version?: number
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_last_downloaded_by_fkey"
            columns: ["last_downloaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_last_viewed_by_fkey"
            columns: ["last_viewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ebook_downloads: {
        Row: {
          downloaded_at: string
          ebook_slug: string
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          downloaded_at?: string
          ebook_slug: string
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          downloaded_at?: string
          ebook_slug?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      game_moves: {
        Row: {
          id: string
          move_data: Json | null
          move_type: string
          player_id: string | null
          room_id: string | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          move_data?: Json | null
          move_type: string
          player_id?: string | null
          room_id?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          move_data?: Json | null
          move_type?: string
          player_id?: string | null
          room_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_moves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_moves_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          created_at: string | null
          current_state: Json | null
          game_type: string
          host_id: string | null
          id: string
          is_active: boolean | null
          max_players: number | null
          name: string
          players: string[] | null
        }
        Insert: {
          created_at?: string | null
          current_state?: Json | null
          game_type: string
          host_id?: string | null
          id?: string
          is_active?: boolean | null
          max_players?: number | null
          name: string
          players?: string[] | null
        }
        Update: {
          created_at?: string | null
          current_state?: Json | null
          game_type?: string
          host_id?: string | null
          id?: string
          is_active?: boolean | null
          max_players?: number | null
          name?: string
          players?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "game_rooms_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kv_store_64e807fc: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_9d3ae4a2: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_c914c490: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_cee922c1: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_e9f58e87: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_f6ae1954: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      merchants: {
        Row: {
          address: Json
          annual_revenue: number | null
          assigned_to: string | null
          bank_account: Json | null
          business_start_date: string
          business_type: string
          created_at: string
          created_by: string
          credit_score: number | null
          custom_fields: Json | null
          dba: string | null
          ein: string
          email: string
          id: string
          industry: string
          industry_category: string
          last_contact_date: string | null
          legal_name: string
          monthly_revenue: number | null
          next_follow_up_date: string | null
          notes: string | null
          owner: Json
          phone: string
          source: string
          status: string
          tags: string[] | null
          updated_at: string
          website: string | null
          years_in_business: number
        }
        Insert: {
          address: Json
          annual_revenue?: number | null
          assigned_to?: string | null
          bank_account?: Json | null
          business_start_date: string
          business_type: string
          created_at?: string
          created_by: string
          credit_score?: number | null
          custom_fields?: Json | null
          dba?: string | null
          ein: string
          email: string
          id?: string
          industry: string
          industry_category: string
          last_contact_date?: string | null
          legal_name: string
          monthly_revenue?: number | null
          next_follow_up_date?: string | null
          notes?: string | null
          owner: Json
          phone: string
          source: string
          status?: string
          tags?: string[] | null
          updated_at?: string
          website?: string | null
          years_in_business: number
        }
        Update: {
          address?: Json
          annual_revenue?: number | null
          assigned_to?: string | null
          bank_account?: Json | null
          business_start_date?: string
          business_type?: string
          created_at?: string
          created_by?: string
          credit_score?: number | null
          custom_fields?: Json | null
          dba?: string | null
          ein?: string
          email?: string
          id?: string
          industry?: string
          industry_category?: string
          last_contact_date?: string | null
          legal_name?: string
          monthly_revenue?: number | null
          next_follow_up_date?: string | null
          notes?: string | null
          owner?: Json
          phone?: string
          source?: string
          status?: string
          tags?: string[] | null
          updated_at?: string
          website?: string | null
          years_in_business?: number
        }
        Relationships: [
          {
            foreignKeyName: "merchants_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchants_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          body: string
          created_at: string | null
          id: string
          merchant_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          merchant_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          merchant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_details: string | null
          fulfillment_method: string
          id: string
          instagram_handle: string
          items: Json
          notes: string | null
          order_number: string
          referral_code: string | null
          status: string
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_details?: string | null
          fulfillment_method: string
          id?: string
          instagram_handle: string
          items?: Json
          notes?: string | null
          order_number: string
          referral_code?: string | null
          status?: string
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivery_details?: string | null
          fulfillment_method?: string
          id?: string
          instagram_handle?: string
          items?: Json
          notes?: string | null
          order_number?: string
          referral_code?: string | null
          status?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      photos: {
        Row: {
          data: string | null
          display_date: string | null
          id: number
          name: string | null
          size: string | null
          size_bytes: number | null
          uploaded: string | null
        }
        Insert: {
          data?: string | null
          display_date?: string | null
          id: number
          name?: string | null
          size?: string | null
          size_bytes?: number | null
          uploaded?: string | null
        }
        Update: {
          data?: string | null
          display_date?: string | null
          id?: number
          name?: string | null
          size?: string | null
          size_bytes?: number | null
          uploaded?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand_id: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotional_leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          phone: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          phone?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          phone?: string | null
          source?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          due_date: string | null
          id: string
          merchant_email: string
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          id?: string
          merchant_email: string
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          id?: string
          merchant_email?: string
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string
          email_verified: boolean
          first_name: string
          full_name: string | null
          id: string
          last_active_at: string | null
          last_login_at: string | null
          last_name: string
          login_count: number
          password_hash: string
          permissions: Json | null
          phone: string | null
          role: string
          settings: Json | null
          status: string
          team: string | null
          title: string | null
          two_factor_enabled: boolean
          two_factor_secret: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email: string
          email_verified?: boolean
          first_name: string
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          last_login_at?: string | null
          last_name: string
          login_count?: number
          password_hash: string
          permissions?: Json | null
          phone?: string | null
          role?: string
          settings?: Json | null
          status?: string
          team?: string | null
          title?: string | null
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string
          email_verified?: boolean
          first_name?: string
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          last_login_at?: string | null
          last_name?: string
          login_count?: number
          password_hash?: string
          permissions?: Json | null
          phone?: string | null
          role?: string
          settings?: Json | null
          status?: string
          team?: string | null
          title?: string | null
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ambassador_stats: {
        Row: {
          first_order_date: string | null
          fulfilled_orders: number | null
          last_order_date: string | null
          pending_orders: number | null
          referral_code: string | null
          total_orders: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      client_intake_summary: {
        Row: {
          date: string | null
          source: string | null
          total_inquiries: number | null
          unique_budget_ranges: number | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "brand" | "customer"
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
      app_role: ["admin", "brand", "customer"],
    },
  },
} as const
