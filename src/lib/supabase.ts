// Supabase has been removed. Types are now in src/lib/staticData.ts.
// This file is kept as a re-export shim so that any leftover imports
// from `../lib/supabase` still resolve without breaking the build.
export type { Artisan, Product, User } from './staticData';
