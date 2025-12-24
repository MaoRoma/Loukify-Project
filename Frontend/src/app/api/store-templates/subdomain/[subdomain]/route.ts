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

    console.log(`[Subdomain API] Fetching store for subdomain: "${subdomain}"`);

    // First, check if ANY store exists with this subdomain (even if not published)
    const { data: anyStore, error: anyStoreError } = await supabaseAdmin
      .from('store_templates')
      .select('id, store_subdomain, is_published, user_id')
      .eq('store_subdomain', subdomain)
      .maybeSingle();

    if (anyStoreError) {
      console.error(`[Subdomain API] Error querying store_templates:`, anyStoreError);
    }

    if (anyStore) {
      console.log(`[Subdomain API] Found store with subdomain "${subdomain}":`, {
        id: anyStore.id,
        is_published: anyStore.is_published,
        store_subdomain: anyStore.store_subdomain,
        user_id: anyStore.user_id
      });
    } else {
      console.warn(`[Subdomain API] ⚠️ No store found with subdomain "${subdomain}"`);
      // Check if there are any stores with null subdomain for debugging
      const { data: nullSubdomainStores } = await supabaseAdmin
        .from('store_templates')
        .select('id, store_subdomain, is_published, user_id')
        .is('store_subdomain', null)
        .limit(5);
      
      if (nullSubdomainStores && nullSubdomainStores.length > 0) {
        console.warn(`[Subdomain API] ⚠️ Found ${nullSubdomainStores.length} stores with NULL subdomain. This might be the issue.`);
      }
    }

    // Fetch store template (must be published)
    const { data: storeTemplate, error: storeError } = await supabaseAdmin
      .from('store_templates')
      .select('*')
      .eq('store_subdomain', subdomain)
      .eq('is_published', true)
      .maybeSingle();

    if (storeError) {
      console.error(`[Subdomain API] Database error:`, storeError);
      return NextResponse.json({ 
        error: 'Store not found',
        details: `Database error: ${storeError.message}`
      }, { status: 404 });
    }

    if (!storeTemplate) {
      console.error(`[Subdomain API] Store not found or not published for subdomain: "${subdomain}"`);
      return NextResponse.json({ 
        error: 'Store not found',
        details: `No published store found with subdomain "${subdomain}". The store may not be published or the subdomain may have been removed.`
      }, { status: 404 });
    }

    console.log(`[Subdomain API] ✅ Successfully found published store:`, {
      id: storeTemplate.id,
      store_name: storeTemplate.store_name,
      store_subdomain: storeTemplate.store_subdomain,
      is_published: storeTemplate.is_published
    });

    // Fetch payment method image - first check payment_images table, then fallbacks
    let paymentMethodImage = null;
    
    console.log(`[Payment Method] Starting search for store ${subdomain}`, {
      storeTemplateId: storeTemplate.id,
      settings_id: storeTemplate.settings_id,
      user_id: storeTemplate.user_id
    });
    
    // Method 0: Try payment_images table by store_template_id
    if (storeTemplate.id) {
      const { data: paymentImage, error: paymentImageError } = await supabaseAdmin
        .from('payment_images')
        .select('image_url')
        .eq('store_template_id', storeTemplate.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!paymentImageError && paymentImage?.image_url) {
        const imageUrl = String(paymentImage.image_url).trim();
        if (imageUrl && imageUrl !== 'null' && imageUrl !== 'undefined') {
          paymentMethodImage = imageUrl;
          console.log(`[Payment Method] ✅ Found via payment_images table for store ${subdomain}:`, paymentMethodImage);
        }
      } else if (paymentImageError) {
        console.warn(`[Payment Method] ❌ Error fetching payment_images for store ${subdomain}:`, paymentImageError);
      }
    }

    // Method 1: Use settings_id if available (most reliable and properly scoped)
    if (!paymentMethodImage && storeTemplate.settings_id) {
      console.log(`[Payment Method] Method 1: Attempting to fetch via settings_id: ${storeTemplate.settings_id} for store ${subdomain}`);
      const { data: settings, error: settingsError } = await supabaseAdmin
        .from('settings')
        .select('payment_method_image, email_address, id')
        .eq('id', storeTemplate.settings_id)
        .maybeSingle();
      
      console.log(`[Payment Method] Method 1 result for store ${subdomain}:`, { 
        found: !!settings, 
        settingsId: settings?.id,
        hasImage: !!settings?.payment_method_image,
        imageUrl: settings?.payment_method_image,
        imageUrlType: typeof settings?.payment_method_image,
        error: settingsError?.message 
      });
      
      if (!settingsError && settings) {
        if (settings.payment_method_image) {
          const imageUrl = String(settings.payment_method_image).trim();
          if (imageUrl !== '' && imageUrl !== 'null' && imageUrl !== 'undefined') {
            // Verify this settings belongs to the store's user (double-check for security)
            try {
              const { data: user } = await supabaseAdmin.auth.admin.getUserById(storeTemplate.user_id);
              if (user?.user?.email === settings.email_address) {
                paymentMethodImage = imageUrl;
                console.log(`[Payment Method] ✅ Method 1 SUCCESS: Found via settings_id for store ${subdomain}:`, paymentMethodImage);
              } else {
                console.warn(`[Payment Method] ⚠️ Method 1: Settings email mismatch for store ${subdomain}`, {
                  settingsEmail: settings.email_address,
                  storeUserEmail: user?.user?.email
                });
                // Still use it if settings_id matches (it's already linked)
                paymentMethodImage = imageUrl;
                console.log(`[Payment Method] ✅ Method 1 SUCCESS (email mismatch ignored): Found via settings_id for store ${subdomain}:`, paymentMethodImage);
              }
            } catch (verifyErr) {
              // If verification fails, still use it if settings_id matches (it's already linked)
              paymentMethodImage = imageUrl;
              console.log(`[Payment Method] ✅ Method 1 SUCCESS (verification skipped): Found via settings_id for store ${subdomain}:`, paymentMethodImage);
            }
          } else {
            console.warn(`[Payment Method] ⚠️ Method 1: Settings found but payment_method_image is empty/invalid for store ${subdomain}`, {
              imageUrl,
              length: imageUrl.length
            });
          }
        } else {
          console.warn(`[Payment Method] ⚠️ Method 1: Settings found but payment_method_image field is null/undefined for store ${subdomain}`);
        }
      } else if (settingsError) {
        console.warn(`[Payment Method] ❌ Method 1: Error fetching settings by settings_id for store ${subdomain}:`, settingsError);
      } else if (!settings) {
        console.warn(`[Payment Method] ❌ Method 1: No settings found with settings_id ${storeTemplate.settings_id} for store ${subdomain}`);
      }
    } else {
      console.warn(`[Payment Method] ⚠️ Method 1: No settings_id in store template for store ${subdomain}`);
    }
    
    // Method 2: If not found via settings_id, try by user_id and email (ensures user-specific)
    // This is CRITICAL when settings_id is null/undefined
    if (!paymentMethodImage && storeTemplate.user_id) {
      console.log(`[Payment Method] Method 2: Attempting fallback via user_id: ${storeTemplate.user_id} for store ${subdomain}`);
      try {
        const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(storeTemplate.user_id);
        if (!userError && user?.user?.email) {
          console.log(`[Payment Method] Method 2: Found user email: ${user.user.email} for store ${subdomain}`);
          
          // Try to get ALL settings for this user (don't filter by payment_method_image)
          const { data: settings, error: settingsError2 } = await supabaseAdmin
            .from('settings')
            .select('payment_method_image, id, email_address')
            .eq('email_address', user.user.email) // This ensures user-specific isolation
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          console.log(`[Payment Method] Method 2 query result for store ${subdomain}:`, { 
            found: !!settings, 
            settingsId: settings?.id,
            email: settings?.email_address,
            hasImage: !!settings?.payment_method_image,
            imageUrl: settings?.payment_method_image,
            imageUrlType: typeof settings?.payment_method_image,
            imageUrlLength: settings?.payment_method_image?.length,
            error: settingsError2?.message 
          });
          
          if (!settingsError2 && settings) {
            // If we found settings but settings_id wasn't linked, try to link it now
            if (!storeTemplate.settings_id && settings.id) {
              console.log(`[Payment Method] Method 2: 🔗 Linking settings_id ${settings.id} to store template for store ${subdomain}`);
              try {
                const { error: linkError } = await supabaseAdmin
                  .from('store_templates')
                  .update({ settings_id: settings.id })
                  .eq('id', storeTemplate.id);
                
                if (linkError) {
                  console.warn(`[Payment Method] Method 2: ⚠️ Failed to link settings_id:`, linkError);
                } else {
                  console.log(`[Payment Method] Method 2: ✅ Successfully linked settings_id ${settings.id} to store template`);
                }
              } catch (linkError) {
                console.warn(`[Payment Method] Method 2: ⚠️ Exception linking settings_id:`, linkError);
              }
            }
            
            // Check if payment_method_image exists and is not empty
            if (settings.payment_method_image) {
              const imageUrl = String(settings.payment_method_image).trim();
              if (imageUrl !== '' && imageUrl !== 'null' && imageUrl !== 'undefined') {
                paymentMethodImage = imageUrl;
                console.log(`[Payment Method] ✅ Method 2 SUCCESS: Found via user email (fallback) for store ${subdomain}:`, paymentMethodImage);
              } else {
                console.warn(`[Payment Method] ⚠️ Method 2: Settings found but payment_method_image is empty/invalid for email ${user.user.email} for store ${subdomain}`, {
                  imageUrl,
                  length: imageUrl.length
                });
              }
            } else {
              console.warn(`[Payment Method] ⚠️ Method 2: Settings found but payment_method_image field is null/undefined for email ${user.user.email} for store ${subdomain}`);
            }
          } else if (settingsError2) {
            console.warn(`[Payment Method] ❌ Method 2: Error fetching settings by email for store ${subdomain}:`, settingsError2);
          } else if (!settings) {
            console.warn(`[Payment Method] ❌ Method 2: No settings found for email ${user.user.email} for store ${subdomain}`);
          }
        } else {
          console.warn(`[Payment Method] ❌ Method 2: Could not get user email for user_id ${storeTemplate.user_id} for store ${subdomain}:`, userError);
        }
      } catch (userErr) {
        console.warn(`[Payment Method] ❌ Method 2: Exception fetching user for store ${subdomain}:`, userErr);
      }
    }

    if (!paymentMethodImage) {
      console.warn(`[Payment Method] ❌ No payment method image found for store ${subdomain}`, {
        settings_id: storeTemplate.settings_id,
        user_id: storeTemplate.user_id
      });
    } else {
      console.log(`[Payment Method] ✅ Final payment method image for store ${subdomain}:`, paymentMethodImage);
    }

    // Add payment_method_image to the response
    const responseData = {
      ...storeTemplate,
      payment_method_image: paymentMethodImage
    };

    console.log(`[Payment Method] 📦 Response data includes payment_method_image:`, !!responseData.payment_method_image, 'for store', subdomain);

    return NextResponse.json({ success: true, data: responseData });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch store by subdomain' },
      { status: 500 }
    );
  }
}

