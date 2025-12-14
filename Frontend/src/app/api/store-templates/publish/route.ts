import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// PUT /api/store-templates/publish
export async function PUT(request: NextRequest) {
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
    const { store_subdomain } = body;

    // Get existing template
    const { data: storeTemplate, error: fetchError } = await supabaseAdmin
      .from('store_templates')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (fetchError || !storeTemplate) {
      return NextResponse.json(
        { error: 'Store template not found. Please create your store first.' },
        { status: 404 }
      );
    }

    const updateData: any = {
      is_published: true,
      published_at: new Date().toISOString()
    };

    if (store_subdomain) {
      updateData.store_subdomain = store_subdomain;
    }

    const { data, error } = await supabaseAdmin
      .from('store_templates')
      .update(updateData)
      .eq('id', storeTemplate.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Store published successfully!',
      store_url: store_subdomain ? `${store_subdomain}.loukify.website` : null
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to publish store' },
      { status: 500 }
    );
  }
}

