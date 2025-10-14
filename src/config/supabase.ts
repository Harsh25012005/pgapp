import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aaisjnexkvvukzqncrto.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaXNqbmV4a3Z2dWt6cW5jcnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTM4ODIsImV4cCI6MjA3NDk4OTg4Mn0.WXNWjkcMYVwkQNrD56JikMXAdfo33boUcF5VOqpeQgE';
// const supabaseAnonKey = 'sbp_5e3dfe2651b42ce2fadf9ceb59e1ee021a0d5047';


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  contact_no: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// PG interface removed - properties tables no longer exist

export interface UserMetadata {
  user_id: string;
  user_type: 'user' | 'owner';
  created_at: string;
}

export type UserType = 'user' | 'owner';
