export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_request_metrics: {
        Row: {
          created_at: string
          id: number
          method: string | null
          path: string | null
          response_time_ms: number | null
          status_code: number | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          method?: string | null
          path?: string | null
          response_time_ms?: number | null
          status_code?: number | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          method?: string | null
          path?: string | null
          response_time_ms?: number | null
          status_code?: number | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_request_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_evidence: {
        Row: {
          appointment_id: string
          branch_id: string
          created_at: string
          extra_service_session_id: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          session_id: string
          tenant_id: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          appointment_id: string
          branch_id: string
          created_at?: string
          extra_service_session_id?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          session_id: string
          tenant_id: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          appointment_id?: string
          branch_id?: string
          created_at?: string
          extra_service_session_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          session_id?: string
          tenant_id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_evidence_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_evidence_extra_service_session_id_fkey"
            columns: ["extra_service_session_id"]
            isOneToOne: false
            referencedRelation: "extra_service_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_evidence_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "appointment_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_evidence_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_evidence_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_extra_services: {
        Row: {
          appointment_id: string
          branch_id: string
          created_at: string
          id: string
          notes: string | null
          price: number
          service_id: string
          tenant_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_id: string
          branch_id: string
          created_at?: string
          id?: string
          notes?: string | null
          price: number
          service_id: string
          tenant_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_id?: string
          branch_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          price?: number
          service_id?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_extra_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_extra_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_extra_services_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_extra_services_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_products: {
        Row: {
          appointment_id: string
          branch_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          tenant_id: string
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          appointment_id: string
          branch_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          tenant_id: string
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          branch_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          tenant_id?: string
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_products_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_products_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_products_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_sessions: {
        Row: {
          appointment_id: string
          branch_id: string
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          notes: string | null
          started_at: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          branch_id: string
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          branch_id?: string
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_sessions_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_sessions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          branch_id: string
          client_id: string
          created_at: string
          id: string
          notes: string | null
          service_id: string
          status: string | null
          tenant_id: string
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          branch_id: string
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          service_id: string
          status?: string | null
          tenant_id: string
          total_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          branch_id?: string
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          service_id?: string
          status?: string | null
          tenant_id?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      attention_products: {
        Row: {
          attention_id: string
          branch_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          tenant_id: string
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          attention_id: string
          branch_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          tenant_id: string
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          attention_id?: string
          branch_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          tenant_id?: string
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attention_products_attention_id_fkey"
            columns: ["attention_id"]
            isOneToOne: false
            referencedRelation: "attentions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attention_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attention_products_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attention_products_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      attention_service_products: {
        Row: {
          attention_id: string
          attention_service_id: string
          branch_id: string
          commission_rate: number
          created_at: string
          id: string
          product_id: string
          quantity: number
          tenant_id: string
          total_price: number
          unit_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attention_id: string
          attention_service_id: string
          branch_id: string
          commission_rate?: number
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          tenant_id: string
          total_price: number
          unit_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attention_id?: string
          attention_service_id?: string
          branch_id?: string
          commission_rate?: number
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          tenant_id?: string
          total_price?: number
          unit_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attention_service_products_attention_id_fkey"
            columns: ["attention_id"]
            isOneToOne: false
            referencedRelation: "attentions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attention_service_products_attention_service_id_fkey"
            columns: ["attention_service_id"]
            isOneToOne: false
            referencedRelation: "attention_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attention_service_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attention_service_products_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attention_service_products_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      attention_services: {
        Row: {
          attention_id: string
          branch_id: string
          created_at: string
          id: string
          notes: string | null
          service_id: string
          service_order: number
          service_price: number
          status: string
          tenant_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attention_id: string
          branch_id: string
          created_at?: string
          id?: string
          notes?: string | null
          service_id: string
          service_order?: number
          service_price: number
          status?: string
          tenant_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attention_id?: string
          branch_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          service_id?: string
          service_order?: number
          service_price?: number
          status?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attention_services_attention_id_fkey"
            columns: ["attention_id"]
            isOneToOne: false
            referencedRelation: "attentions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attention_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attention_services_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attention_services_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      attentions: {
        Row: {
          attention_date: string
          attention_time: string
          branch_id: string
          client_id: string
          created_at: string
          id: string
          notes: string | null
          status: string
          tenant_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          attention_date: string
          attention_time: string
          branch_id: string
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          tenant_id: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          attention_date?: string
          attention_time?: string
          branch_id?: string
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          tenant_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attentions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attentions_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attentions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          branch_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_value: Json | null
          object_id: string | null
          object_type: string | null
          old_value: Json | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          branch_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_value?: Json | null
          object_id?: string | null
          object_type?: string | null
          old_value?: Json | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          branch_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_value?: Json | null
          object_id?: string | null
          object_type?: string | null
          old_value?: Json | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      branch_status_history: {
        Row: {
          branch_id: string
          changed_at: string
          changed_by: string | null
          id: number
          status: Database["public"]["Enums"]["branch_status"]
        }
        Insert: {
          branch_id: string
          changed_at?: string
          changed_by?: string | null
          id?: number
          status: Database["public"]["Enums"]["branch_status"]
        }
        Update: {
          branch_id?: string
          changed_at?: string
          changed_by?: string | null
          id?: number
          status?: Database["public"]["Enums"]["branch_status"]
        }
        Relationships: [
          {
            foreignKeyName: "branch_status_history_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          activated_at: string | null
          address: string | null
          commercial_email: string | null
          contact_phone: string | null
          created_at: string
          currency_id: string | null
          id: string
          is_main_branch: boolean
          language_code: string | null
          latitude: number | null
          longitude: number | null
          name: string
          physical_address_line1: string | null
          physical_address_line2: string | null
          physical_city: string | null
          physical_postal_code: string | null
          physical_state: string | null
          status: Database["public"]["Enums"]["branch_status"]
          tenant_id: string
          timezone: string | null
          updated_at: string
          website: string | null
          whatsapp_phone: string | null
        }
        Insert: {
          activated_at?: string | null
          address?: string | null
          commercial_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency_id?: string | null
          id?: string
          is_main_branch?: boolean
          language_code?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          physical_address_line1?: string | null
          physical_address_line2?: string | null
          physical_city?: string | null
          physical_postal_code?: string | null
          physical_state?: string | null
          status?: Database["public"]["Enums"]["branch_status"]
          tenant_id: string
          timezone?: string | null
          updated_at?: string
          website?: string | null
          whatsapp_phone?: string | null
        }
        Update: {
          activated_at?: string | null
          address?: string | null
          commercial_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency_id?: string | null
          id?: string
          is_main_branch?: boolean
          language_code?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          physical_address_line1?: string | null
          physical_address_line2?: string | null
          physical_city?: string | null
          physical_postal_code?: string | null
          physical_state?: string | null
          status?: Database["public"]["Enums"]["branch_status"]
          tenant_id?: string
          timezone?: string | null
          updated_at?: string
          website?: string | null
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branches_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          branch_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_brands_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          branch_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_clients_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_clients_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          branch_id: string | null
          created_at: string | null
          default_currency_id: string | null
          default_language_iso_code: string | null
          default_latitude: number | null
          default_localization_id: string | null
          default_longitude: number | null
          id: string
          is_active: boolean | null
          iso_code: string
          name: string
          phone_prefix_id: string | null
          tenant_id: string | null
          timezone: string | null
          updated_at: string | null
          uses_auto_pricing: boolean
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          default_currency_id?: string | null
          default_language_iso_code?: string | null
          default_latitude?: number | null
          default_localization_id?: string | null
          default_longitude?: number | null
          id?: string
          is_active?: boolean | null
          iso_code: string
          name: string
          phone_prefix_id?: string | null
          tenant_id?: string | null
          timezone?: string | null
          updated_at?: string | null
          uses_auto_pricing?: boolean
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          default_currency_id?: string | null
          default_language_iso_code?: string | null
          default_latitude?: number | null
          default_localization_id?: string | null
          default_longitude?: number | null
          id?: string
          is_active?: boolean | null
          iso_code?: string
          name?: string
          phone_prefix_id?: string | null
          tenant_id?: string | null
          timezone?: string | null
          updated_at?: string | null
          uses_auto_pricing?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "countries_default_currency_id_fkey"
            columns: ["default_currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "countries_default_language_iso_code_fkey"
            columns: ["default_language_iso_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["iso_code"]
          },
          {
            foreignKeyName: "countries_default_localization_id_fkey"
            columns: ["default_localization_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "countries_phone_prefix_id_fkey"
            columns: ["phone_prefix_id"]
            isOneToOne: false
            referencedRelation: "phone_prefixes"
            referencedColumns: ["id"]
          },
        ]
      }
      currencies: {
        Row: {
          branch_id: string | null
          code: string
          created_at: string | null
          decimal_places: number
          decimal_separator: string
          format: string | null
          id: string
          is_active: boolean | null
          name: string
          symbol: string
          symbol_position: string
          tenant_id: string | null
          thousands_separator: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          code: string
          created_at?: string | null
          decimal_places?: number
          decimal_separator?: string
          format?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          symbol: string
          symbol_position?: string
          tenant_id?: string | null
          thousands_separator?: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          code?: string
          created_at?: string | null
          decimal_places?: number
          decimal_separator?: string
          format?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          symbol?: string
          symbol_position?: string
          tenant_id?: string | null
          thousands_separator?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          recipient_email: string
          sent_at: string
          status: string
          template_id: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          sent_at?: string
          status: string
          template_id?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          sent_at?: string
          status?: string
          template_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_queue: {
        Row: {
          attempts: number
          created_at: string
          error_message: string | null
          id: string
          last_attempt_at: string | null
          recipient_user_id: string
          status: Database["public"]["Enums"]["email_queue_status"]
          template_data: Json
          template_type: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          recipient_user_id: string
          status?: Database["public"]["Enums"]["email_queue_status"]
          template_data: Json
          template_type: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          recipient_user_id?: string
          status?: Database["public"]["Enums"]["email_queue_status"]
          template_data?: Json
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          created_at: string
          id: string
          is_active: boolean
          is_customizable: boolean
          is_disableable: boolean
          language_id: string
          name: string
          platform_id: string | null
          propagate_to_new_tenants: boolean
          subject: string
          template_type: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          body_html: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_customizable?: boolean
          is_disableable?: boolean
          language_id: string
          name: string
          platform_id?: string | null
          propagate_to_new_tenants?: boolean
          subject: string
          template_type: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_customizable?: boolean
          is_disableable?: boolean
          language_id?: string
          name?: string
          platform_id?: string | null
          propagate_to_new_tenants?: boolean
          subject?: string
          template_type?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          created_at: string | null
          error_code: string | null
          error_message: string
          id: string
          severity: string
          stack_trace: string | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_code?: string | null
          error_message: string
          id?: string
          severity?: string
          stack_trace?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_code?: string | null
          error_message?: string
          id?: string
          severity?: string
          stack_trace?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          base_currency_code: string
          id: string
          last_updated_at: string
          rate: number
          target_currency_code: string
        }
        Insert: {
          base_currency_code: string
          id?: string
          last_updated_at?: string
          rate: number
          target_currency_code: string
        }
        Update: {
          base_currency_code?: string
          id?: string
          last_updated_at?: string
          rate?: number
          target_currency_code?: string
        }
        Relationships: []
      }
      extra_service_sessions: {
        Row: {
          appointment_id: string
          branch_id: string
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          extra_service_id: string
          id: string
          notes: string | null
          started_at: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          branch_id: string
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          extra_service_id: string
          id?: string
          notes?: string | null
          started_at?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          branch_id?: string
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          extra_service_id?: string
          id?: string
          notes?: string | null
          started_at?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "extra_service_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extra_service_sessions_extra_service_id_fkey"
            columns: ["extra_service_id"]
            isOneToOne: false
            referencedRelation: "appointment_extra_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_extra_service_sessions_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_extra_service_sessions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      generic_taxes: {
        Row: {
          country_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          rate: number
          updated_at: string
        }
        Insert: {
          country_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          rate: number
          updated_at?: string
        }
        Update: {
          country_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generic_taxes_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      global_settings: {
        Row: {
          address: string | null
          base_currency_id: string | null
          company_name: string | null
          contact_email: string | null
          default_tax_name: string | null
          default_tax_rate: number | null
          id: number
          trial_duration_days: number
          trial_grace_period_days: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          base_currency_id?: string | null
          company_name?: string | null
          contact_email?: string | null
          default_tax_name?: string | null
          default_tax_rate?: number | null
          id: number
          trial_duration_days?: number
          trial_grace_period_days?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          base_currency_id?: string | null
          company_name?: string | null
          contact_email?: string | null
          default_tax_name?: string | null
          default_tax_rate?: number | null
          id?: number
          trial_duration_days?: number
          trial_grace_period_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "global_settings_base_currency_id_fkey"
            columns: ["base_currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_auth_methods: {
        Row: {
          config_schema: Json | null
          created_at: string | null
          description: string | null
          id: string
          method: string
          updated_at: string | null
        }
        Insert: {
          config_schema?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          method: string
          updated_at?: string | null
        }
        Update: {
          config_schema?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          method?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_body_formats: {
        Row: {
          created_at: string | null
          description: string | null
          format: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          format: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          format?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_http_methods: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          method: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          method: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          method?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_providers: {
        Row: {
          api_schema: Json
          auth_method_id: string | null
          authentication_config: Json | null
          body_format_id: string | null
          body_template: string | null
          category_id: string
          config_schema: Json
          country_id: string
          created_at: string | null
          endpoints: Json
          http_headers: Json | null
          http_method_id: string | null
          id: string
          logo_url: string | null
          name: string
          response_mapping: Json | null
          slug: string
          status: string
          updated_at: string | null
        }
        Insert: {
          api_schema: Json
          auth_method_id?: string | null
          authentication_config?: Json | null
          body_format_id?: string | null
          body_template?: string | null
          category_id: string
          config_schema: Json
          country_id: string
          created_at?: string | null
          endpoints: Json
          http_headers?: Json | null
          http_method_id?: string | null
          id?: string
          logo_url?: string | null
          name: string
          response_mapping?: Json | null
          slug: string
          status: string
          updated_at?: string | null
        }
        Update: {
          api_schema?: Json
          auth_method_id?: string | null
          authentication_config?: Json | null
          body_format_id?: string | null
          body_template?: string | null
          category_id?: string
          config_schema?: Json
          country_id?: string
          created_at?: string | null
          endpoints?: Json
          http_headers?: Json | null
          http_method_id?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          response_mapping?: Json | null
          slug?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_auth_method"
            columns: ["auth_method_id"]
            isOneToOne: false
            referencedRelation: "integration_auth_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_body_format"
            columns: ["body_format_id"]
            isOneToOne: false
            referencedRelation: "integration_body_formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "integration_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_country"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_http_method"
            columns: ["http_method_id"]
            isOneToOne: false
            referencedRelation: "integration_http_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_record: {
        Row: {
          access_token: string | null
          account_email: string | null
          created_at: string | null
          encrypted_refresh_token: string | null
          encryption_nonce: string | null
          id: string | null
          provider: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          account_email?: string | null
          created_at?: string | null
          encrypted_refresh_token?: string | null
          encryption_nonce?: string | null
          id?: string | null
          provider?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          account_email?: string | null
          created_at?: string | null
          encrypted_refresh_token?: string | null
          encryption_nonce?: string | null
          id?: string | null
          provider?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      integrations_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      investor_platform_shares: {
        Row: {
          created_at: string
          id: string
          investment_share: number
          platform_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          investment_share: number
          platform_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          investment_share?: number
          platform_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_platform_shares_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_platform_stakes: {
        Row: {
          created_at: string | null
          id: string
          investor_user_id: string
          platform_id: string
          stake_percentage: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          investor_user_id: string
          platform_id: string
          stake_percentage: number
        }
        Update: {
          created_at?: string | null
          id?: string
          investor_user_id?: string
          platform_id?: string
          stake_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "investor_platform_stakes_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_item_taxes: {
        Row: {
          calculated_tax_amount: number
          created_at: string
          id: string
          invoice_item_id: string
          tax_id: string
          taxable_amount: number
          updated_at: string
        }
        Insert: {
          calculated_tax_amount: number
          created_at?: string
          id?: string
          invoice_item_id: string
          tax_id: string
          taxable_amount: number
          updated_at?: string
        }
        Update: {
          calculated_tax_amount?: number
          created_at?: string
          id?: string
          invoice_item_id?: string
          tax_id?: string
          taxable_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_item_taxes_invoice_item_id_fkey"
            columns: ["invoice_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_item_taxes_tax_id_fkey"
            columns: ["tax_id"]
            isOneToOne: false
            referencedRelation: "generic_taxes"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          item_type: string
          product_id: string | null
          quantity: number
          subscription_plan_id: string | null
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          item_type: string
          product_id?: string | null
          quantity: number
          subscription_plan_id?: string | null
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          item_type?: string
          product_id?: string | null
          quantity?: number
          subscription_plan_id?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          billed_to_client_id: string | null
          billed_to_tenant_id: string | null
          created_at: string
          currency_id: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          status: string
          subtotal_amount: number
          tenant_id: string
          total_amount: number
          total_tax_amount: number
          updated_at: string
        }
        Insert: {
          billed_to_client_id?: string | null
          billed_to_tenant_id?: string | null
          created_at?: string
          currency_id: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          status?: string
          subtotal_amount: number
          tenant_id: string
          total_amount: number
          total_tax_amount: number
          updated_at?: string
        }
        Update: {
          billed_to_client_id?: string | null
          billed_to_tenant_id?: string | null
          created_at?: string
          currency_id?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          status?: string
          subtotal_amount?: number
          tenant_id?: string
          total_amount?: number
          total_tax_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_billed_to_client_id_fkey"
            columns: ["billed_to_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_billed_to_tenant_id_fkey"
            columns: ["billed_to_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          iso_code: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          iso_code: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          iso_code?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_permissions: {
        Row: {
          branch_id: string | null
          can_access: boolean | null
          created_at: string | null
          id: string
          menu_item_name: string
          role_id: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          can_access?: boolean | null
          created_at?: string | null
          id?: string
          menu_item_name: string
          role_id: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          can_access?: boolean | null
          created_at?: string | null
          id?: string
          menu_item_name?: string
          role_id?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          actions_on_success: Json | null
          amount_in_cents: number
          created_at: string | null
          currency: string
          environment: string
          id: string
          metadata: Json | null
          reference: string
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          actions_on_success?: Json | null
          amount_in_cents: number
          created_at?: string | null
          currency: string
          environment: string
          id?: string
          metadata?: Json | null
          reference: string
          status?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          actions_on_success?: Json | null
          amount_in_cents?: number
          created_at?: string | null
          currency?: string
          environment?: string
          id?: string
          metadata?: Json | null
          reference?: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_in_cents: number
          created_at: string | null
          currency: string
          environment: string
          full_response: Json | null
          id: string
          payment_date: string
          provider: string
          provider_payment_id: string
          reference: string
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount_in_cents: number
          created_at?: string | null
          currency: string
          environment: string
          full_response?: Json | null
          id?: string
          payment_date: string
          provider: string
          provider_payment_id: string
          reference: string
          status: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount_in_cents?: number
          created_at?: string | null
          currency?: string
          environment?: string
          full_response?: Json | null
          id?: string
          payment_date?: string
          provider?: string
          provider_payment_id?: string
          reference?: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_name: string
          metric_value: number
          tenant_id: string | null
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_name: string
          metric_value: number
          tenant_id?: string | null
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_name?: string
          metric_value?: number
          tenant_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          branch_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      phone_prefixes: {
        Row: {
          country_name: string
          created_at: string | null
          id: string
          iso_code: string
          prefix: string
        }
        Insert: {
          country_name: string
          created_at?: string | null
          id?: string
          iso_code: string
          prefix: string
        }
        Update: {
          country_name?: string
          created_at?: string | null
          id?: string
          iso_code?: string
          prefix?: string
        }
        Relationships: []
      }
      plan_asset_limits: {
        Row: {
          asset_id: string
          bonus_on_extra: Json | null
          created_at: string
          extra_unit_price: number
          id: string
          overage_unit_price: number
          plan_id: string
          updated_at: string
          value: string
        }
        Insert: {
          asset_id: string
          bonus_on_extra?: Json | null
          created_at?: string
          extra_unit_price?: number
          id?: string
          overage_unit_price?: number
          plan_id: string
          updated_at?: string
          value: string
        }
        Update: {
          asset_id?: string
          bonus_on_extra?: Json | null
          created_at?: string
          extra_unit_price?: number
          id?: string
          overage_unit_price?: number
          plan_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_asset_limits_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "plan_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_asset_limits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_assets: {
        Row: {
          asset_key: string
          created_at: string
          data_type: string
          description: string | null
          id: string
          name: string
          platform_id: string
          updated_at: string
        }
        Insert: {
          asset_key: string
          created_at?: string
          data_type: string
          description?: string | null
          id?: string
          name: string
          platform_id: string
          updated_at?: string
        }
        Update: {
          asset_key?: string
          created_at?: string
          data_type?: string
          description?: string | null
          id?: string
          name?: string
          platform_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_assets_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_countries: {
        Row: {
          country_id: string
          created_at: string
          platform_id: string
        }
        Insert: {
          country_id: string
          created_at?: string
          platform_id: string
        }
        Update: {
          country_id?: string
          created_at?: string
          platform_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_countries_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_countries_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          base_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          base_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          base_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      price_tariffs: {
        Row: {
          base_price: number
          created_at: string
          currency_id: string
          effective_date: string
          id: string
          subscription_plan_id: string
        }
        Insert: {
          base_price?: number
          created_at?: string
          currency_id: string
          effective_date: string
          id?: string
          subscription_plan_id: string
        }
        Update: {
          base_price?: number
          created_at?: string
          currency_id?: string
          effective_date?: string
          id?: string
          subscription_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_tariffs_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_tariffs_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      product_user_commissions: {
        Row: {
          branch_id: string
          commission_rate: number
          created_at: string | null
          id: string
          product_id: string
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branch_id: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          product_id: string
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branch_id?: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          product_id?: string
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_stylist_commissions_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_product_stylist_commissions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stylist_commissions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          average_cost: number | null
          barcode: string | null
          branch_id: string
          brand_id: string | null
          category: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          description_i18n: Json | null
          id: string
          is_active: boolean | null
          last_purchase_cost: number | null
          max_stock: number | null
          min_stock: number | null
          name: string
          name_i18n: Json | null
          price: number
          sku: string | null
          stock_quantity: number | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          average_cost?: number | null
          barcode?: string | null
          branch_id: string
          brand_id?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          description_i18n?: Json | null
          id?: string
          is_active?: boolean | null
          last_purchase_cost?: number | null
          max_stock?: number | null
          min_stock?: number | null
          name: string
          name_i18n?: Json | null
          price: number
          sku?: string | null
          stock_quantity?: number | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          average_cost?: number | null
          barcode?: string | null
          branch_id?: string
          brand_id?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          description_i18n?: Json | null
          id?: string
          is_active?: boolean | null
          last_purchase_cost?: number | null
          max_stock?: number | null
          min_stock?: number | null
          name?: string
          name_i18n?: Json | null
          price?: number
          sku?: string | null
          stock_quantity?: number | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_products_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_items: {
        Row: {
          branch_id: string
          created_at: string | null
          id: string
          product_id: string
          purchase_id: string
          quantity: number
          tenant_id: string
          total_cost: number
          unit_cost: number
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          id?: string
          product_id: string
          purchase_id: string
          quantity?: number
          tenant_id: string
          total_cost: number
          unit_cost: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          id?: string
          product_id?: string
          purchase_id?: string
          quantity?: number
          tenant_id?: string
          total_cost?: number
          unit_cost?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchase_items_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_purchase_items_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          branch_id: string
          created_at: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          purchase_date: string
          status: string | null
          supplier_id: string | null
          supplier_name: string
          tenant_id: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          purchase_date?: string
          status?: string | null
          supplier_id?: string | null
          supplier_name: string
          tenant_id: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          purchase_date?: string
          status?: string | null
          supplier_id?: string | null
          supplier_name?: string
          tenant_id?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchases_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_purchases_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      schedule_templates: {
        Row: {
          branch_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_schedule_templates_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          branch_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_categories_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_evidence: {
        Row: {
          attention_id: string
          branch_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          service_session_id: string
          tenant_id: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          attention_id: string
          branch_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          service_session_id: string
          tenant_id: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          attention_id?: string
          branch_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          service_session_id?: string
          tenant_id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_evidence_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_service_evidence_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_evidence_attention_id_fkey"
            columns: ["attention_id"]
            isOneToOne: false
            referencedRelation: "attentions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_evidence_service_session_id_fkey"
            columns: ["service_session_id"]
            isOneToOne: false
            referencedRelation: "service_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      service_sessions: {
        Row: {
          attention_service_id: string
          branch_id: string
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          notes: string | null
          started_at: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          attention_service_id: string
          branch_id: string
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          attention_service_id?: string
          branch_id?: string
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_sessions_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_service_sessions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_sessions_attention_service_id_fkey"
            columns: ["attention_service_id"]
            isOneToOne: false
            referencedRelation: "attention_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_user_commissions: {
        Row: {
          branch_id: string
          can_perform: boolean | null
          commission_rate: number
          created_at: string | null
          id: string
          service_id: string
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branch_id: string
          can_perform?: boolean | null
          commission_rate?: number
          created_at?: string | null
          id?: string
          service_id: string
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branch_id?: string
          can_perform?: boolean | null
          commission_rate?: number
          created_at?: string | null
          id?: string
          service_id?: string
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_stylist_commissions_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_service_stylist_commissions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_stylist_commissions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          branch_id: string
          category_id: string | null
          created_at: string
          description: string | null
          description_i18n: Json | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          name_i18n: Json | null
          price: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          branch_id: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          description_i18n?: Json | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          name: string
          name_i18n?: Json | null
          price: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          branch_id?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          description_i18n?: Json | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          name_i18n?: Json | null
          price?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_services_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_services_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          tenant_id: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          tenant_id: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          tenant_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_settings_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_assets: {
        Row: {
          added_at: string
          asset_reference_id: string
          asset_type: Database["public"]["Enums"]["subscription_asset_type"]
          cancelled_at: string | null
          id: string
          price_at_addition: number
          status: Database["public"]["Enums"]["subscription_asset_status"]
          tenant_subscription_id: string
        }
        Insert: {
          added_at?: string
          asset_reference_id: string
          asset_type: Database["public"]["Enums"]["subscription_asset_type"]
          cancelled_at?: string | null
          id?: string
          price_at_addition: number
          status?: Database["public"]["Enums"]["subscription_asset_status"]
          tenant_subscription_id: string
        }
        Update: {
          added_at?: string
          asset_reference_id?: string
          asset_type?: Database["public"]["Enums"]["subscription_asset_type"]
          cancelled_at?: string | null
          id?: string
          price_at_addition?: number
          status?: Database["public"]["Enums"]["subscription_asset_status"]
          tenant_subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_assets_tenant_subscription_id_fkey"
            columns: ["tenant_subscription_id"]
            isOneToOne: false
            referencedRelation: "tenant_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_items: {
        Row: {
          added_at: string
          created_at: string
          id: string
          item_id: string | null
          item_type: string
          quantity: number
          subscription_id: string
          unit_price_at_addition: number
          updated_at: string
        }
        Insert: {
          added_at?: string
          created_at?: string
          id?: string
          item_id?: string | null
          item_type: string
          quantity?: number
          subscription_id: string
          unit_price_at_addition: number
          updated_at?: string
        }
        Update: {
          added_at?: string
          created_at?: string
          id?: string
          item_id?: string | null
          item_type?: string
          quantity?: number
          subscription_id?: string
          unit_price_at_addition?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_items_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "tenant_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          billing_frequency_months: number
          branch_id: string | null
          created_at: string | null
          description: string | null
          display_order: number
          duration_days: number
          features: string[] | null
          grace_period_days: number
          id: string
          is_active: boolean | null
          is_default_trial: boolean
          name: string
          platform_id: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_frequency_months?: number
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number
          duration_days?: number
          features?: string[] | null
          grace_period_days?: number
          id?: string
          is_active?: boolean | null
          is_default_trial?: boolean
          name: string
          platform_id: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_frequency_months?: number
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number
          duration_days?: number
          features?: string[] | null
          grace_period_days?: number
          id?: string
          is_active?: boolean | null
          is_default_trial?: boolean
          name?: string
          platform_id?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_platform"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_products: {
        Row: {
          branch_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          product_id: string
          supplier_id: string
          supplier_price: number
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          product_id: string
          supplier_id: string
          supplier_price?: number
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          product_id?: string
          supplier_id?: string
          supplier_price?: number
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_supplier_products_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_supplier_products_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          branch_id: string | null
          created_at: string | null
          email: string | null
          id: string
          identification_number: string
          identification_type: string
          is_active: boolean | null
          name: string
          phone: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          branch_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          identification_number: string
          identification_type: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          branch_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          identification_number?: string
          identification_type?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_suppliers_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_alerts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          message: string
          severity: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          severity: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          severity?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tariff_asset_prices: {
        Row: {
          asset_id: string
          created_at: string
          extra_unit_price: number
          id: string
          overage_unit_price: number
          tariff_id: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          extra_unit_price?: number
          id?: string
          overage_unit_price?: number
          tariff_id: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          extra_unit_price?: number
          id?: string
          overage_unit_price?: number
          tariff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tariff_asset_prices_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "plan_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tariff_asset_prices_tariff_id_fkey"
            columns: ["tariff_id"]
            isOneToOne: false
            referencedRelation: "price_tariffs"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_integrations: {
        Row: {
          access_token: string | null
          account_email: string | null
          created_at: string
          encrypted_credentials: string | null
          environment: string
          expires_at: string | null
          id: string
          is_active: boolean
          nonce: string | null
          provider: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          account_email?: string | null
          created_at?: string
          encrypted_credentials?: string | null
          environment?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          nonce?: string | null
          provider: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          account_email?: string | null
          created_at?: string
          encrypted_credentials?: string | null
          environment?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          nonce?: string | null
          provider?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_subscriptions: {
        Row: {
          active_plan_id: string | null
          branch_id: string | null
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          is_trial: boolean
          start_date: string
          subscription_plan_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          active_plan_id?: string | null
          branch_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_trial?: boolean
          start_date?: string
          subscription_plan_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          active_plan_id?: string | null
          branch_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_trial?: boolean
          start_date?: string
          subscription_plan_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_active_plan"
            columns: ["active_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_subscriptions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_subscriptions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_template_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          template_id: string | null
          template_type: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          template_id?: string | null
          template_type: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          template_id?: string | null
          template_type?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_template_settings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_template_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          billing_address: string | null
          commercial_email: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          country_id: string | null
          created_at: string
          default_currency_id: string | null
          default_language_code: string | null
          default_timezone: string | null
          einvoicing_email: string | null
          id: string
          integrations_mode: string
          is_active: boolean | null
          is_system_owner: boolean
          latitude: number | null
          legal_name: string | null
          logo_url: string | null
          longitude: number | null
          name: string
          notes: string | null
          physical_address_line1: string | null
          physical_address_line2: string | null
          physical_city: string | null
          physical_postal_code: string | null
          physical_state: string | null
          platform_id: string
          subscription_status: string
          tax_id: string | null
          updated_at: string
          website: string | null
          whatsapp_phone: string | null
        }
        Insert: {
          billing_address?: string | null
          commercial_email?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country_id?: string | null
          created_at?: string
          default_currency_id?: string | null
          default_language_code?: string | null
          default_timezone?: string | null
          einvoicing_email?: string | null
          id?: string
          integrations_mode?: string
          is_active?: boolean | null
          is_system_owner?: boolean
          latitude?: number | null
          legal_name?: string | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          notes?: string | null
          physical_address_line1?: string | null
          physical_address_line2?: string | null
          physical_city?: string | null
          physical_postal_code?: string | null
          physical_state?: string | null
          platform_id: string
          subscription_status?: string
          tax_id?: string | null
          updated_at?: string
          website?: string | null
          whatsapp_phone?: string | null
        }
        Update: {
          billing_address?: string | null
          commercial_email?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country_id?: string | null
          created_at?: string
          default_currency_id?: string | null
          default_language_code?: string | null
          default_timezone?: string | null
          einvoicing_email?: string | null
          id?: string
          integrations_mode?: string
          is_active?: boolean | null
          is_system_owner?: boolean
          latitude?: number | null
          legal_name?: string | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          notes?: string | null
          physical_address_line1?: string | null
          physical_address_line2?: string | null
          physical_city?: string | null
          physical_postal_code?: string | null
          physical_state?: string | null
          platform_id?: string
          subscription_status?: string
          tax_id?: string | null
          updated_at?: string
          website?: string | null
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_default_currency_id_fkey"
            columns: ["default_currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      timezones: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          offset_str: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          offset_str: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          offset_str?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          branch_id: string | null
          context: string | null
          created_at: string
          id: string
          key: string
          language_id: string
          tenant_id: string
          updated_at: string
          value: string
        }
        Insert: {
          branch_id?: string | null
          context?: string | null
          created_at?: string
          id?: string
          key: string
          language_id: string
          tenant_id: string
          updated_at?: string
          value: string
        }
        Update: {
          branch_id?: string | null
          context?: string | null
          created_at?: string
          id?: string
          key?: string
          language_id?: string
          tenant_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_translations_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          branch_id: string | null
          created_at: string | null
          id: string
          permission_id: string
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          permission_id: string
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          permission_id?: string
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_record: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          password_hash: string | null
          role_name: string | null
          tenant_id: string | null
          tenant_name: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch_id?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          password_hash?: string | null
          role_name?: string | null
          tenant_id?: string | null
          tenant_name?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch_id?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          password_hash?: string | null
          role_name?: string | null
          tenant_id?: string | null
          tenant_name?: string | null
        }
        Relationships: []
      }
      user_schedules: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
          template_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
          template_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stylist_schedules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "schedule_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_time_off: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          end_date: string
          end_time: string | null
          id: string
          notes: string | null
          reason: string | null
          start_date: string
          start_time: string | null
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_date: string
          end_time?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          start_date: string
          start_time?: string | null
          status?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_date?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          start_date?: string
          start_time?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      v_role_id: {
        Row: {
          id: string | null
        }
        Insert: {
          id?: string | null
        }
        Update: {
          id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_branches_batch: {
        Args: { p_tenant_id: string; p_branch_ids: string[] }
        Returns: Json
      }
      activate_subscription: {
        Args: {
          p_tenant_id: string
          p_plan_price_id: string
          p_payment_id: string
        }
        Returns: undefined
      }
      add_tenant_branch_columns: {
        Args: { table_name: string }
        Returns: undefined
      }
      algorithm_sign: {
        Args: { signables: string; secret: string; algorithm: string }
        Returns: string
      }
      armor: {
        Args: { "": string }
        Returns: string
      }
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      calculate_batch_activation_proration: {
        Args: { p_tenant_id: string; p_branch_ids: string[] }
        Returns: Json
      }
      change_password: {
        Args: {
          p_user_id: string
          p_current_password: string
          p_new_password: string
        }
        Returns: {
          success: boolean
          message: string
        }[]
      }
      check_asset_limit: {
        Args: { p_tenant_id: string; p_asset_key: string }
        Returns: boolean
      }
      check_superadmin_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_user_availability: {
        Args: {
          p_user_id: string
          p_appointment_date: string
          p_appointment_time: string
          p_duration_minutes: number
        }
        Returns: boolean
      }
      check_user_exists_by_email: {
        Args: { p_email: string }
        Returns: boolean
      }
      create_application_superadmin: {
        Args:
          | { p_admin_email: string }
          | { p_admin_email: string; p_application_name: string }
        Returns: Json
      }
      create_branch: {
        Args:
          | {
              p_name: string
              p_address?: string
              p_contact_phone?: string
              p_whatsapp_phone?: string
              p_commercial_email?: string
              p_website?: string
              p_physical_address_line1?: string
              p_physical_address_line2?: string
              p_physical_city?: string
              p_physical_state?: string
              p_physical_postal_code?: string
              p_latitude?: number
              p_longitude?: number
            }
          | { p_tenant_id: string; p_name: string; p_address?: string }
          | {
              p_tenant_id: string
              p_name: string
              p_address?: string
              p_contact_phone?: string
              p_whatsapp_phone?: string
              p_commercial_email?: string
              p_website?: string
              p_physical_address_line1?: string
              p_physical_address_line2?: string
              p_physical_city?: string
              p_physical_state?: string
              p_physical_postal_code?: string
              p_latitude?: number
              p_longitude?: number
            }
        Returns: {
          activated_at: string | null
          address: string | null
          commercial_email: string | null
          contact_phone: string | null
          created_at: string
          currency_id: string | null
          id: string
          is_main_branch: boolean
          language_code: string | null
          latitude: number | null
          longitude: number | null
          name: string
          physical_address_line1: string | null
          physical_address_line2: string | null
          physical_city: string | null
          physical_postal_code: string | null
          physical_state: string | null
          status: Database["public"]["Enums"]["branch_status"]
          tenant_id: string
          timezone: string | null
          updated_at: string
          website: string | null
          whatsapp_phone: string | null
        }
      }
      create_integration_category: {
        Args: { p_name: string; p_slug: string; p_description: string }
        Returns: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }[]
      }
      create_recovery_link: {
        Args: { p_user_email: string; p_user_role: string }
        Returns: Json
      }
      create_signed_avatar_upload_url: {
        Args: { p_file_path: string }
        Returns: Json
      }
      create_tenant: {
        Args: {
          tenant_name: string
          tenant_contact_person: string
          tenant_contact_email: string
          tenant_contact_phone: string
          tenant_address: string
          tenant_city: string
          tenant_country_id: string
          tenant_logo_url: string
          tenant_notes: string
          admin_email: string
          admin_password: string
          admin_language_code: string
          admin_currency_id: string
          admin_timezone: string
        }
        Returns: string
      }
      create_tenant_and_admin_logic: {
        Args: {
          p_business_name: string
          p_country_id: string
          p_default_language_code: string
          p_default_currency_id: string
          p_default_timezone: string
          p_contact_phone: string
          p_whatsapp_phone: string
          p_commercial_email: string
          p_legal_name: string
          p_tax_id: string
          p_billing_address: string
          p_einvoicing_email: string
          p_physical_address_line1: string
          p_physical_address_line2: string
          p_physical_city: string
          p_physical_state: string
          p_physical_postal_code: string
          p_website: string
          p_latitude: number
          p_longitude: number
          p_admin_email: string
          p_admin_password: string
        }
        Returns: Json
      }
      create_tenant_user: {
        Args: {
          p_email: string
          p_role_id: string
          p_tenant_id: string
          p_branch_id?: string
        }
        Returns: Json
      }
      create_tenant_with_admin: {
        Args: {
          name: string
          subscription_status: string
          country_id: string
          default_language_code: string
          default_currency_id: string
          default_timezone: string
          contact_phone: string
          whatsapp_phone: string
          commercial_email: string
          legal_name: string
          tax_id: string
          billing_address: string
          einvoicing_email: string
          physical_address_line1: string
          physical_address_line2: string
          physical_city: string
          physical_state: string
          physical_postal_code: string
          website: string
          latitude: number
          longitude: number
          admin_email: string
          admin_password: string
        }
        Returns: {
          created_tenant_id: string
        }[]
      }
      dearmor: {
        Args: { "": string }
        Returns: string
      }
      delete_branch: {
        Args: { p_tenant_id: string; p_branch_id: string }
        Returns: Json
      }
      delete_integration_category: {
        Args: { p_id: string }
        Returns: undefined
      }
      delete_tenant_cascade: {
        Args: { target_tenant_id: string }
        Returns: undefined
      }
      delete_tenant_integration: {
        Args: {
          p_tenant_id: string
          p_provider: string
          p_requesting_user_role: string
        }
        Returns: Json
      }
      disconnect_google_provider: {
        Args: {
          p_tenant_id: string
          p_provider: string
          p_requesting_user_id: string
        }
        Returns: Json
      }
      enqueue_test_email: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      gen_random_bytes: {
        Args: { "": number }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: { "": string }
        Returns: string
      }
      generate_invoice_for_subscription: {
        Args: { p_subscription_id: string }
        Returns: string
      }
      get_api_health_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_calculated_plan_prices: {
        Args: Record<PropertyKey, never>
        Returns: {
          plan_id: string
          plan_name: string
          plan_description: string
          plan_features: string[]
          billing_frequency_months: number
          price_id: string
          base_price_cop: number
          extra_branch_price_cop: number
          country_id: string
          country_name: string
          calculated_price: number
          calculated_extra_branch_price: number
          currency_code: string
          currency_symbol: string
        }[]
      }
      get_current_branch_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_role_name: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_gmail_auth_url: {
        Args: { p_tenant_id: string }
        Returns: {
          success: boolean
          url: string
          message: string
        }[]
      }
      get_google_auth_url: {
        Args: { p_tenant_id: string }
        Returns: {
          success: boolean
          url: string
          message: string
        }[]
      }
      get_integration_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }[]
      }
      get_investor_dashboard_data: {
        Args: { p_user_id: string; p_platform_id: string }
        Returns: {
          platform_name: string
          investment_share: number
          mrr: number
          arr: number
          my_mrr_share: number
          my_arr_share: number
          total_revenue_last_30_days: number
          my_revenue_share_last_30: number
        }[]
      }
      get_investors: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          full_name: string
          avatar_url: string
          platform_id: string
          platform_name: string
          stake_percentage: number
        }[]
      }
      get_my_tenant_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          billing_address: string | null
          commercial_email: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          country_id: string | null
          created_at: string
          default_currency_id: string | null
          default_language_code: string | null
          default_timezone: string | null
          einvoicing_email: string | null
          id: string
          integrations_mode: string
          is_active: boolean | null
          is_system_owner: boolean
          latitude: number | null
          legal_name: string | null
          logo_url: string | null
          longitude: number | null
          name: string
          notes: string | null
          physical_address_line1: string | null
          physical_address_line2: string | null
          physical_city: string | null
          physical_postal_code: string | null
          physical_state: string | null
          platform_id: string
          subscription_status: string
          tax_id: string | null
          updated_at: string
          website: string | null
          whatsapp_phone: string | null
        }[]
      }
      get_platform_financial_stats: {
        Args: { p_platform_id?: string }
        Returns: {
          mrr: number
          arr: number
          total_revenue_last_30_days: number
          new_tenants_last_30_days: number
          active_subscriptions: number
          payments_last_30_days: number
        }[]
      }
      get_platforms_list: {
        Args: { p_search_term?: string }
        Returns: {
          id: string
          name: string
          description: string
          base_url: string
        }[]
      }
      get_public_registration_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_subscription_plans_for_tenant: {
        Args: { p_tenant_id: string }
        Returns: {
          plan_id: string
          plan_name: string
          plan_description: string
          plan_features: string[]
          billing_frequency_months: number
          price_id: string
          calculated_price: number
          calculated_extra_branch_price: number
          currency_code: string
          currency_symbol: string
          base_price: number
          active_branches_count: number
        }[]
      }
      get_system_owner_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_table_names: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
        }[]
      }
      get_tenant_activity_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          tenant_id: string
          tenant_name: string
          total_users: number
          total_clients: number
          total_appointments: number
          total_services: number
          total_products: number
        }[]
      }
      get_tenant_branches: {
        Args:
          | { p_tenant_id: string }
          | { p_tenant_id: string; p_requesting_user_role: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      get_tenant_integrations: {
        Args: { p_tenant_id: string; p_environment?: string }
        Returns: {
          id: string
          tenant_id: string
          provider: string
          access_token: string
          account_email: string
          created_at: string
          updated_at: string
          expires_at: string
          encrypted_credentials: string
          nonce: string
          environment: string
          is_active: boolean
        }[]
      }
      get_tenant_subscription_status: {
        Args: { p_tenant_id: string }
        Returns: {
          status: string
          end_date: string
          plan_name: string
        }[]
      }
      get_tenant_users: {
        Args: { target_tenant_id: string }
        Returns: {
          assignment_id: string
          user_id: string
          email: string
          first_name: string
          last_name: string
          role_id: string
          role_name: string
          role_display_name: string
          branch_id: string
          branch_name: string
          status: string
        }[]
      }
      get_tenants: {
        Args: { p_search_term?: string; p_platform_id?: string }
        Returns: {
          id: string
          name: string
          subscription_status: string
          created_at: string
          updated_at: string
          platform: Json
          default_language_code: string
          default_currency_id: string
          default_timezone: string
          contact_person: string
          contact_email: string
          contact_phone: string
          country_id: string
          is_active: boolean
          logo_url: string
          notes: string
          legal_name: string
          tax_id: string
          billing_address: string
          website: string
          whatsapp_phone: string
          commercial_email: string
          einvoicing_email: string
          physical_address_line1: string
          physical_address_line2: string
          physical_city: string
          physical_state: string
          physical_postal_code: string
          latitude: number
          longitude: number
          integrations_mode: string
          is_system_owner: boolean
          platform_id: string
          countries: Json
        }[]
      }
      get_usage_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_logins: number
          total_appointments_created: number
          total_products_sold: number
          total_services_rendered: number
        }[]
      }
      get_user_accessible_platforms: {
        Args: Record<PropertyKey, never>
        Returns: {
          platform_id: string
        }[]
      }
      get_user_assignments: {
        Args: { p_user_id: string; p_tenant_id: string }
        Returns: {
          assignment_id: string
          user_id: string
          tenant_id: string
          role_id: string
          branch_id: string
          status: string
          role_name: string
          role_display_name: string
          branch_name: string
        }[]
      }
      get_user_by_recovery_token: {
        Args: { p_token: string }
        Returns: {
          id: string
          user_metadata: Json
        }[]
      }
      get_user_claims_from_jwt: {
        Args: { jwt_token: string }
        Returns: Json
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_tenant_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_tenant_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_tenant_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      link_user_to_tenant: {
        Args: {
          p_invoking_user_role: string
          p_tenant_id: string
          p_email: string
          p_first_name: string
          p_last_name: string
          p_password: string
        }
        Returns: Json
      }
      log_audit_action: {
        Args: {
          p_action: string
          p_object_type?: string
          p_object_id?: string
          p_old_value?: Json
          p_new_value?: Json
          p_ip_address?: unknown
          p_user_agent?: string
          p_metadata?: Json
          p_tenant_id?: string
          p_branch_id?: string
        }
        Returns: undefined
      }
      login_user: {
        Args: { p_email: string; p_password: string }
        Returns: Json
      }
      manage_subscription_lifecycles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: { "": string }
        Returns: string
      }
      register_new_tenant: {
        Args: {
          p_business_name: string
          p_admin_email: string
          p_admin_password: string
        }
        Returns: string
      }
      renew_subscription: {
        Args: { p_tenant_id: string; p_plan_id: string }
        Returns: string
      }
      set_active_integration: {
        Args: { p_integration_id: string }
        Returns: undefined
      }
      set_system_owner: {
        Args: { p_new_owner_tenant_id: string; p_platform_id: string }
        Returns: undefined
      }
      set_user_assignment: {
        Args: {
          p_target_user_id: string
          p_tenant_id: string
          p_role_id: string
          p_branch_id?: string
          p_status?: string
        }
        Returns: Json
      }
      setup_tenant_for_new_user: {
        Args:
          | { p_user_id: string }
          | { p_user_id: string; p_platform_id: string; p_tenant_data: Json }
        Returns: string
      }
      sign: {
        Args: { payload: Json; secret: string; algorithm?: string }
        Returns: string
      }
      sync_user_assignments: {
        Args: { p_target_user_id: string; p_assignments: Json }
        Returns: Json
      }
      tenant_branch_rls_policy: {
        Args: { table_tenant_id: string; table_branch_id: string }
        Returns: boolean
      }
      tenant_only_rls_policy: {
        Args: { table_tenant_id: string }
        Returns: boolean
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      trigger_system_email: {
        Args: {
          p_recipient_user_id: string
          p_template_type: string
          p_template_data: Json
        }
        Returns: undefined
      }
      trigger_test_email_for_tenant: {
        Args: { p_tenant_id: string }
        Returns: Json
      }
      try_cast_double: {
        Args: { inp: string }
        Returns: number
      }
      update_branch: {
        Args:
          | {
              p_branch_id: string
              p_name: string
              p_address?: string
              p_contact_phone?: string
              p_whatsapp_phone?: string
              p_commercial_email?: string
              p_website?: string
              p_physical_address_line1?: string
              p_physical_address_line2?: string
              p_physical_city?: string
              p_physical_state?: string
              p_physical_postal_code?: string
              p_latitude?: number
              p_longitude?: number
            }
          | {
              p_tenant_id: string
              p_branch_id: string
              p_name: string
              p_address: string
            }
          | {
              p_tenant_id: string
              p_branch_id: string
              p_name: string
              p_address?: string
              p_contact_phone?: string
              p_whatsapp_phone?: string
              p_commercial_email?: string
              p_website?: string
              p_physical_address_line1?: string
              p_physical_address_line2?: string
              p_physical_city?: string
              p_physical_state?: string
              p_physical_postal_code?: string
              p_latitude?: number
              p_longitude?: number
            }
        Returns: {
          activated_at: string | null
          address: string | null
          commercial_email: string | null
          contact_phone: string | null
          created_at: string
          currency_id: string | null
          id: string
          is_main_branch: boolean
          language_code: string | null
          latitude: number | null
          longitude: number | null
          name: string
          physical_address_line1: string | null
          physical_address_line2: string | null
          physical_city: string | null
          physical_postal_code: string | null
          physical_state: string | null
          status: Database["public"]["Enums"]["branch_status"]
          tenant_id: string
          timezone: string | null
          updated_at: string
          website: string | null
          whatsapp_phone: string | null
        }
      }
      update_integration_category: {
        Args: {
          p_id: string
          p_name: string
          p_slug: string
          p_description: string
        }
        Returns: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }[]
      }
      update_password_with_token: {
        Args: { p_token: string; p_new_password: string }
        Returns: Json
      }
      update_user_active_status: {
        Args: {
          target_user_id: string
          p_is_active: boolean
          p_user_role: string
        }
        Returns: Json
      }
      update_user_assignment_status: {
        Args: {
          p_target_user_id: string
          p_tenant_id: string
          p_new_status: string
        }
        Returns: Json
      }
      update_user_assignments: {
        Args: { p_user_id: string; p_tenant_id: string; p_assignments: Json }
        Returns: Json
      }
      update_user_password: {
        Args: { p_old_password: string; p_new_password: string }
        Returns: Json
      }
      update_user_profile: {
        Args: {
          p_user_id: string
          p_first_name: string
          p_last_name: string
          p_avatar_url: string
        }
        Returns: Json
      }
      update_user_regional_settings: {
        Args: {
          p_user_id: string
          p_country_id: string
          p_language_id: string
          p_currency_id: string
          p_timezone_id: string
        }
        Returns: undefined
      }
      upsert_integration_provider: {
        Args: {
          p_id: string
          p_name: string
          p_logo_url: string
          p_country_id: string
          p_category_id: string
          p_status: string
          p_endpoints: Json
          p_config_schema: Json
          p_api_schema: Json
        }
        Returns: {
          api_schema: Json
          auth_method_id: string | null
          authentication_config: Json | null
          body_format_id: string | null
          body_template: string | null
          category_id: string
          config_schema: Json
          country_id: string
          created_at: string | null
          endpoints: Json
          http_headers: Json | null
          http_method_id: string | null
          id: string
          logo_url: string | null
          name: string
          response_mapping: Json | null
          slug: string
          status: string
          updated_at: string | null
        }[]
      }
      upsert_tenant_integration: {
        Args: {
          p_tenant_id: string
          p_provider_slug: string
          p_encrypted_credentials: string
          p_nonce: string
          p_environment: string
          p_user_role: string
        }
        Returns: undefined
      }
      url_decode: {
        Args: { data: string }
        Returns: string
      }
      url_encode: {
        Args: { data: string } | { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
      verify: {
        Args: { token: string; secret: string; algorithm?: string }
        Returns: {
          header: Json
          payload: Json
          valid: boolean
        }[]
      }
    }
    Enums: {
      branch_status: "active" | "pending_activation" | "archived"
      email_queue_status: "PENDING" | "PROCESSING" | "SENT" | "FAILED"
      subscription_asset_status: "active" | "cancelled"
      subscription_asset_type: "branch" | "user"
      tenant_subscription_status:
        | "trial"
        | "active"
        | "inactive"
        | "cancelled"
        | "grace_period"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
      branch_status: ["active", "pending_activation", "archived"],
      email_queue_status: ["PENDING", "PROCESSING", "SENT", "FAILED"],
      subscription_asset_status: ["active", "cancelled"],
      subscription_asset_type: ["branch", "user"],
      tenant_subscription_status: [
        "trial",
        "active",
        "inactive",
        "cancelled",
        "grace_period",
      ],
    },
  },
} as const
