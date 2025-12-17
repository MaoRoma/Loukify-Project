import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

async function getStoreForUser(userId) {
  const { data: storeTemplate, error: storeError } = await supabaseAdmin
    .from('store_templates')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return { storeTemplate, storeError };
}

/**
 * GET /api/customers/summary
 * Get customers summary statistics
 */
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('customer_id')
      .eq('store_id', storeTemplate.id);

    if (error) return res.status(400).json({ error: error.message });

    // Calculate summary statistics
    const totalCustomers = data.length;

    res.status(200).json({
      success: true,
      data: {
        totalCustomers
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get customers summary' });
  }
});

/**
 * GET /api/customers
 * List all customers for the authenticated user's store
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('store_id', storeTemplate.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    // Format response
    const formattedCustomers = data.map(customer => ({
      customer_id: customer.customer_id,
      customer_name: customer.customer_name,
      customer_email: customer.customer_email,
      customer_phone: customer.customer_phone,
      customer_location: customer.customer_location,
      created_at: customer.created_at,
      updated_at: customer.updated_at
    }));

    res.status(200).json({ success: true, data: formattedCustomers });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list customers' });
  }
});

/**
 * GET /api/customers/:id
 * Get single customer by customer_id (must belong to user's store)
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('customer_id', id)
      .eq('store_id', storeTemplate.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Customer not found' });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

/**
 * POST /api/customers
 * Create a new customer (automatically associated with user's store)
 * Body: { customer_name, customer_email, customer_phone, customer_location }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_location
    } = req.body;

    if (!customer_name || !customer_email) {
      return res.status(400).json({ error: 'customer_name and customer_email are required' });
    }

    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    const { data, error } = await supabaseAdmin
      .from('customers')
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        customer_location,
        store_id: storeTemplate.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Customer with this email already exists' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create customer' });
  }
});

/**
 * PUT /api/customers/:id
 * Update customer by customer_id (must belong to user's store)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_location
    } = req.body;

    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    const updateData = {};
    if (customer_name !== undefined) updateData.customer_name = customer_name;
    if (customer_email !== undefined) updateData.customer_email = customer_email;
    if (customer_phone !== undefined) updateData.customer_phone = customer_phone;
    if (customer_location !== undefined) updateData.customer_location = customer_location;

    const { data, error } = await supabaseAdmin
      .from('customers')
      .update(updateData)
      .eq('customer_id', id)
      .eq('store_id', storeTemplate.id)
      .select()
      .single();

    if (error || !data) {
      if (error?.code === '23505') {
        return res.status(400).json({ error: 'Customer with this email already exists' });
      }
      return res.status(404).json({ error: 'Customer not found or update failed' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update customer' });
  }
});

/**
 * DELETE /api/customers/:id
 * Delete customer by customer_id (must belong to user's store)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    const { error } = await supabaseAdmin
      .from('customers')
      .delete()
      .eq('customer_id', id)
      .eq('store_id', storeTemplate.id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
