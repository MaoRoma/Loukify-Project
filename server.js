import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/routes/authRoutes.js';
import storageRoutes from './routes/storage.js';
import realtimeRoutes from './routes/realtime.js';
import protectedRoutes from './routes/protected.js';
import productRoutes from './routes/products.js';
import customerRoutes from './routes/customers.js';
import orderRoutes from './routes/orders.js';
import settingsRoutes from './routes/settings.js';
import templateRoutes from './routes/templates.js';
import storeTemplateRoutes from './routes/store_templates.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflict with Next.js (port 3000)

// Middleware - IMPORTANT: Don't use express.json() for routes that handle file uploads
// CORS configuration to allow frontend (Next.js) to make requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Next.js runs on port 3000
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/realtime', realtimeRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/store-templates', storeTemplateRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Loukify Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      storage: {
        upload: 'POST /api/storage/upload-image',
        list: 'GET /api/storage/images',
        delete: 'DELETE /api/storage/images/:fileName'
      },
      realtime: {
        test: 'GET /api/realtime/realtime-test',
        trigger: 'POST /api/realtime/trigger-test-update',
        status: 'GET /api/realtime/realtime-status'
      },
      protected: {
        admin: 'GET /api/protected/admin-only',
        seller: 'GET /api/protected/seller-only',
        customer: 'GET /api/protected/customer-only',
        profile: 'GET /api/protected/profile',
        test: 'GET /api/protected/test-auth'
      },
      products: {
        summary: 'GET /api/products/summary',
        create: 'POST /api/products',
        list: 'GET /api/products',
        get: 'GET /api/products/:id',
        update: 'PUT /api/products/:id',
        delete: 'DELETE /api/products/:id'
      },
      customers: {
        summary: 'GET /api/customers/summary',
        create: 'POST /api/customers',
        list: 'GET /api/customers',
        get: 'GET /api/customers/:id',
        update: 'PUT /api/customers/:id',
        delete: 'DELETE /api/customers/:id'
      },
      orders: {
        create: 'POST /api/orders',
        list: 'GET /api/orders',
        get: 'GET /api/orders/:id',
        update: 'PUT /api/orders/:id',
        delete: 'DELETE /api/orders/:id'
      },
      settings: {
        create: 'POST /api/settings',
        list: 'GET /api/settings',
        get: 'GET /api/settings/:id',
        update: 'PUT /api/settings/:id',
        delete: 'DELETE /api/settings/:id'
      },
      templates: {
        create: 'POST /api/templates',
        list: 'GET /api/templates',
        get: 'GET /api/templates/:id',
        update: 'PUT /api/templates/:id',
        delete: 'DELETE /api/templates/:id'
      }
    },
    documentation: 'See README.md for detailed testing instructions'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/storage/upload-image',
      'GET /api/storage/images',
      'DELETE /api/storage/images/:fileName',
      'GET /api/realtime/realtime-test',
      'POST /api/realtime/trigger-test-update',
      'GET /api/realtime/realtime-status',
      'GET /api/protected/admin-only',
      'GET /api/protected/seller-only',
      'GET /api/protected/customer-only',
      'GET /api/protected/profile',
      'GET /api/protected/test-auth',
      'GET /api/products/summary',
      'POST /api/products',
      'GET /api/products',
      'GET /api/products/:id',
      'PUT /api/products/:id',
      'DELETE /api/products/:id',
      'GET /api/customers/summary',
      'POST /api/customers',
      'GET /api/customers',
      'GET /api/customers/:id',
      'PUT /api/customers/:id',
      'DELETE /api/customers/:id',
      'POST /api/orders',
      'GET /api/orders',
      'GET /api/orders/:id',
      'PUT /api/orders/:id',
      'DELETE /api/orders/:id',
      'POST /api/settings',
      'GET /api/settings',
      'GET /api/settings/:id',
      'PUT /api/settings/:id',
      'DELETE /api/settings/:id',
      'POST /api/templates',
      'GET /api/templates',
      'GET /api/templates/:id',
      'PUT /api/templates/:id',
      'DELETE /api/templates/:id'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large',
      message: 'File size exceeds the 5MB limit'
    });
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: 'Only image files are allowed'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   Storage: http://localhost:${PORT}/api/storage`);
  console.log(`   Realtime: http://localhost:${PORT}/api/realtime`);
  console.log(`   Protected: http://localhost:${PORT}/api/protected`);
  console.log(`   Products: http://localhost:${PORT}/api/products`);
  console.log(`   Customers: http://localhost:${PORT}/api/customers`);
  console.log(`   Orders: http://localhost:${PORT}/api/orders`);
  console.log(`   Settings: http://localhost:${PORT}/api/settings`);
  console.log(`   Templates: http://localhost:${PORT}/api/templates`);
});

export default app;