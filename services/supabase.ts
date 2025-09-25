import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// These variables are read from the environment.
// On Netlify, they must be set in the site's "Build & deploy" > "Environment" settings.
export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

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