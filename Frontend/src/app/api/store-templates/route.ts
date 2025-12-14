import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for server-side operations
// IMPORTANT: Must use SERVICE_ROLE_KEY (not anon key) to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('SUPABASE_SERVICE_ROLE_KEY is required to bypass RLS policies');
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Helper to get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  if (!supabaseAdmin) return null;

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

// GET /api/store-templates - Get current user's store template
export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { 
        error: 'Backend not configured. Missing SUPABASE_SERVICE_ROLE_KEY environment variable.',
        details: 'Please set SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables to bypass RLS policies.'
      },
      { status: 500 }
    );
  }

  const user = await getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('store_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data || null });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to get store template' },
      { status: 500 }
    );
  }
}

// POST /api/store-templates - Create or update store template
export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { 
        error: 'Backend not configured. Missing SUPABASE_SERVICE_ROLE_KEY environment variable.',
        details: 'Please set SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables to bypass RLS policies.'
      },
      { status: 500 }
    );
  }

  const user = await getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      base_template_id,
      theme_part,
      header_part,
      section_part,
      footer_part,
      store_name,
      store_subdomain
    } = body;

    // Check if template exists
    const { data: existing } = await supabaseAdmin
      .from('store_templates')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    let result;

    if (existing) {
      // Update existing
      const updateData: any = {};
      if (theme_part !== undefined) updateData.theme_part = theme_part;
      if (header_part !== undefined) updateData.header_part = header_part;
      if (section_part !== undefined) updateData.section_part = section_part;
      if (footer_part !== undefined) updateData.footer_part = footer_part;
      if (store_name !== undefined) updateData.store_name = store_name;
      if (store_subdomain !== undefined) updateData.store_subdomain = store_subdomain;
      if (base_template_id !== undefined) updateData.base_template_id = base_template_id;

      const { data, error } = await supabaseAdmin
        .from('store_templates')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      result = data;
    } else {
      // Create new
      const { data, error } = await supabaseAdmin
        .from('store_templates')
        .insert({
          user_id: user.id,
          base_template_id: base_template_id || null,
          theme_part: theme_part || {},
          header_part: header_part || {},
          section_part: section_part || [],
          footer_part: footer_part || {},
          store_name: store_name || null,
          store_subdomain: store_subdomain || null
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      result = data;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to save store template' },
      { status: 500 }
    );
  }
}

// DELETE /api/store-templates
export async function DELETE(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { 
        error: 'Backend not configured. Missing SUPABASE_SERVICE_ROLE_KEY environment variable.',
        details: 'Please set SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables to bypass RLS policies.'
      },
      { status: 500 }
    );
  }

  const user = await getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { error } = await supabaseAdmin
      .from('store_templates')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Store template deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to delete store template' },
      { status: 500 }
    );
  }
}

