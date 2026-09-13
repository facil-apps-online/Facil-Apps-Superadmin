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
    PostgrestVersion: "14.5"
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
  public: {
    Tables: {
      api_request_metrics: {
        Row: {
          created_at: string
          id: number
          method: string | null
          path: string | null
          platform_id: string
          response_time_ms: number | null
          status_code: number | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          method?: string | null
          path?: string | null
          platform_id: string
          response_time_ms?: number | null
          status_code?: number | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: number
          method?: string | null
          path?: string | null
          platform_id?: string
          response_time_ms?: number | null
          status_code?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_request_metrics_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_request_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_purposes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          purpose_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          purpose_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          purpose_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      asset_usage_tracking: {
        Row: {
          asset_id: string
          created_at: string
          id: number
          platform_id: string
          quantity_used: number
          tenant_id: string
          updated_at: string
          usage_period_end: string
          usage_period_start: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          id?: number
          platform_id: string
          quantity_used?: number
          tenant_id: string
          updated_at?: string
          usage_period_end: string
          usage_period_start: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          id?: number
          platform_id?: string
          quantity_used?: number
          tenant_id?: string
          updated_at?: string
          usage_period_end?: string
          usage_period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_usage_tracking_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "plan_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_usage_tracking_tenant_id_fkey"
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
          ip_address: unknown
          metadata: Json | null
          module: string | null
          new_value: Json | null
          object_id: string | null
          object_type: string | null
          old_value: Json | null
          platform_id: string
          root_entity_id: string | null
          root_entity_type: string | null
          tenant_id: string
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          branch_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module?: string | null
          new_value?: Json | null
          object_id?: string | null
          object_type?: string | null
          old_value?: Json | null
          platform_id: string
          root_entity_id?: string | null
          root_entity_type?: string | null
          tenant_id: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          branch_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module?: string | null
          new_value?: Json | null
          object_id?: string | null
          object_type?: string | null
          old_value?: Json | null
          platform_id?: string
          root_entity_id?: string | null
          root_entity_type?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_entities: {
        Row: {
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country_id: string | null
          billing_postal_code: string | null
          billing_state: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          legal_name: string
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country_id?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          legal_name: string
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country_id?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          legal_name?: string
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_entities_billing_country_id_fkey"
            columns: ["billing_country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      client_email_queue: {
        Row: {
          attempts: number
          created_at: string
          error_message: string | null
          id: string
          last_attempt_at: string | null
          platform_id: string | null
          recipient_client_id: string | null
          recipient_email: string
          status: Database["public"]["Enums"]["client_email_queue_status"]
          template_data: Json | null
          template_type: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          platform_id?: string | null
          recipient_client_id?: string | null
          recipient_email: string
          status?: Database["public"]["Enums"]["client_email_queue_status"]
          template_data?: Json | null
          template_type: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          platform_id?: string | null
          recipient_client_id?: string | null
          recipient_email?: string
          status?: Database["public"]["Enums"]["client_email_queue_status"]
          template_data?: Json | null
          template_type?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_email_queue_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_email_queue_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_whatsapp_queue: {
        Row: {
          attempts: number
          created_at: string
          error_message: string | null
          id: string
          last_attempt_at: string | null
          platform_id: string | null
          recipient_client_id: string | null
          recipient_phone_number: string
          status: Database["public"]["Enums"]["client_whatsapp_queue_status"]
          template_name: string
          template_params: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          platform_id?: string | null
          recipient_client_id?: string | null
          recipient_phone_number: string
          status?: Database["public"]["Enums"]["client_whatsapp_queue_status"]
          template_name: string
          template_params?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          platform_id?: string | null
          recipient_client_id?: string | null
          recipient_phone_number?: string
          status?: Database["public"]["Enums"]["client_whatsapp_queue_status"]
          template_name?: string
          template_params?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_whatsapp_queue_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_whatsapp_queue_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          created_at: string | null
          default_currency_id: string | null
          default_language_iso_code: string | null
          default_latitude: number | null
          default_localization_id: string | null
          default_longitude: number | null
          field_placeholders: Json | null
          id: string
          is_active: boolean | null
          iso_code: string
          name: string
          phone_prefix_id: string | null
          timezones: Json | null
          updated_at: string | null
          uses_auto_pricing: boolean
        }
        Insert: {
          created_at?: string | null
          default_currency_id?: string | null
          default_language_iso_code?: string | null
          default_latitude?: number | null
          default_localization_id?: string | null
          default_longitude?: number | null
          field_placeholders?: Json | null
          id?: string
          is_active?: boolean | null
          iso_code: string
          name: string
          phone_prefix_id?: string | null
          timezones?: Json | null
          updated_at?: string | null
          uses_auto_pricing?: boolean
        }
        Update: {
          created_at?: string | null
          default_currency_id?: string | null
          default_language_iso_code?: string | null
          default_latitude?: number | null
          default_localization_id?: string | null
          default_longitude?: number | null
          field_placeholders?: Json | null
          id?: string
          is_active?: boolean | null
          iso_code?: string
          name?: string
          phone_prefix_id?: string | null
          timezones?: Json | null
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
      country_timezones: {
        Row: {
          country_id: string
          timezone_id: string
        }
        Insert: {
          country_id: string
          timezone_id: string
        }
        Update: {
          country_id?: string
          timezone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "country_timezones_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "country_timezones_timezone_id_fkey"
            columns: ["timezone_id"]
            isOneToOne: false
            referencedRelation: "timezones"
            referencedColumns: ["id"]
          },
        ]
      }
      currencies: {
        Row: {
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
          thousands_separator: string
          updated_at: string | null
        }
        Insert: {
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
          thousands_separator?: string
          updated_at?: string | null
        }
        Update: {
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
          platform_id: string
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
          platform_id: string
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
          platform_id?: string
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
          tenant_id: string | null
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
          tenant_id?: string | null
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
          tenant_id?: string | null
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
          platform_id: string | null
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
          platform_id?: string | null
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
          platform_id?: string | null
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
      infrastructure_nodes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          node_name: string
          project_url: string
          service_role_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          node_name: string
          project_url: string
          service_role_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          node_name?: string
          project_url?: string
          service_role_key?: string
          updated_at?: string
        }
        Relationships: []
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
          platform_id: string | null
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
          platform_id?: string | null
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
          platform_id?: string | null
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
      monthly_charges: {
        Row: {
          base_plan_charge: number
          billing_period_end: string
          billing_period_start: string
          created_at: string
          currency_code: string
          currency_symbol: string
          id: string
          platform_id: string
          status: string
          tenant_id: string
          total_charge: number
          total_overage_charge: number
          updated_at: string
        }
        Insert: {
          base_plan_charge?: number
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          currency_code: string
          currency_symbol: string
          id?: string
          platform_id: string
          status?: string
          tenant_id: string
          total_charge?: number
          total_overage_charge?: number
          updated_at?: string
        }
        Update: {
          base_plan_charge?: number
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          currency_code?: string
          currency_symbol?: string
          id?: string
          platform_id?: string
          status?: string
          tenant_id?: string
          total_charge?: number
          total_overage_charge?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_charges_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
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
      plan_asset_bonuses: {
        Row: {
          bonus_asset_id: string
          created_at: string
          id: string
          quantity: number
          source_asset_limit_id: string
          updated_at: string
        }
        Insert: {
          bonus_asset_id: string
          created_at?: string
          id?: string
          quantity: number
          source_asset_limit_id: string
          updated_at?: string
        }
        Update: {
          bonus_asset_id?: string
          created_at?: string
          id?: string
          quantity?: number
          source_asset_limit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_asset_bonuses_bonus_asset_fkey"
            columns: ["bonus_asset_id"]
            isOneToOne: false
            referencedRelation: "plan_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_asset_bonuses_source_limit_fkey"
            columns: ["source_asset_limit_id"]
            isOneToOne: false
            referencedRelation: "plan_asset_limits"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_asset_limits: {
        Row: {
          asset_id: string
          created_at: string
          extra_unit_price: number
          id: string
          overage_unit_price: number
          plan_country_config_id: string
          updated_at: string
          value: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          extra_unit_price?: number
          id?: string
          overage_unit_price?: number
          plan_country_config_id: string
          updated_at?: string
          value: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          extra_unit_price?: number
          id?: string
          overage_unit_price?: number
          plan_country_config_id?: string
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
            foreignKeyName: "plan_asset_limits_config_id_fkey"
            columns: ["plan_country_config_id"]
            isOneToOne: false
            referencedRelation: "plan_country_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_assets: {
        Row: {
          asset_key: string
          asset_purpose_id: string
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
          asset_purpose_id: string
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
          asset_purpose_id?: string
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
            foreignKeyName: "fk_asset_purpose"
            columns: ["asset_purpose_id"]
            isOneToOne: false
            referencedRelation: "asset_purposes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_assets_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_country_configurations: {
        Row: {
          country_id: string
          created_at: string
          features: string[] | null
          id: string
          is_active: boolean
          plan_id: string
          updated_at: string
        }
        Insert: {
          country_id: string
          created_at?: string
          features?: string[] | null
          id?: string
          is_active?: boolean
          plan_id: string
          updated_at?: string
        }
        Update: {
          country_id?: string
          created_at?: string
          features?: string[] | null
          id?: string
          is_active?: boolean
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_country_configurations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_country_configurations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_assignments: {
        Row: {
          created_at: string
          id: string
          platform_id: string
          role_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform_id: string
          role_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform_id?: string
          role_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_assignments_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          slug: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          slug: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          slug?: string
        }
        Relationships: []
      }
      platform_category_translations: {
        Row: {
          category_id: string
          locale: string
          name: string
        }
        Insert: {
          category_id: string
          locale: string
          name: string
        }
        Update: {
          category_id?: string
          locale?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "platform_categories"
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
      platform_reporting_config: {
        Row: {
          api_key_prefix: string
          created_at: string
          drive_folder_id: string | null
          id: string
          is_active: boolean
          platform_id: string
          reporting_api_key: string
          supabase_service_key: string | null
          supabase_url: string | null
          updated_at: string
        }
        Insert: {
          api_key_prefix?: string
          created_at?: string
          drive_folder_id?: string | null
          id?: string
          is_active?: boolean
          platform_id: string
          reporting_api_key: string
          supabase_service_key?: string | null
          supabase_url?: string | null
          updated_at?: string
        }
        Update: {
          api_key_prefix?: string
          created_at?: string
          drive_folder_id?: string | null
          id?: string
          is_active?: boolean
          platform_id?: string
          reporting_api_key?: string
          supabase_service_key?: string | null
          supabase_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_reporting_config_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: true
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          base_url: string | null
          category_id: string | null
          created_at: string | null
          default_currency_id: string | null
          default_language_id: string | null
          description: string | null
          description_en: string | null
          display_order: number
          id: string
          infrastructure_node_id: string | null
          is_public: boolean
          logo_url: string | null
          name: string
          slug: string
          social_facebook: string | null
          social_instagram: string | null
          status: string
          updated_at: string
        }
        Insert: {
          base_url?: string | null
          category_id?: string | null
          created_at?: string | null
          default_currency_id?: string | null
          default_language_id?: string | null
          description?: string | null
          description_en?: string | null
          display_order?: number
          id?: string
          infrastructure_node_id?: string | null
          is_public?: boolean
          logo_url?: string | null
          name: string
          slug: string
          social_facebook?: string | null
          social_instagram?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          base_url?: string | null
          category_id?: string | null
          created_at?: string | null
          default_currency_id?: string | null
          default_language_id?: string | null
          description?: string | null
          description_en?: string | null
          display_order?: number
          id?: string
          infrastructure_node_id?: string | null
          is_public?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          social_facebook?: string | null
          social_instagram?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platforms_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "platform_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platforms_default_currency_id_fkey"
            columns: ["default_currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platforms_default_language_id_fkey"
            columns: ["default_language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platforms_infrastructure_node_id_fkey"
            columns: ["infrastructure_node_id"]
            isOneToOne: false
            referencedRelation: "infrastructure_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      price_tariffs: {
        Row: {
          base_price: number
          created_at: string
          currency_id: string
          effective_date: string
          id: string
          promotional_price: number | null
          subscription_plan_id: string
        }
        Insert: {
          base_price?: number
          created_at?: string
          currency_id: string
          effective_date: string
          id?: string
          promotional_price?: number | null
          subscription_plan_id: string
        }
        Update: {
          base_price?: number
          created_at?: string
          currency_id?: string
          effective_date?: string
          id?: string
          promotional_price?: number | null
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
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          name: string
          platform_id: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          name: string
          platform_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          name?: string
          platform_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_tenant_id_fkey"
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
          platform_id: string
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
          platform_id: string
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
          platform_id?: string
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
          platform_id: string
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
          platform_id: string
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
          platform_id?: string
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
          created_at: string | null
          description: string | null
          display_order: number
          duration_days: number
          grace_period_days: number
          id: string
          is_active: boolean | null
          is_default_trial: boolean
          name: string
          platform_id: string
          updated_at: string | null
        }
        Insert: {
          billing_frequency_months?: number
          created_at?: string | null
          description?: string | null
          display_order?: number
          duration_days?: number
          grace_period_days?: number
          id?: string
          is_active?: boolean | null
          is_default_trial?: boolean
          name: string
          platform_id: string
          updated_at?: string | null
        }
        Update: {
          billing_frequency_months?: number
          created_at?: string | null
          description?: string | null
          display_order?: number
          duration_days?: number
          grace_period_days?: number
          id?: string
          is_active?: boolean | null
          is_default_trial?: boolean
          name?: string
          platform_id?: string
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
      system_alerts: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          is_resolved: boolean | null
          message: string
          platform_id: string
          resolved_at: string | null
          resolved_by: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          is_resolved?: boolean | null
          message: string
          platform_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          is_resolved?: boolean | null
          message?: string
          platform_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          type?: string
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
          platform_id: string
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
          platform_id: string
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
          platform_id?: string
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
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          is_trial: boolean
          plan_country_configuration_id: string | null
          platform_id: string
          start_date: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_trial?: boolean
          plan_country_configuration_id?: string | null
          platform_id: string
          start_date?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_trial?: boolean
          plan_country_configuration_id?: string | null
          platform_id?: string
          start_date?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_subscriptions_plan_country_configuration_id_fkey"
            columns: ["plan_country_configuration_id"]
            isOneToOne: false
            referencedRelation: "plan_country_configurations"
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
          platform_id: string
          template_id: string | null
          template_type: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform_id: string
          template_id?: string | null
          template_type: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform_id?: string
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
          description: string | null
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
          primary_color: string | null
          secondary_color: string | null
          slug: string | null
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
          description?: string | null
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
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string | null
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
          description?: string | null
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
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string | null
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
          original_countries: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          offset_str: string
          original_countries?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          offset_str?: string
          original_countries?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          actions_snapshot: Json | null
          amount_in_cents: number
          created_at: string | null
          currency: string
          environment: string
          full_response: Json | null
          id: string
          line_items: Json | null
          metadata: Json | null
          payment_method_type: string | null
          platform_id: string
          processed_at: string | null
          provider: string | null
          provider_transaction_id: string | null
          reference: string
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          actions_snapshot?: Json | null
          amount_in_cents: number
          created_at?: string | null
          currency: string
          environment?: string
          full_response?: Json | null
          id?: string
          line_items?: Json | null
          metadata?: Json | null
          payment_method_type?: string | null
          platform_id: string
          processed_at?: string | null
          provider?: string | null
          provider_transaction_id?: string | null
          reference: string
          status?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          actions_snapshot?: Json | null
          amount_in_cents?: number
          created_at?: string | null
          currency?: string
          environment?: string
          full_response?: Json | null
          id?: string
          line_items?: Json | null
          metadata?: Json | null
          payment_method_type?: string | null
          platform_id?: string
          processed_at?: string | null
          provider?: string | null
          provider_transaction_id?: string | null
          reference?: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          context: string | null
          created_at: string
          id: string
          key: string
          language_id: string
          platform_id: string | null
          updated_at: string
          value: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          id?: string
          key: string
          language_id: string
          platform_id?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          context?: string | null
          created_at?: string
          id?: string
          key?: string
          language_id?: string
          platform_id?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translations_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_invitations: {
        Row: {
          company_name: string | null
          created_at: string
          expires_at: string
          id: string
          invite_token: string
          invite_url: string
          notes: string | null
          platform_id: string
          prospect_email: string | null
          prospect_first_name: string
          prospect_last_name: string | null
          prospect_phone: string | null
          status: string
          tax_id: string | null
          tenant_id: string | null
          trial_days_override: number | null
          updated_at: string
          vendor_user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invite_token: string
          invite_url: string
          notes?: string | null
          platform_id: string
          prospect_email?: string | null
          prospect_first_name: string
          prospect_last_name?: string | null
          prospect_phone?: string | null
          status?: string
          tax_id?: string | null
          tenant_id?: string | null
          trial_days_override?: number | null
          updated_at?: string
          vendor_user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invite_token?: string
          invite_url?: string
          notes?: string | null
          platform_id?: string
          prospect_email?: string | null
          prospect_first_name?: string
          prospect_last_name?: string | null
          prospect_phone?: string | null
          status?: string
          tax_id?: string | null
          tenant_id?: string | null
          trial_days_override?: number | null
          updated_at?: string
          vendor_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_invitations_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_platform_commissions: {
        Row: {
          created_at: string
          first_payment_commission_rate: number
          id: string
          platform_id: string
          recurring_payment_commission_rate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_payment_commission_rate?: number
          id?: string
          platform_id: string
          recurring_payment_commission_rate?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_payment_commission_rate?: number
          id?: string
          platform_id?: string
          recurring_payment_commission_rate?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_platform_commissions_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_tenants: {
        Row: {
          created_at: string
          platform_id: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          platform_id: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          platform_id?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_tenants_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_subscription: {
        Args: { p_plan_id: string; p_tenant_id: string }
        Returns: Json
      }
      activate_vendor_trial_subscription: {
        Args: {
          p_platform_id: string
          p_requested_days?: number
          p_tenant_id: string
        }
        Returns: Json
      }
      algorithm_sign: {
        Args: { algorithm: string; secret: string; signables: string }
        Returns: string
      }
      bytea_to_text: { Args: { data: string }; Returns: string }
      check_superadmin_exists: { Args: never; Returns: boolean }
      clone_configurations_from_platform: {
        Args: {
          p_config_to_clone: string[]
          p_source_platform_id: string
          p_target_platform_id: string
        }
        Returns: undefined
      }
      get_api_health_stats: { Args: never; Returns: Json }
      get_calculated_plan_prices: {
        Args: { p_platform_id: string }
        Returns: {
          base_price_cop: number
          billing_frequency_months: number
          calculated_extra_branch_price: number
          calculated_price: number
          calculated_promotional_price: number
          country_id: string
          country_name: string
          currency_code: string
          currency_symbol: string
          extra_branch_price_cop: number
          is_default_trial: boolean
          plan_description: string
          plan_features: string[]
          plan_id: string
          plan_name: string
          price_id: string
        }[]
      }
      get_current_role_name: { Args: never; Returns: string }
      get_current_tenant_id: { Args: never; Returns: string }
      get_platform_financial_stats: {
        Args: { p_platform_id?: string }
        Returns: {
          active_subscriptions: number
          arr: number
          mrr: number
          new_tenants_last_30_days: number
          payments_last_30_days: number
          total_revenue_last_30_days: number
        }[]
      }
      get_platform_level_assignments: {
        Args: never
        Returns: {
          email: string
          first_name: string
          full_name: string
          id: string
          last_name: string
          platform_roles: Json
        }[]
      }
      get_platforms_stats: {
        Args: never
        Returns: {
          active_subscriptions: number
          mrr: number
          platform_id: string
          platform_name: string
        }[]
      }
      get_public_phone_prefixes: {
        Args: never
        Returns: {
          country_name: string
          created_at: string | null
          id: string
          iso_code: string
          prefix: string
        }[]
        SetofOptions: {
          from: "*"
          to: "phone_prefixes"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_public_registration_data: {
        Args: { p_platform_id: string }
        Returns: Json
      }
      get_public_subscription_plans: {
        Args: { p_country_id: string; p_platform_id: string }
        Returns: {
          active_branches_count: number
          billing_frequency_months: number
          calculated_extra_branch_price: number
          calculated_price: number
          calculated_promotional_price: number
          currency_code: string
          currency_symbol: string
          extra_branch_bonus_einvoices: number
          extra_einvoice_price: number
          included_einvoices: number
          original_base_price: number
          plan_description: string
          plan_features: string[]
          plan_id: string
          plan_name: string
          price_id: string
        }[]
      }
      get_subscription_plans_for_tenant: {
        Args: { p_platform_id: string; p_tenant_id: string }
        Returns: {
          active_branches_count: number
          base_price: number
          billing_frequency_months: number
          calculated_extra_branch_price: number
          calculated_price: number
          calculated_promotional_price: number
          currency_code: string
          currency_symbol: string
          plan_description: string
          plan_features: string[]
          plan_id: string
          plan_name: string
          price_id: string
        }[]
      }
      get_superadmin_payment_stats: { Args: never; Returns: Json }
      get_tenant_for_microsite: {
        Args: {
          p_country_iso_code: string
          p_platform_id: string
          p_slug: string
        }
        Returns: Json
      }
      get_tenant_plan_limits: {
        Args: { p_platform_id: string; p_tenant_id: string }
        Returns: {
          ends_at: string
          is_trial: boolean
          max_branches: number
          max_users: number
          plan_features: string[]
          plan_name: string
          starts_at: string
          status: string
          trial_ends_at: string
        }[]
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "http_request"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
        SetofOptions: {
          from: "*"
          to: "http_header"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      invoke_core_orphan_cleanup: { Args: never; Returns: Json }
      invoke_process_email_queue: { Args: never; Returns: Json }
      invoke_process_whatsapp_queue: { Args: never; Returns: undefined }
      is_super_admin: { Args: never; Returns: boolean }
      log_api_metric: {
        Args: {
          p_method: string
          p_path: string
          p_response_time_ms: number
          p_status_code: number
          p_tenant_id: string
        }
        Returns: undefined
      }
      log_audit_action_core: {
        Args: {
          p_action: string
          p_branch_id: string
          p_entity_id: string
          p_entity_type: string
          p_ip_address: unknown
          p_metadata: Json
          p_module: string
          p_new_value: Json
          p_old_value: Json
          p_root_entity_id: string
          p_root_entity_type: string
          p_tenant_id: string
          p_user_agent: string
          p_user_id: string
          p_user_name: string
        }
        Returns: undefined
      }
      process_branch_activation_billing: {
        Args: {
          p_current_active_count: number
          p_platform_id: string
          p_quantity_to_activate: number
          p_tenant_id: string
        }
        Returns: Json
      }
      queue_client_email: {
        Args: {
          p_recipient_client_id: string
          p_recipient_email: string
          p_template_data: Json
          p_template_type: string
          p_tenant_id: string
        }
        Returns: undefined
      }
      queue_client_whatsapp: {
        Args: {
          p_recipient_client_id: string
          p_recipient_phone_number: string
          p_template_name: string
          p_template_params: Json
          p_tenant_id: string
        }
        Returns: undefined
      }
      queue_password_reset_email: {
        Args: {
          p_email: string
          p_platform_id: string
          p_tenant_id: string
          p_token: string
        }
        Returns: Json
      }
      queue_platform_email: {
        Args: {
          p_platform_id: string
          p_recipient_client_id?: string
          p_recipient_email: string
          p_template_data: Json
          p_template_type: string
          p_tenant_id?: string
        }
        Returns: undefined
      }
      sign: {
        Args: { algorithm?: string; payload: Json; secret: string }
        Returns: string
      }
      text_to_bytea: { Args: { data: string }; Returns: string }
      try_cast_double: { Args: { inp: string }; Returns: number }
      upsert_tenant_integration: {
        Args: {
          p_encrypted_credentials: string
          p_environment: string
          p_nonce: string
          p_platform_id: string
          p_provider_slug: string
          p_tenant_id: string
          p_user_role: string
        }
        Returns: undefined
      }
      url_decode: { Args: { data: string }; Returns: string }
      url_encode: { Args: { data: string }; Returns: string }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      verify: {
        Args: { algorithm?: string; secret: string; token: string }
        Returns: {
          header: Json
          payload: Json
          valid: boolean
        }[]
      }
    }
    Enums: {
      client_email_queue_status: "PENDING" | "SENT" | "FAILED" | "PROCESSING"
      client_whatsapp_queue_status: "PENDING" | "SENT" | "FAILED" | "PROCESSING"
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
        method: unknown
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      client_email_queue_status: ["PENDING", "SENT", "FAILED", "PROCESSING"],
      client_whatsapp_queue_status: ["PENDING", "SENT", "FAILED", "PROCESSING"],
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
