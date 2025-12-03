import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.error('❌ ERROR: Missing required Supabase environment variables!');
  console.error('Please create a .env file in the root directory with:');
  console.error('  SUPABASE_URL=your_project_url');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.error('  SUPABASE_ANON_KEY=your_anon_key');
  console.error('\nSee SETUP_BACKEND.md for detailed instructions.');
  throw new Error('Missing required Supabase environment variables. Check console for details.');
}

// Admin client with service role key (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Regular client with anon key (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
