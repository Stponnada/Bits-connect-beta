// FIX: Add a triple-slash directive to include Vite's client types, which are needed for `import.meta.env`.
/// <reference types="vite/client" />

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// These variables are read from the environment using import.meta.env for Vite projects.
// Your Netlify variables must be named VITE_SUPABASE_URL and VITE_SUPABASE_KEY.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a function to initialize and export the client.
// This prevents the app from crashing if env vars are missing during module load.
const initializeSupabase = (): SupabaseClient | null => {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  // This log helps developers in local environments or during build debugging.
  // The AuthContext will handle showing a user-friendly error in the UI.
  console.error("Supabase environment variables not found. The application will not be able to connect to the database.");
  return null;
};

// Export the initialized client. It will be null if the config is missing.
// The application's AuthProvider is responsible for checking this
// and displaying an appropriate error message to the user.
export const supabase = initializeSupabase();