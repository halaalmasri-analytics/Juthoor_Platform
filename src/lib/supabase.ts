import { createClient } from '@supabase/supabase-js';
import type { Artisan, Product, User } from './staticData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Auth will not work correctly.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export type { Artisan, Product, User };
