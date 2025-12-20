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

    // Fetch payment method image from settings - MUST be scoped to this store's user
    let paymentMethodImage = null;
    
    // Method 1: Use settings_id if available (most reliable and properly scoped)
    if (storeTemplate.settings_id) {
      const { data: settings, error: settingsError } = await supabaseAdmin
        .from('settings')
        .select('payment_method_image')
        .eq('id', storeTemplate.settings_id)
        .maybeSingle();
      
      if (!settingsError && settings?.payment_method_image) {
        const imageUrl = settings.payment_method_image.trim();
        if (imageUrl !== '') {
          paymentMethodImage = imageUrl;
        }
      }
    }
    
    // Method 2: If not found via settings_id, try by user_id and email (ensures user-specific)
    if (!paymentMethodImage && storeTemplate.user_id) {
      try {
        const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(storeTemplate.user_id);
        if (!userError && user?.user?.email) {
          // IMPORTANT: Only get settings for THIS user's email to ensure isolation
          const { data: settings, error: settingsError2 } = await supabaseAdmin
            .from('settings')
            .select('payment_method_image')
            .eq('email_address', user.user.email) // This ensures user-specific isolation
            .not('payment_method_image', 'is', null)
            .neq('payment_method_image', '') // Exclude empty strings
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (!settingsError2 && settings?.payment_method_image) {
            const imageUrl = settings.payment_method_image.trim();
            if (imageUrl !== '') {
              paymentMethodImage = imageUrl;
            }
          }
        }
      } catch (userErr) {
        // Silently fail
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

