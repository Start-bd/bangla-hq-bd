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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      business_views: {
        Row: {
          business_id: string
          id: string
          view_count: number
          viewed_at: string
        }
        Insert: {
          business_id: string
          id?: string
          view_count?: number
          viewed_at?: string
        }
        Update: {
          business_id?: string
          id?: string
          view_count?: number
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_views_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          category: string
          category_bn: string | null
          cover_url: string | null
          created_at: string
          description_bn: string | null
          description_en: string | null
          district: string | null
          division: string | null
          email: string | null
          employee_range: string | null
          facebook_url: string | null
          featured_until: string | null
          founded_year: number | null
          id: string
          is_claimed: boolean
          is_featured: boolean
          is_startup: boolean
          is_verified: boolean
          logo_url: string | null
          name_bn: string
          name_en: string
          owner_id: string | null
          phone: string | null
          plan: Database["public"]["Enums"]["business_plan"]
          plan_expires_at: string | null
          rating_avg: number
          rating_count: number
          services: Json | null
          slug: string
          status: Database["public"]["Enums"]["business_status"]
          tagline_bn: string | null
          tagline_en: string | null
          tags: string[] | null
          updated_at: string
          view_count: number
          website_url: string | null
        }
        Insert: {
          address?: string | null
          category?: string
          category_bn?: string | null
          cover_url?: string | null
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          district?: string | null
          division?: string | null
          email?: string | null
          employee_range?: string | null
          facebook_url?: string | null
          featured_until?: string | null
          founded_year?: number | null
          id?: string
          is_claimed?: boolean
          is_featured?: boolean
          is_startup?: boolean
          is_verified?: boolean
          logo_url?: string | null
          name_bn?: string
          name_en: string
          owner_id?: string | null
          phone?: string | null
          plan?: Database["public"]["Enums"]["business_plan"]
          plan_expires_at?: string | null
          rating_avg?: number
          rating_count?: number
          services?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["business_status"]
          tagline_bn?: string | null
          tagline_en?: string | null
          tags?: string[] | null
          updated_at?: string
          view_count?: number
          website_url?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          category_bn?: string | null
          cover_url?: string | null
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          district?: string | null
          division?: string | null
          email?: string | null
          employee_range?: string | null
          facebook_url?: string | null
          featured_until?: string | null
          founded_year?: number | null
          id?: string
          is_claimed?: boolean
          is_featured?: boolean
          is_startup?: boolean
          is_verified?: boolean
          logo_url?: string | null
          name_bn?: string
          name_en?: string
          owner_id?: string | null
          phone?: string | null
          plan?: Database["public"]["Enums"]["business_plan"]
          plan_expires_at?: string | null
          rating_avg?: number
          rating_count?: number
          services?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["business_status"]
          tagline_bn?: string | null
          tagline_en?: string | null
          tags?: string[] | null
          updated_at?: string
          view_count?: number
          website_url?: string | null
        }
        Relationships: []
      }
      news_posts: {
        Row: {
          author_id: string | null
          body_bn: string | null
          body_en: string | null
          cover_url: string | null
          created_at: string
          id: string
          is_published: boolean
          published_at: string | null
          title_bn: string | null
          title_en: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body_bn?: string | null
          body_en?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          title_bn?: string | null
          title_en: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body_bn?: string | null
          body_en?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          title_bn?: string | null
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          full_name_bn: string | null
          id: string
          preferred_language: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          full_name_bn?: string | null
          id: string
          preferred_language?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          full_name_bn?: string | null
          id?: string
          preferred_language?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          business_id: string
          created_at: string
          currency: string | null
          id: string
          message: string | null
          rfq_id: string
          status: string
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string
          currency?: string | null
          id?: string
          message?: string | null
          rfq_id: string
          status?: string
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          message?: string | null
          rfq_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          business_id: string
          created_at: string
          id: string
          is_active: boolean
          rating: number
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          business_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          rating: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          business_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          rating?: number
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category: string | null
          created_at: string
          currency: string | null
          deadline: string | null
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      startups: {
        Row: {
          business_id: string
          created_at: string
          funding_amount: number | null
          funding_stage: Database["public"]["Enums"]["funding_stage"] | null
          id: string
          problem_bn: string | null
          problem_en: string | null
          solution_bn: string | null
          solution_en: string | null
          team_size: number | null
          traction: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          funding_amount?: number | null
          funding_stage?: Database["public"]["Enums"]["funding_stage"] | null
          id?: string
          problem_bn?: string | null
          problem_en?: string | null
          solution_bn?: string | null
          solution_en?: string | null
          team_size?: number | null
          traction?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          funding_amount?: number | null
          funding_stage?: Database["public"]["Enums"]["funding_stage"] | null
          id?: string
          problem_bn?: string | null
          problem_en?: string | null
          solution_bn?: string | null
          solution_en?: string | null
          team_size?: number | null
          traction?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "startups_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      business_plan: "free" | "pro" | "enterprise"
      business_status: "active" | "pending" | "suspended"
      funding_stage:
        | "pre_seed"
        | "seed"
        | "series_a"
        | "series_b"
        | "series_c"
        | "ipo"
        | "bootstrapped"
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
      app_role: ["admin", "moderator", "user"],
      business_plan: ["free", "pro", "enterprise"],
      business_status: ["active", "pending", "suspended"],
      funding_stage: [
        "pre_seed",
        "seed",
        "series_a",
        "series_b",
        "series_c",
        "ipo",
        "bootstrapped",
      ],
    },
  },
} as const
