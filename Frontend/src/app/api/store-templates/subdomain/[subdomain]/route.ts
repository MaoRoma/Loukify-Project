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

// GET /api/store-templates/subdomain/:subdomain - Public endpoint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { 
        error: 'Backend not configured. Missing SUPABASE_SERVICE_ROLE_KEY environment variable.',
        details: 'Please set SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables to bypass RLS policies.'
      },
      { status: 500 }
    );
  }

  try {
    const { subdomain } = await params;

    // Fetch store template
    const { data: storeTemplate, error: storeError } = await supabaseAdmin
      .from('store_templates')
      .select('*')
      .eq('store_subdomain', subdomain)
      .eq('is_published', true)
      .maybeSingle();

    if (storeError || !storeTemplate) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Fetch payment method image from settings
    let paymentMethodImage = null;
    if (storeTemplate.settings_id) {
      const { data: settings } = await supabaseAdmin
        .from('settings')
        .select('payment_method_image')
        .eq('id', storeTemplate.settings_id)
        .maybeSingle();
      paymentMethodImage = settings?.payment_method_image || null;
    } else if (storeTemplate.user_id) {
      // Fallback: get settings by user email
      try {
        const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(storeTemplate.user_id);
        if (!userError && user?.user?.email) {
          const { data: settings } = await supabaseAdmin
            .from('settings')
            .select('payment_method_image')
            .eq('email_address', user.user.email)
            .maybeSingle();
          paymentMethodImage = settings?.payment_method_image || null;
        }
      } catch (userErr) {
        // If we can't get user, just continue without payment method image
        console.warn('Could not fetch user for payment method image:', userErr);
      }
    }

    // Add payment_method_image to the response
    const responseData = {
      ...storeTemplate,
      payment_method_image: paymentMethodImage
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch store by subdomain' },
      { status: 500 }
    );
  }
}

