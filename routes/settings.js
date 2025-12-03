import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

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
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (existing) {
      // Update existing template
      const updateData = {};
      if (store_name !== undefined) updateData.store_name = store_name;
      if (store_subdomain !== undefined) updateData.store_subdomain = store_subdomain;
      if (settingsId !== undefined) updateData.settings_id = settingsId;

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

      await supabaseAdmin
        .from('store_templates')
        .update(updateData)
        .eq('id', existing.id);
    } else {
      // Create new template
      await supabaseAdmin
        .from('store_templates')
        .insert({
          user_id: userId,
          settings_id: settingsId,
          store_name: store_name || null,
          store_subdomain: store_subdomain || null,
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
 * Get settings (returns array for consistency with other endpoints)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')
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
      store_url
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
        store_url
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
      store_url
    } = req.body;

    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email_address !== undefined) updateData.email_address = email_address;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (store_name !== undefined) updateData.store_name = store_name;
    if (store_description !== undefined) updateData.store_description = store_description;
    if (store_url !== undefined) updateData.store_url = store_url;

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

    // Sync with store_templates if store information was updated
    if (store_name !== undefined || store_description !== undefined || store_url !== undefined) {
      await syncStoreTemplate(req.user.id, {
        store_name: data.store_name,
        store_description: data.store_description,
        store_subdomain: data.store_url
      }, data.id);
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
    const { store_name, store_description, store_url } = req.body;

    if (!store_name) {
      return res.status(400).json({ error: 'store_name is required' });
    }

    // Get current settings
    const { data: currentSettings } = await supabaseAdmin
      .from('settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!currentSettings) {
      return res.status(404).json({ error: 'Settings not found. Please create settings first.' });
    }

    // Update settings
    const { data, error } = await supabaseAdmin
      .from('settings')
      .update({
        store_name,
        store_description,
        store_url
      })
      .eq('id', currentSettings.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Sync with store_templates
    await syncStoreTemplate(req.user.id, {
      store_name,
      store_description,
      store_subdomain: store_url
    }, data.id);

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

