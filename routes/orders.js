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
 * Helper: Generate unique order ID
 */
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

const sanitizeOrderItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    product_id: item?.product_id || null,
    product_name: item?.product_name || null,
    product_sku: item?.product_sku || null,
    quantity: Number.isFinite(item?.quantity) ? item.quantity : 1,
    price: Number.isFinite(parseFloat(item?.price)) ? parseFloat(item.price) : 0,
    total: Number.isFinite(parseFloat(item?.total))
      ? parseFloat(item.total)
      : (Number.isFinite(item?.quantity) && Number.isFinite(parseFloat(item?.price)))
        ? Number(item.quantity) * parseFloat(item.price)
        : 0,
  }));
};

/**
 * GET /api/orders/summary
 * Get orders summary statistics
 */
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('total_price, date')
      .eq('store_id', storeTemplate.id);

    if (error) return res.status(400).json({ error: error.message });

    // Calculate summary statistics
    const totalOrders = data.length;
    const totalRevenue = data.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get orders summary' });
  }
});

/**
 * GET /api/orders
 * List all orders with customer information (for authenticated user's store)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        customer:customers(
          customer_id,
          customer_name,
          customer_email,
          customer_phone,
          customer_location
        )
      `)
      .eq('store_id', storeTemplate.id)
      .order('date', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    // Format response
    const formattedOrders = data.map(order => ({
      id: order.id,
      order_id: order.order_id,
      customer_id: order.customer_id,
      customer: order.customer || null,
      total_price: parseFloat(order.total_price) || 0,
      date: order.date,
      order_items: Array.isArray(order.order_items) ? order.order_items : [],
      created_at: order.created_at,
      updated_at: order.updated_at
    }));

    res.status(200).json({ success: true, data: formattedOrders });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list orders' });
  }
});

/**
 * GET /api/orders/:id
 * Get single order with customer information (must belong to user's store)
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
      .from('orders')
      .select(`
        *,
        customer:customers(
          customer_id,
          customer_name,
          customer_email,
          customer_phone,
          customer_location
        )
      `)
      .eq('id', id)
      .eq('store_id', storeTemplate.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

/**
 * POST /api/orders
 * Create a new order (customer must belong to user's store)
 * Body: { customer_id, total_price, date (optional), order_items (array) }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      customer_id,
      total_price,
      date,
      order_items
    } = req.body;

    if (!customer_id || total_price === undefined) {
      return res.status(400).json({ 
        error: 'customer_id and total_price are required' 
      });
    }

    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    // Verify customer exists and belongs to the same store
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('customer_id, store_id')
      .eq('customer_id', customer_id)
      .eq('store_id', storeTemplate.id)
      .single();

    if (customerError || !customer) {
      return res.status(404).json({ error: 'Customer not found or does not belong to your store' });
    }

    // Generate order ID
    const orderId = generateOrderId();

    const sanitizedItems = sanitizeOrderItems(order_items);

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        order_id: orderId,
        customer_id,
        total_price: parseFloat(total_price),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        order_items: sanitizedItems,
        store_id: storeTemplate.id
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

/**
 * PUT /api/orders/:id
 * Update order (must belong to user's store)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      customer_id,
      total_price,
      date,
      order_id,
      order_items
    } = req.body;

    const { storeTemplate, storeError } = await getStoreForUser(userId);
    if (storeError || !storeTemplate) {
      return res.status(400).json({ error: 'Store not found for this user. Please create a store first.' });
    }

    // If updating customer_id, verify the new customer belongs to the same store
    if (customer_id !== undefined) {
      const { data: customer, error: customerError } = await supabaseAdmin
        .from('customers')
        .select('customer_id, store_id')
        .eq('customer_id', customer_id)
        .eq('store_id', storeTemplate.id)
        .single();

      if (customerError || !customer) {
        return res.status(404).json({ error: 'Customer not found or does not belong to your store' });
      }
    }

    const updateData = {};
    if (customer_id !== undefined) updateData.customer_id = customer_id;
    if (total_price !== undefined) updateData.total_price = parseFloat(total_price);
    if (date !== undefined) updateData.date = new Date(date).toISOString();
    if (order_id !== undefined) updateData.order_id = order_id;
    if (order_items !== undefined) updateData.order_items = sanitizeOrderItems(order_items);

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .eq('store_id', storeTemplate.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found or update failed' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update order' });
  }
});

/**
 * DELETE /api/orders/:id
 * Delete order (must belong to user's store)
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
      .from('orders')
      .delete()
      .eq('id', id)
      .eq('store_id', storeTemplate.id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
