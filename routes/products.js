import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/products/summary
 * Get products summary statistics
 */
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('product_status, product_price');

    if (error) return res.status(400).json({ error: error.message });

    // Calculate summary statistics
    const totalProducts = data.length;
    const activeProducts = data.filter(p => p.product_status === 'active').length;
    const inactiveProducts = data.filter(p => p.product_status === 'inactive').length;
    const outOfStockProducts = data.filter(p => p.product_status === 'out_of_stock').length;
    const totalValue = data.reduce((sum, p) => sum + (parseFloat(p.product_price) || 0), 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        outOfStockProducts,
        totalValue: parseFloat(totalValue.toFixed(2)),
        averagePrice: parseFloat(averagePrice.toFixed(2))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get products summary' });
  }
});

/**
 * GET /api/products/public
 * List all active products (public endpoint for store pages)
 */
router.get('/public', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('product_status', 'active')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    // Format response
    const formattedProducts = data.map(product => ({
      id: product.id,
      product_name: product.product_name,
      product_description: product.product_description,
      product_price: parseFloat(product.product_price) || 0,
      product_category: product.product_category,
      product_status: product.product_status,
      product_image: product.product_image,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));

    res.status(200).json({ success: true, data: formattedProducts });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list products' });
  }
});

/**
 * GET /api/products
 * List all products (requires authentication)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    // Format response
    const formattedProducts = data.map(product => ({
      id: product.id,
      product_name: product.product_name,
      product_description: product.product_description,
      product_price: parseFloat(product.product_price) || 0,
      product_category: product.product_category,
      product_status: product.product_status,
      product_image: product.product_image,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));

    res.status(200).json({ success: true, data: formattedProducts });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list products' });
  }
});

/**
 * GET /api/products/:id
 * Get single product
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * POST /api/products
 * Create a new product
 * Body: { product_name, product_description, product_price, product_category, product_status, product_image }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_price,
      product_category,
      product_status = 'active',
      product_image
    } = req.body;

    if (!product_name) {
      return res.status(400).json({ error: 'product_name is required' });
    }

    // Validate price
    const price = parseFloat(product_price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Valid product_price is required' });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'out_of_stock'];
    if (product_status && !validStatuses.includes(product_status)) {
      return res.status(400).json({ error: 'Invalid product_status. Must be: active, inactive, or out_of_stock' });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        product_name,
        product_description,
        product_price: price,
        product_category,
        product_status,
        product_image
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

/**
 * PUT /api/products/:id
 * Update product
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      product_description,
      product_price,
      product_category,
      product_status,
      product_image
    } = req.body;

    const updateData = {};
    if (product_name !== undefined) updateData.product_name = product_name;
    if (product_description !== undefined) updateData.product_description = product_description;
    if (product_price !== undefined) {
      const price = parseFloat(product_price);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Invalid product_price' });
      }
      updateData.product_price = price;
    }
    if (product_category !== undefined) updateData.product_category = product_category;
    if (product_status !== undefined) {
      const validStatuses = ['active', 'inactive', 'out_of_stock'];
      if (!validStatuses.includes(product_status)) {
        return res.status(400).json({ error: 'Invalid product_status. Must be: active, inactive, or out_of_stock' });
      }
      updateData.product_status = product_status;
    }
    if (product_image !== undefined) updateData.product_image = product_image;

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Product not found or update failed' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
