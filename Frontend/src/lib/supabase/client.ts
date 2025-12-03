import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables and provide helpful error messages
const missingVars: string[] = [];
if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (missingVars.length > 0) {
  console.error('❌ ERROR: Missing required Supabase environment variables!');
  console.error(`Missing: ${missingVars.join(', ')}`);
  console.error('\n📝 Please create a .env.local file in the Frontend/ directory with:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('\n📖 See Frontend/ENV_SETUP.md for detailed instructions.');
  console.error('\n⚠️  Authentication will not work until these variables are set.');
  console.error('\n💡 Quick fix:');
  console.error('   1. Create Frontend/.env.local');
  console.error('   2. Add your Supabase credentials');
  console.error('   3. Restart the dev server (npm run dev)');
}

// Create a single supabase client for interacting with your database
// Only create if we have valid environment variables
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  // Valid configuration - create the client normally
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} else {
  // Missing configuration - create a client that will show helpful errors
  // Use Supabase's demo credentials as placeholders to prevent initialization errors
  supabase = createClient(
    'https://demo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
}

export { supabase };

