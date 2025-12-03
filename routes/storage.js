import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken, requireSeller } from '../auth/middlewares/authMiddleware.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * POST /upload-image
 * Upload a product image to Supabase Storage
 */
router.post('/upload-image', authenticateToken, requireSeller, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image provided',
        message: 'Please upload an image file'
      });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${file.originalname.split('.').pop()}`;
    const filePath = `product-images/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        error: 'Upload failed',
        message: 'Failed to upload image to storage'
      });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(filePath);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        fileName: fileName,
        filePath: filePath,
        publicUrl: urlData.publicUrl,
        size: file.size,
        contentType: file.mimetype
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Internal server error during upload'
    });
  }
});

/**
 * GET /images
 * Get list of all product images
 */
router.get('/images', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('List error:', error);
      return res.status(500).json({
        error: 'Failed to fetch images',
        message: 'Could not retrieve image list'
      });
    }

    // Generate public URLs for each image
    const imagesWithUrls = data.map(file => {
      const { data: urlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(`product-images/${file.name}`);

      return {
        name: file.name,
        size: file.metadata?.size,
        lastModified: file.updated_at,
        publicUrl: urlData.publicUrl
      };
    });

    res.status(200).json({
      success: true,
      message: 'Images retrieved successfully',
      data: {
        images: imagesWithUrls,
        count: imagesWithUrls.length
      }
    });

  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({
      error: 'Failed to fetch images',
      message: 'Internal server error while fetching images'
    });
  }
});

/**
 * DELETE /images/:fileName
 * Delete a specific product image
 */
router.delete('/images/:fileName', authenticateToken, requireSeller, async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = `product-images/${fileName}`;

    const { error } = await supabaseAdmin.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return res.status(500).json({
        error: 'Delete failed',
        message: 'Failed to delete image from storage'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        fileName: fileName,
        filePath: filePath
      }
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'Internal server error during deletion'
    });
  }
});

export default router;
