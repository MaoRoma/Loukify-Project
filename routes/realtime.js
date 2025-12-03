import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * GET /realtime-test
 * Test Supabase Realtime functionality
 */
router.get('/realtime-test', authenticateToken, async (req, res) => {
  try {
    // Set up realtime subscription for orders table
    const subscription = supabaseAdmin
      .channel('orders-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders' 
        }, 
        (payload) => {
          console.log('Order change detected:', payload);
        }
      )
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        (payload) => {
          console.log('Inventory change detected:', payload);
        }
      )
      .subscribe();

    // Send immediate response
    res.status(200).json({
      success: true,
      message: 'Realtime subscription started',
      data: {
        subscribedTo: ['orders', 'inventory'],
        status: 'listening',
        note: 'Check server console for real-time updates'
      }
    });

    // Keep subscription alive for 30 seconds then unsubscribe
    setTimeout(() => {
      subscription.unsubscribe();
      console.log('Realtime subscription ended after 30 seconds');
    }, 30000);

  } catch (error) {
    console.error('Realtime error:', error);
    res.status(500).json({
      error: 'Realtime setup failed',
      message: 'Could not establish realtime connection'
    });
  }
});

/**
 * POST /trigger-test-update
 * Trigger a test update to demonstrate realtime functionality
 */
router.post('/trigger-test-update', authenticateToken, async (req, res) => {
  try {
    const { table, data } = req.body;

    if (!table || !data) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide table name and data'
      });
    }

    // Insert test data to trigger realtime updates
    const { data: result, error } = await supabaseAdmin
      .from(table)
      .insert(data)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({
        error: 'Insert failed',
        message: 'Could not insert test data'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Test data inserted successfully',
      data: {
        table: table,
        insertedData: result,
        note: 'This should trigger a realtime update if subscription is active'
      }
    });

  } catch (error) {
    console.error('Trigger error:', error);
    res.status(500).json({
      error: 'Trigger failed',
      message: 'Internal server error during test update'
    });
  }
});

/**
 * GET /realtime-status
 * Get current realtime connection status
 */
router.get('/realtime-status', authenticateToken, async (req, res) => {
  try {
    // Check if we can connect to Supabase
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('count')
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Supabase connection failed',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Realtime service is available',
      data: {
        status: 'connected',
        timestamp: new Date().toISOString(),
        note: 'Realtime subscriptions can be established'
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Status check failed',
      message: 'Could not verify realtime service status'
    });
  }
});

export default router;
