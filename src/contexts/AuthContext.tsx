import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../lib/staticData';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to map Supabase user to our local User type
  const mapSupabaseUser = (sbUser: SupabaseUser): User => {
    return {
      id: sbUser.id,
      email: sbUser.email || '',
      user_type: (sbUser.user_metadata?.user_type as 'artisan' | 'buyer' | 'admin') || 'buyer',
      full_name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
      profile_photo_url: sbUser.user_metadata?.profile_photo_url,
    };
  };

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch (error) {
        console.error('AuthContext: Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthContext: Auth event:', event);
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp(email: string, password: string, userData: Partial<User>): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            user_type: userData.user_type || 'buyer',
            profile_photo_url: userData.profile_photo_url,
          },
        },
      });

      if (error) throw error;
      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } catch (err: any) {
      console.error('AuthContext: Signup error:', err.message);
      throw err;
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
    } catch (err: any) {
      console.error('AuthContext: Signin error:', err.message);
      throw err;
    }
  }

  async function signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err: any) {
      console.error('AuthContext: Signout error:', err.message);
      throw err;
    }
  }

  async function updateUser(data: Partial<User>): Promise<void> {
    try {
      const { data: updatedData, error } = await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          profile_photo_url: data.profile_photo_url,
          user_type: data.user_type,
        },
      });

      if (error) throw error;
      if (updatedData.user) {
        setUser(mapSupabaseUser(updatedData.user));
      }
    } catch (err: any) {
      console.error('AuthContext: Update user error:', err.message);
      throw err;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
