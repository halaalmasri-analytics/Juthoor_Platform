import { createClient } from '@supabase/supabase-js';
import type { Artisan, Product, User } from './staticData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// We provide a fallback to prevent the app from crashing if keys are missing.
// The user MUST provide these keys in their environment for Auth to actually work.
const isConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

if (!isConfigured) {
  console.warn('Supabase URL or Anon Key is missing. Auth will not work correctly. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
}

// Create client only if configured, otherwise provide a proxy that won't throw on init
// but will warn on usage.
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => { throw new Error('Supabase not configured'); },
        signUp: async () => { throw new Error('Supabase not configured'); },
        signOut: async () => ({ error: null }),
        updateUser: async () => { throw new Error('Supabase not configured'); },
      }
    } as any;

export type { Artisan, Product, User };
