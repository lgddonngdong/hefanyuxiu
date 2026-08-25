import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.warn('⚠️  Warning: SUPABASE_URL or SUPABASE_ANON_KEY not set.');
  console.warn('   API endpoints will return errors until Supabase is configured.');
  console.warn('   Copy .env.example to .env and fill in your Supabase credentials.');
}

// Create client with fallback dummy values to prevent crash
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: false,
    },
  }
);
