import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Helper function to sync store template changes back to settings
 * Updates settings table when store template info changes
 */
async function syncSettingsFromTemplate(userId, templateData, templateId = null) {
  try {
    const { store_name, store_url } = templateData;

    // Get current settings linked to this template or user
    let { data: settings } = await supabaseAdmin
      .from('settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (settings) {
      // Update existing settings
      const updateData = {};
      if (store_name !== undefined) updateData.store_name = store_name;
      if (store_url !== undefined) updateData.store_url = store_url;

      if (Object.keys(updateData).length > 0) {
        await supabaseAdmin
          .from('settings')
          .update(updateData)
          .eq('id', settings.id);
      }

      // Update the template to reference this settings record
      if (templateId && settings.id) {
        await supabaseAdmin
          .from('store_templates')
          .update({ settings_id: settings.id })
          .eq('id', templateId);
      }
    } else if (store_name) {
      // Create basic settings if they don't exist
      const { data: newSettings } = await supabaseAdmin
        .from('settings')
        .insert({
          first_name: 'Store',
          last_name: 'Owner',
          email_address: 'store@example.com',
          store_name: store_name,
          store_url: store_url || null
        })
        .select()
        .single();

      // Link the template to the new settings
      if (templateId && newSettings?.id) {
        await supabaseAdmin
          .from('store_templates')
          .update({ settings_id: newSettings.id })
          .eq('id', templateId);
      }
    }
  } catch (error) {
    console.error('Error syncing settings from template:', error);
    // Don't throw error to prevent breaking the main template update
  }
}

/**
 * GET /api/store-templates
 * Get current user's store template (their customized store)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('store_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true, data: data || null });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get store template' });
  }
});

/**
 * GET /api/store-templates/:id
 * Get specific store template by ID (for public access)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('store_templates')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Store not found or not published' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch store template' });
  }
});

/**
 * GET /api/store-templates/subdomain/:subdomain
 * Get store by subdomain (for public access)
 */
router.get('/subdomain/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;

    const { data, error } = await supabaseAdmin
      .from('store_templates')
      .select('*')
      .eq('store_subdomain', subdomain)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch store by subdomain' });
  }
});

/**
 * POST /api/store-templates
 * Create or update seller's store template
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      base_template_id,
      theme_part,
      header_part,
      section_part,
      footer_part,
      store_name,
      store_subdomain
    } = req.body;

    const { data: existing } = await supabaseAdmin
      .from('store_templates')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    let result;

    if (existing) {
      const updateData = {};
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

      if (error) return res.status(400).json({ error: error.message });
      result = data;

      // Update settings table if store info changed
      if (store_name !== undefined || store_subdomain !== undefined) {
        await syncSettingsFromTemplate(userId, {
          store_name,
          store_url: store_subdomain
        }, existing.id);
      }
    } else {
      const { data, error } = await supabaseAdmin
        .from('store_templates')
        .insert({
          user_id: userId,
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

      if (error) return res.status(400).json({ error: error.message });
      result = data;

      // Create or update settings table if store info provided
      if (store_name || store_subdomain) {
        await syncSettingsFromTemplate(userId, {
          store_name,
          store_url: store_subdomain
        }, data.id);
      }
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to save store template' });
  }
});

/**
 * PUT /api/store-templates/publish
 * Publish the store (make it public)
 */
router.put('/publish', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { store_subdomain } = req.body;

    const { data: storeTemplate, error: fetchError } = await supabaseAdmin
      .from('store_templates')
      .select('*')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (fetchError || !storeTemplate) {
      return res.status(404).json({ error: 'Store template not found. Please create your store first.' });
    }

    const updateData = {
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

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ 
      success: true, 
      data,
      message: 'Store published successfully!',
      store_url: store_subdomain ? `${store_subdomain}.loukify.website` : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to publish store' });
  }
});

/**
 * PUT /api/store-templates/unpublish
 */
router.put('/unpublish', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('store_templates')
      .update({ 
        is_published: false,
        published_at: null
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, data, message: 'Store unpublished' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to unpublish store' });
  }
});

/**
 * DELETE /api/store-templates
 */
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabaseAdmin
      .from('store_templates')
      .delete()
      .eq('user_id', userId);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, message: 'Store template deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete store template' });
  }
});

export default router;
