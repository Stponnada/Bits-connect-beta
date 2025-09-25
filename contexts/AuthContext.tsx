import React, { useState, useEffect, createContext, useContext } from 'react';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the Supabase client was successfully initialized.
    // If not, the app is missing its environment variables.
    if (!supabase) {
      setConfigError("Application is not configured. Please provide Supabase URL and Anon Key in environment variables.");
      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', initialSession.user.id)
            .single();
          if (profileError) throw profileError;
          setProfile(userProfile);
        }
      } catch (e) {
        console.error("Error fetching initial session:", e);
        setConfigError("There was an issue connecting to the service. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          try {
            const { data: userProfile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            if (error) throw error;
            setProfile(userProfile);
          } catch (e) {
            console.error("Error fetching profile on auth state change:", e);
            setProfile(null); // Clear profile on error
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    // Ensure supabase client exists before trying to sign out
    if (supabase) {
        await supabase.auth.signOut();
    }
  };
  
  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
  };

  // If there's a configuration error, render a dedicated error screen
  // instead of the main application. This prevents the "white screen of death".
  if (configError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Application Error
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{configError}</p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            If you are the developer, please check the browser console and your environment variable configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};