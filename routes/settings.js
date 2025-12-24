import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Helper: Upsert payment image into payment_images table
 * This ensures only one active payment image per store template
 */
async function upsertPaymentImage({ userId, storeTemplateId, settingsId, imageUrl }) {
  if (!imageUrl || !userId) {
    console.warn('[upsertPaymentImage] Missing required parameters:', { userId, imageUrl });
    return;
  }

  try {
    // Deactivate previous active images for this store_template to keep one active
    if (storeTemplateId) {
      const { error: deactivateError } = await supabaseAdmin
        .from('payment_images')
        .update({ is_active: false })
        .eq('store_template_id', storeTemplateId)
        .eq('is_active', true);
      
      if (deactivateError) {
        console.warn('[upsertPaymentImage] Error deactivating old images:', deactivateError);
        // Continue anyway - might be first image
      } else {
        console.log('[upsertPaymentImage] ✅ Deactivated previous active images for store_template_id:', storeTemplateId);
      }
    }

    // Insert new active payment image
    const { data, error: insertError } = await supabaseAdmin
      .from('payment_images')
      .insert({
        user_id: userId,
        store_template_id: storeTemplateId || null,
        settings_id: settingsId || null,
        image_url: imageUrl,
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('[upsertPaymentImage] ❌ Error inserting payment image:', insertError);
      throw insertError;
    }

    console.log('[upsertPaymentImage] ✅ Successfully saved payment image to payment_images table:', {
      id: data?.id,
      store_template_id: storeTemplateId,
      image_url: imageUrl
    });

    return data;
  } catch (error) {
    console.error('[upsertPaymentImage] ❌ Failed to upsert payment image:', error);
    throw error;
  }
}

/**
 * Helper function to sync store settings with store_templates
 * Updates or creates a store template when store settings change
 */
async function syncStoreTemplate(userId, storeData, settingsId = null) {
  try {
    const { store_name, store_description, store_subdomain } = storeData;

    // Check if user already has a store template
    const { data: existing } = await supabaseAdmin
      .from('store_templates')
      .select('id, store_subdomain')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (existing) {
      // Update existing template
      const updateData = {};

      if (store_name !== undefined) {
        updateData.store_name = store_name;
      }

      // CRITICAL: Only update store_subdomain if a new non-empty value is provided.
      // This prevents overwriting an existing working subdomain with null/empty
      // when the user is just updating payment method or other settings.
      // NEVER update store_subdomain if the provided value is null, undefined, or empty string
      if (
        store_subdomain !== undefined &&
        store_subdomain !== null &&
        String(store_subdomain).trim() !== ''
      ) {
        updateData.store_subdomain = String(store_subdomain).trim();
      }
      // If store_subdomain is null/undefined/empty, we DO NOT add it to updateData
      // This ensures the existing subdomain in the database is preserved

      // Always update settings_id when provided to ensure proper linking
      if (settingsId !== undefined && settingsId !== null) {
        updateData.settings_id = settingsId;
      }

      // Update header_part with store name and description
      if (store_name !== undefined || store_description !== undefined) {
        const { data: currentTemplate } = await supabaseAdmin
          .from('store_templates')
          .select('header_part')
          .eq('id', existing.id)
          .single();

        const currentHeaderPart = currentTemplate?.header_part || {};
        updateData.header_part = {
          ...currentHeaderPart,
          ...(store_name && { title: store_name }),
          ...(store_description && { description: store_description })
        };
      }

      if (Object.keys(updateData).length > 0) {
        await supabaseAdmin
          .from('store_templates')
          .update(updateData)
          .eq('id', existing.id);
      }
    } else {
      // Create new template
      await supabaseAdmin
        .from('store_templates')
        .insert({
          user_id: userId,
          settings_id: settingsId,
          store_name: store_name || null,
          store_subdomain:
            store_subdomain && String(store_subdomain).trim() !== ''
              ? String(store_subdomain).trim()
              : null,
          header_part: {
            title: store_name || '',
            description: store_description || '',
          },
          theme_part: {},
          section_part: [],
          footer_part: {}
        });
    }
  } catch (error) {
    console.error('Error syncing store template:', error);
    // Don't throw error to prevent breaking the main settings update
  }
}

/**
 * GET /api/settings
 * Get settings for the authenticated user (returns array for consistency with other endpoints)
 * CRITICAL: Must filter by user's email to ensure multi-tenancy
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in token' });
    }

    // CRITICAL: Filter by user's email to ensure each user only sees their own settings
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('email_address', userEmail) // Filter by authenticated user's email
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Return as array for consistency with other endpoints
    // Frontend expects: { success: true, data: [...] }
    res.status(200).json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get settings' });
  }
});

/**
 * GET /api/settings/:id
 * Get single settings by id
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Settings not found' });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * POST /api/settings
 * Create new settings and sync with store_templates
 * Body: { first_name, last_name, email_address, phone_number, store_name, store_description, store_url }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email_address,
      phone_number,
      store_name,
      store_description,
      store_url,
      payment_method_image
    } = req.body;

    if (!first_name || !last_name || !email_address || !store_name) {
      return res.status(400).json({ 
        error: 'first_name, last_name, email_address, and store_name are required' 
      });
    }

    const { data, error } = await supabaseAdmin
      .from('settings')
      .insert({
        first_name,
        last_name,
        email_address,
        phone_number,
        store_name,
        store_description,
        store_url,
        payment_method_image
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Settings with this email already exists' });
      }
      return res.status(400).json({ error: error.message });
    }

    // Sync with store_templates
    await syncStoreTemplate(req.user.id, {
      store_name: data.store_name,
      store_description: data.store_description,
      store_subdomain: data.store_url
    }, data.id);

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create settings' });
  }
});

/**
 * PUT /api/settings/:id
 * Update settings and sync with store_templates
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email_address,
      phone_number,
      store_name,
      store_description,
      store_url,
      payment_method_image
    } = req.body;

    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email_address !== undefined) updateData.email_address = email_address;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (store_name !== undefined) updateData.store_name = store_name;
    if (store_description !== undefined) updateData.store_description = store_description;
    if (store_url !== undefined) updateData.store_url = store_url;
    if (payment_method_image !== undefined) updateData.payment_method_image = payment_method_image;

    const { data, error } = await supabaseAdmin
      .from('settings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      if (error?.code === '23505') {
        return res.status(400).json({ error: 'Settings with this email already exists' });
      }
      return res.status(404).json({ error: 'Settings not found or update failed' });
    }

    // CRITICAL: Separate logic for store data updates vs payment_method_image updates
    // When ONLY payment_method_image is updated, we should NOT touch store_subdomain at all
    
    const isOnlyPaymentMethodUpdate = 
      payment_method_image !== undefined && 
      store_name === undefined && 
      store_description === undefined && 
      store_url === undefined;
    
    if (isOnlyPaymentMethodUpdate) {
      // ONLY updating payment_method_image - just link settings_id, don't touch store data
      console.log('[Settings] Only payment_method_image updated - preserving store_subdomain');
      const { data: storeTemplate } = await supabaseAdmin
        .from('store_templates')
        .select('id, store_subdomain')
        .eq('user_id', req.user.id)
        .limit(1)
        .maybeSingle();
      
      if (storeTemplate) {
        // ONLY update settings_id, do NOT touch store_subdomain or any other store fields
        await supabaseAdmin
          .from('store_templates')
          .update({ settings_id: data.id })
          .eq('id', storeTemplate.id);
        
        console.log('[Settings] ✅ settings_id linked, store_subdomain preserved:', storeTemplate.store_subdomain);

        // Also upsert into payment_images table (non-blocking - if it fails, settings table still has the image)
        try {
          await upsertPaymentImage({
            userId: req.user.id,
            storeTemplateId: storeTemplate.id,
            settingsId: data.id,
            imageUrl: payment_method_image
          });
        } catch (paymentImageError) {
          // Log error but don't fail the request - settings table has the image as fallback
          console.warn('[Settings] ⚠️ Failed to save to payment_images table (will use settings table as fallback):', paymentImageError.message);
        }
      }
    } else {
      // Store information was updated - sync with store_templates (with subdomain preservation)
      console.log('[Settings] Store information updated - syncing with store_templates');
      
      // ALWAYS fetch current subdomain first to preserve it
      const { data: currentTemplate } = await supabaseAdmin
        .from('store_templates')
        .select('store_subdomain')
        .eq('user_id', req.user.id)
        .limit(1)
        .maybeSingle();
      
      // Determine which subdomain to use:
      // 1. If store_url was explicitly provided and is not empty, use it
      // 2. Otherwise, preserve the existing subdomain from store_templates
      let storeSubdomainToUse = null;
      if (store_url !== undefined && store_url !== null && String(store_url).trim() !== '') {
        // New subdomain provided
        storeSubdomainToUse = String(store_url).trim();
        console.log('[Settings] Using new subdomain:', storeSubdomainToUse);
      } else {
        // Preserve existing subdomain (CRITICAL for payment method image updates)
        storeSubdomainToUse = currentTemplate?.store_subdomain || null;
        console.log('[Settings] Preserving existing subdomain:', storeSubdomainToUse);
      }

      await syncStoreTemplate(req.user.id, {
        store_name: data.store_name,
        store_description: data.store_description,
        store_subdomain: storeSubdomainToUse // Always use preserved or new value
      }, data.id);
      
      // Also ensure settings_id is linked if payment_method_image was updated
      if (payment_method_image !== undefined) {
        const { data: storeTemplate } = await supabaseAdmin
          .from('store_templates')
          .select('id')
          .eq('user_id', req.user.id)
          .limit(1)
          .maybeSingle();
        
        if (storeTemplate) {
          await supabaseAdmin
            .from('store_templates')
            .update({ settings_id: data.id })
            .eq('id', storeTemplate.id);

          // Upsert payment image into payment_images table (non-blocking)
          try {
            await upsertPaymentImage({
              userId: req.user.id,
              storeTemplateId: storeTemplate.id,
              settingsId: data.id,
              imageUrl: payment_method_image
            });
          } catch (paymentImageError) {
            // Log error but don't fail the request - settings table has the image as fallback
            console.warn('[Settings] ⚠️ Failed to save to payment_images table (will use settings table as fallback):', paymentImageError.message);
          }
        }
      }
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update settings' });
  }
});

/**
 * PUT /api/settings/store
 * Update store information and sync with store_templates
 * Body: { store_name, store_description, store_url }
 */
router.put('/store', authenticateToken, async (req, res) => {
  try {
    const { store_name, store_description, store_url, payment_method_image } = req.body;

    if (!store_name) {
      return res.status(400).json({ error: 'store_name is required' });
    }

    // Get current settings for this user (filter by user's email)
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in token' });
    }

    const { data: currentSettings, error: settingsError } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('email_address', userEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (settingsError) {
      return res.status(400).json({ error: settingsError.message });
    }

    if (!currentSettings) {
      return res.status(404).json({ error: 'Settings not found. Please create settings first.' });
    }

    // Update settings
    const updateData = {
      store_name,
      store_description,
      store_url
    };
    if (payment_method_image !== undefined) {
      updateData.payment_method_image = payment_method_image;
    }

    const { data, error } = await supabaseAdmin
      .from('settings')
      .update(updateData)
      .eq('id', currentSettings.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // CRITICAL: Separate logic for store data updates vs payment_method_image updates
    // When ONLY payment_method_image is updated, we should NOT touch store_subdomain at all
    
    const isOnlyPaymentMethodUpdate = 
      payment_method_image !== undefined && 
      store_name === undefined && 
      store_description === undefined && 
      store_url === undefined;
    
    if (isOnlyPaymentMethodUpdate) {
      // ONLY updating payment_method_image - just link settings_id, don't touch store data
      console.log('[Settings /store] Only payment_method_image updated - preserving store_subdomain');
      const { data: storeTemplate } = await supabaseAdmin
        .from('store_templates')
        .select('id, store_subdomain')
        .eq('user_id', req.user.id)
        .limit(1)
        .maybeSingle();
      
      if (storeTemplate) {
        // ONLY update settings_id, do NOT touch store_subdomain or any other store fields
        await supabaseAdmin
          .from('store_templates')
          .update({ settings_id: data.id })
          .eq('id', storeTemplate.id);
        
        console.log('[Settings /store] ✅ settings_id linked, store_subdomain preserved:', storeTemplate.store_subdomain);

        // Upsert payment image into payment_images table (non-blocking)
        try {
          await upsertPaymentImage({
            userId: req.user.id,
            storeTemplateId: storeTemplate.id,
            settingsId: data.id,
            imageUrl: payment_method_image
          });
        } catch (paymentImageError) {
          // Log error but don't fail the request - settings table has the image as fallback
          console.warn('[Settings /store] ⚠️ Failed to save to payment_images table (will use settings table as fallback):', paymentImageError.message);
        }
      }
    } else {
      // Store information was updated - sync with store_templates (with subdomain preservation)
      console.log('[Settings /store] Store information updated - syncing with store_templates');
      
      // ALWAYS fetch current subdomain first to preserve it
      const { data: currentTemplate } = await supabaseAdmin
        .from('store_templates')
        .select('store_subdomain')
        .eq('user_id', req.user.id)
        .limit(1)
        .maybeSingle();
      
      // Determine which subdomain to use:
      // 1. If store_url was explicitly provided and is not empty, use it
      // 2. Otherwise, preserve the existing subdomain from store_templates
      let storeSubdomainToUse = null;
      if (store_url !== undefined && store_url !== null && String(store_url).trim() !== '') {
        // New subdomain provided
        storeSubdomainToUse = String(store_url).trim();
        console.log('[Settings /store] Using new subdomain:', storeSubdomainToUse);
      } else {
        // Preserve existing subdomain (CRITICAL for payment method image updates)
        storeSubdomainToUse = currentTemplate?.store_subdomain || null;
        console.log('[Settings /store] Preserving existing subdomain:', storeSubdomainToUse);
      }

      await syncStoreTemplate(req.user.id, {
        store_name,
        store_description,
        store_subdomain: storeSubdomainToUse // Always use preserved or new value
      }, data.id);
      
      // Also ensure settings_id is linked if payment_method_image was updated
      if (payment_method_image !== undefined) {
        const { data: storeTemplate } = await supabaseAdmin
          .from('store_templates')
          .select('id')
          .eq('user_id', req.user.id)
          .limit(1)
          .maybeSingle();
        
        if (storeTemplate) {
          await supabaseAdmin
            .from('store_templates')
            .update({ settings_id: data.id })
            .eq('id', storeTemplate.id);

          // Upsert payment image into payment_images table
          await upsertPaymentImage({
            userId: req.user.id,
            storeTemplateId: storeTemplate.id,
            settingsId: data.id,
            imageUrl: payment_method_image
          });
        }
      }
    }

    res.status(200).json({ 
      success: true, 
      data,
      message: 'Store information updated successfully and synced with template'
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update store information' });
  }
});

/**
 * DELETE /api/settings/:id
 * Delete settings
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('settings')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, message: 'Settings deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete settings' });
  }
});

export default router;

