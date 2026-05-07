import { createClient } from '@supabase/supabase-js';
import type { Artisan, Product, User } from './staticData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if keys are provided
export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

/**
 * SMART MOCK SYSTEM
 * This allows the app to be 100% functional (Login/Signup/Persistence) 
 * even if the user hasn't provided Supabase keys yet.
 */
const mockAuth = {
  getSession: async () => {
    const session = localStorage.getItem('juthoor_mock_session');
    return { data: { session: session ? JSON.parse(session) : null }, error: null };
  },
  onAuthStateChange: (callback: any) => {
    const session = localStorage.getItem('juthoor_mock_session');
    callback('SIGNED_IN', session ? JSON.parse(session) : null);
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
  signInWithPassword: async ({ email, password }: any) => {
    const users = JSON.parse(localStorage.getItem('juthoor_mock_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const session = { user: { ...user, id: user.id || 'mock-id' } };
      localStorage.setItem('juthoor_mock_session', JSON.stringify(session));
      return { data: session, error: null };
    }
    return { data: { user: null }, error: { message: 'Invalid credentials' } };
  },
  signUp: async ({ email, password, options }: any) => {
    const users = JSON.parse(localStorage.getItem('juthoor_mock_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      return { data: { user: null }, error: { message: 'User already exists' } };
    }
    
    const newUser = { 
      id: Math.random().toString(36).substr(2, 9),
      email, 
      password, 
      user_metadata: options?.data || {} 
    };
    
    users.push(newUser);
    localStorage.setItem('juthoor_mock_users', JSON.stringify(users));
    
    const session = { user: newUser };
    localStorage.setItem('juthoor_mock_session', JSON.stringify(session));
    
    return { data: { user: newUser }, error: null };
  },
  signOut: async () => {
    localStorage.removeItem('juthoor_mock_session');
    return { error: null };
  },
  updateUser: async ({ data }: any) => {
    const sessionStr = localStorage.getItem('juthoor_mock_session');
    if (!sessionStr) return { error: { message: 'No session' } };
    
    const session = JSON.parse(sessionStr);
    session.user.user_metadata = { ...session.user.user_metadata, ...data };
    
    localStorage.setItem('juthoor_mock_session', JSON.stringify(session));
    
    // Update in users list too
    const users = JSON.parse(localStorage.getItem('juthoor_mock_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === session.user.email);
    if (userIndex !== -1) {
      users[userIndex].user_metadata = session.user.user_metadata;
      localStorage.setItem('juthoor_mock_users', JSON.stringify(users));
    }
    
    return { data: session, error: null };
  }
};

// Export the client (Real or Mock)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { auth: mockAuth } as any;

if (!isSupabaseConfigured) {
  console.info('Juthoor: Using Smart Mock Auth. Add VITE_SUPABASE_URL to use real Supabase.');
}

export type { Artisan, Product, User };
