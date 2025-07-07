import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'patient' | 'doctor' | 'admin'
          name: string
          locale: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'patient' | 'doctor' | 'admin'
          name: string
          locale?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'patient' | 'doctor' | 'admin'
          name?: string
          locale?: string
          created_at?: string
        }
      }
      doctors: {
        Row: {
          user_id: string
          specialty: string
          languages: string[]
          license_number: string | null
          profile_data: any
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          specialty: string
          languages?: string[]
          license_number?: string | null
          profile_data?: any
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          specialty?: string
          languages?: string[]
          license_number?: string | null
          profile_data?: any
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          scheduled_at: string
          duration_minutes: number
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          livekit_room: string | null
          notes: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          scheduled_at: string
          duration_minutes?: number
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          livekit_room?: string | null
          notes?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          scheduled_at?: string
          duration_minutes?: number
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          livekit_room?: string | null
          notes?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          user_id: string
          dob: string
          gender: string
          medical_history: any
          preferences: any
        }
        Insert: {
          user_id: string
          dob: string
          gender: string
          medical_history?: any
          preferences?: any
        }
        Update: {
          user_id?: string
          dob?: string
          gender?: string
          medical_history?: any
          preferences?: any
        }
      }
      agent_sessions: {
        Row: {
          id: string
          user_id: string
          agent_type: string
          input_text: string
          output_text: string
          started_at: string
          ended_at: string | null
          metadata: any
        }
        Insert: {
          id?: string
          user_id: string
          agent_type: string
          input_text: string
          output_text: string
          started_at?: string
          ended_at?: string | null
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          agent_type?: string
          input_text?: string
          output_text?: string
          started_at?: string
          ended_at?: string | null
          metadata?: any
        }
      }
    }
  }
}