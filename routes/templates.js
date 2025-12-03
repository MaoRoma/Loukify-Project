import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/templates
 * List all templates
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list templates' });
  }
});

/**
 * GET /api/templates/:id
 * Get single template
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Template not found' });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

/**
 * POST /api/templates
 * Create a new template
 * Body: { template_name, theme_part, header_part, section_part, footer_part }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      template_name,
      theme_part,
      header_part,
      section_part,
      footer_part
    } = req.body;

    if (!template_name) {
      return res.status(400).json({ error: 'template_name is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('templates')
      .insert({
        template_name,
        theme_part: theme_part || {},
        header_part: header_part || {},
        section_part: section_part || {},
        footer_part: footer_part || {}
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create template' });
  }
});

/**
 * PUT /api/templates/:id
 * Update template
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      template_name,
      theme_part,
      header_part,
      section_part,
      footer_part
    } = req.body;

    const updateData = {};
    if (template_name !== undefined) updateData.template_name = template_name;
    if (theme_part !== undefined) updateData.theme_part = theme_part;
    if (header_part !== undefined) updateData.header_part = header_part;
    if (section_part !== undefined) updateData.section_part = section_part;
    if (footer_part !== undefined) updateData.footer_part = footer_part;

    const { data, error } = await supabaseAdmin
      .from('templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Template not found or update failed' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update template' });
  }
});

/**
 * DELETE /api/templates/:id
 * Delete template
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

export default router;

