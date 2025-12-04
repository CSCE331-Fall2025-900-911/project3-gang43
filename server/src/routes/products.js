import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET unique categories (must be before /:category route)
router.get('/categories/list', async (req, res) => {
  console.log('[Server] GET /api/products/categories/list');
  try {
    const result = await pool.query(`
      SELECT DISTINCT category
      FROM products
      WHERE is_available = true
      ORDER BY category
    `);
    
    console.log('[Server] Categories found:', result.rows.length);
    res.json({
      success: true,
      data: result.rows.map(row => row.category),
    });
  } catch (error) {
    console.error('[Server] Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
});

// GET all products
router.get('/', async (req, res) => {
  console.log('[Server] GET /api/products');
  try {
    const result = await pool.query(`
      SELECT 
        product_id,
        product_name,
        category,
        size,
        price,
        is_available,
        icon,
        color,
        description
      FROM products
      WHERE is_available = true
      ORDER BY category, product_name
    `);
    
    console.log('[Server] Products found:', result.rows.length);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('[Server] Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

// GET products by category
router.get('/:category', async (req, res) => {
  const { category } = req.params;
  console.log('[Server] GET /api/products/:category -', category);
  try {
    const result = await pool.query(`
      SELECT 
        product_id,
        product_name,
        category,
        size,
        price,
        is_available,
        icon,
        color,
        description
      FROM products
      WHERE category = $1 AND is_available = true
      ORDER BY product_name
    `, [category]);
    
    console.log('[Server] Products found for category:', result.rows.length);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('[Server] Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

export default router;
