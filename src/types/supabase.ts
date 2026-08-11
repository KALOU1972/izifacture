export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id?: string
          full_name: string | null
          email: string | null
          phone: string | null
          avatar_url: string | null
          role: string
          admin_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          admin_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          admin_id?: string | null
          created_at?: string
        }
      }
      company_settings: {
        Row: {
          id: string
          user_id?: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          siret: string | null
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          siret?: string | null
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          siret?: string | null
          logo_url?: string | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id?: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id?: string
          client_id: string
          invoice_number: string
          status: string
          issue_date: string
          due_date: string
          subtotal: number
          tax_amount: number
          total: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          client_id: string
          invoice_number: string
          status?: string
          issue_date: string
          due_date: string
          subtotal?: number
          tax_amount?: number
          total?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          invoice_number?: string
          status?: string
          issue_date?: string
          due_date?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          notes?: string | null
          created_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity?: number
          unit_price?: number
          amount?: number
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          amount?: number
        }
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
