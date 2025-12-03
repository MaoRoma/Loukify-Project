import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

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
 * GET /api/orders
 * List all orders with customer information
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
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
 * Get single order with customer information
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

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
      .single();

    if (error || !data) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

/**
 * POST /api/orders
 * Create a new order
 * Body: { customer_id, total_price, date (optional), order_items (array) }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
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

    // Verify customer exists
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('customer_id')
      .eq('customer_id', customer_id)
      .single();

    if (customerError || !customer) {
      return res.status(404).json({ error: 'Customer not found' });
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
        order_items: sanitizedItems
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
 * Update order
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_id,
      total_price,
      date,
      order_id,
      order_items
    } = req.body;

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
 * Delete order
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
