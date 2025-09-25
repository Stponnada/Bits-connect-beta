import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// These variables are read from the environment using import.meta.env for Vite projects.
// FIX: Using `(import.meta as any)` to bypass TypeScript errors when Vite types are not available.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_KEY;

// Create a function to initialize and export the client.
// This provides better error handling and debugging.
const initializeSupabase = (): SupabaseClient | null => {
  // First, check if the variables even exist.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables not found. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set in your deployment environment.");
    return null;
  }
  
  // Log the URL for debugging. This will show the exact value being used.
  console.log("Attempting to connect to Supabase with URL:", supabaseUrl);

  try {
    // Let the Supabase client itself validate the URL and key.
    // If they are invalid, it will throw an error which we can catch.
    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client initialized successfully.");
    return client;
  } catch (error) {
    // This will catch the "Invalid supabaseUrl" error and provide clear context.
    console.error("Failed to initialize Supabase client. Please check if the URL and Anon Key are correct.", error);
    console.error("The invalid Supabase URL provided was:", supabaseUrl);
    return null;
  }
};

// Export the initialized client. It will be null if the config is missing or invalid.
// The application's AuthProvider is responsible for checking this
// and displaying an appropriate error message to the user.
export const supabase = initializeSupabase();