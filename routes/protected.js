import express from 'express';
import { authenticateToken, requireAdmin, requireSeller, requireCustomer } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * GET /admin-only
 * Admin-only endpoint for testing authorization
 */
router.get('/admin-only', authenticateToken, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      endpoint: 'admin-only',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_system'],
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * GET /seller-only
 * Seller-only endpoint for testing authorization
 */
router.get('/seller-only', authenticateToken, requireSeller, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Seller access granted',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      endpoint: 'seller-only',
      permissions: ['read', 'write', 'manage_products', 'view_orders'],
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * GET /customer-only
 * Customer-only endpoint for testing authorization
 */
router.get('/customer-only', authenticateToken, requireCustomer, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Customer access granted',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      endpoint: 'customer-only',
      permissions: ['read', 'place_orders', 'view_profile'],
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * GET /profile
 * Get current user profile (accessible to all authenticated users)
 */
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      permissions: getRolePermissions(req.user.role),
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * GET /test-auth
 * Test endpoint to verify authentication without role restrictions
 */
router.get('/test-auth', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      authenticated: true,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * Helper function to get permissions based on role
 */
function getRolePermissions(role) {
  const permissions = {
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_system', 'manage_products', 'view_orders'],
    seller: ['read', 'write', 'manage_products', 'view_orders'],
    customer: ['read', 'place_orders', 'view_profile']
  };
  
  return permissions[role] || [];
}

export default router;
