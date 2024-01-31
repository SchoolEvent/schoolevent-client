export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: {
          p_usename: string
        }
        Returns: {
          username: string
          password: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          apt_status: Database["public"]["Enums"]["appointment_status"]
          apt_type: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contacted_date: string | null
          created_at: string
          id: number
          planned_date: string | null
          school_address: string
          school_city: string
          school_name: string
          school_postal_code: string
        }
        Insert: {
          apt_status: Database["public"]["Enums"]["appointment_status"]
          apt_type?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contacted_date?: string | null
          created_at?: string
          id?: number
          planned_date?: string | null
          school_address: string
          school_city: string
          school_name: string
          school_postal_code: string
        }
        Update: {
          apt_status?: Database["public"]["Enums"]["appointment_status"]
          apt_type?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contacted_date?: string | null
          created_at?: string
          id?: number
          planned_date?: string | null
          school_address?: string
          school_city?: string
          school_name?: string
          school_postal_code?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          event_background: string | null
          event_creator_id: string | null
          event_date: string | null
          event_description: string | null
          event_name: string | null
          event_participant_id: string | null
          event_position: string | null
          event_time: string | null
          event_type: string | null
          id: number
        }
        Insert: {
          event_background?: string | null
          event_creator_id?: string | null
          event_date?: string | null
          event_description?: string | null
          event_name?: string | null
          event_participant_id?: string | null
          event_position?: string | null
          event_time?: string | null
          event_type?: string | null
          id?: number
        }
        Update: {
          event_background?: string | null
          event_creator_id?: string | null
          event_date?: string | null
          event_description?: string | null
          event_name?: string | null
          event_participant_id?: string | null
          event_position?: string | null
          event_time?: string | null
          event_type?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "events_event_creator_id_fkey"
            columns: ["event_creator_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_event_participant_id_fkey"
            columns: ["event_participant_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          school_city: string
          school_id: string
          school_name: string
          school_postal_code: string
          user_id: string
        }
        Insert: {
          id?: string
          school_city: string
          school_id: string
          school_name: string
          school_postal_code: string
          user_id: string
        }
        Update: {
          id?: string
          school_city?: string
          school_id?: string
          school_name?: string
          school_postal_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          created_at?: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_status: "to_contact" | "contacted" | "planned" | "done"
      user_role: "student" | "manager" | "admin"
      user_status: "online" | "idle" | "offline"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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
