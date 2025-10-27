const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'SUPABASE_URL is required. Add SUPABASE_URL to your .env (see .env.example).'
  );
}

if (!supabaseKey) {
  throw new Error(
    'SUPABASE_KEY (or SUPABASE_SERVICE_KEY / SUPABASE_ANON_KEY) is required. Add it to your .env (see .env.example).'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;