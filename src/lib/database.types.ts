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
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          role: 'admin' | 'client'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: 'admin' | 'client'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: 'admin' | 'client'
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string | null
          company_name: string
          contact_name: string | null
          email: string
          phone: string | null
          address: string | null
          status: string | null
          subscription_tier: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name: string
          contact_name?: string | null
          email: string
          phone?: string | null
          address?: string | null
          status?: string | null
          subscription_tier?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string
          contact_name?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          status?: string | null
          subscription_tier?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          client_id: string | null
          amount: number
          status: string | null
          due_date: string
          issued_date: string | null
          paid_date: string | null
          description: string | null
          items: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          client_id?: string | null
          amount: number
          status?: string | null
          due_date: string
          issued_date?: string | null
          paid_date?: string | null
          description?: string | null
          items?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          client_id?: string | null
          amount?: number
          status?: string | null
          due_date?: string
          issued_date?: string | null
          paid_date?: string | null
          description?: string | null
          items?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      calls: {
        Row: {
          id: string
          client_id: string | null
          user_id: string | null
          duration_seconds: number | null
          type: 'support' | 'sales' | 'consultation' | null
          status: string | null
          recording_url: string | null
          transcript: string | null
          sentiment: 'positive' | 'neutral' | 'negative' | null
          summary: string | null
          billable: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          user_id?: string | null
          duration_seconds?: number | null
          type?: 'support' | 'sales' | 'consultation' | null
          status?: string | null
          recording_url?: string | null
          transcript?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          summary?: string | null
          billable?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          user_id?: string | null
          duration_seconds?: number | null
          type?: 'support' | 'sales' | 'consultation' | null
          status?: string | null
          recording_url?: string | null
          transcript?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          summary?: string | null
          billable?: boolean | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          client_id: string | null
          name: string
          type: string | null
          url: string | null
          size: number | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          name: string
          type?: string | null
          url?: string | null
          size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          name?: string
          type?: string | null
          url?: string | null
          size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          client_id: string | null
          sender_id: string | null
          content: string
          is_read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          sender_id?: string | null
          content: string
          is_read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          sender_id?: string | null
          content?: string
          is_read?: boolean | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          client_id: string | null
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          attendees: Json | null
          status: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          attendees?: Json | null
          status?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          attendees?: Json | null
          status?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
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
      user_role: 'admin' | 'client'
    }
  }
}