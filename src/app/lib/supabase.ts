import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseAnonKey || 'missing-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Database types
export interface User {
  id: string;
  email: string;
  health_id: string;
  full_name: string;
  phone?: string;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  user_id: string;
  category: 'prescription' | 'lab_report' | 'vaccination' | 'scan' | 'other';
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
  is_visible_in_emergency: boolean;
}

export interface EmergencyProfile {
  id: string;
  user_id: string;
  blood_group?: string;
  allergies?: string;
  medical_conditions?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  type: 'medicine' | 'appointment';
  title: string;
  description?: string;
  reminder_date: string;
  reminder_time: string;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  is_completed: boolean;
  created_at: string;
}

// Helper function to generate unique Health ID
export const generateHealthID = (): string => {
  const prefix = 'HV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};
