import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
  email?: string;
  // FIX: Made `updated_at` optional to accommodate partial profile queries.
  updated_at?: string;
}

export interface Post {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  author: UserProfile | null;
}

export type AppUser = SupabaseUser;