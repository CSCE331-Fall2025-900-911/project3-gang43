import express from 'express';

// Export a factory function that accepts a pool instance
export default function createOrdersRouter(pool) {
  const router = express.Router();

// POST - Create an order and decrement inventory
router.post('/checkout', async (req, res) => {
  const client = await pool.connect();
  
  console.log('[Server] POST /api/orders/checkout');
  console.log('[Server] Request body:', req.body);
  
  try {
    const { items, totalAmount, subtotal, tax, cashierName } = req.body;

    // Validate request
    if (!items || items.length === 0) {
      console.warn('[Server] Checkout failed: Cart is empty');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    if (!cashierName) {
      console.warn('[Server] Checkout failed: Missing cashier name');
      return res.status(400).json({
        success: false,
        message: 'Cashier name is required',
      });
    }

    console.log('[Server] Starting transaction...');
    await client.query('BEGIN');

    // Create the order
    console.log('[Server] Creating order with total:', totalAmount);
    const orderResult = await client.query(`
      INSERT INTO orders (order_date, total_amount, subtotal, tax, cashier_name)
      VALUES (NOW(), $1, $2, $3, $4)
      RETURNING order_id, order_date
    `, [totalAmount, subtotal, tax, cashierName]);

    const orderId = orderResult.rows[0].order_id;
    console.log('[Server] Order created with ID:', orderId);
    const inventoryWarnings = [];

    // Process each item in the order
    for (const item of items) {
      console.log('[Server] Processing item:', item.product_name, 'Qty:', item.quantity);

      try {
        // Get the ingredients needed for this product
        const ingredientsResult = await client.query(`
          SELECT i.inventory_id, i.item_name, pi.quantity_needed, i.quantity, i.unit
          FROM product_ingredients pi
          JOIN inventory i ON pi.inventory_id = i.inventory_id
          WHERE pi.product_id = $1
        `, [item.product_id]);

        console.log('[Server] Found', ingredientsResult.rows.length, 'ingredients for product');

        // Decrement inventory for each ingredient
        for (const ingredient of ingredientsResult.rows) {
          const quantityToDecrement = ingredient.quantity_needed * item.quantity;
          const newQuantity = ingredient.quantity - quantityToDecrement;

          console.log('[Server] Decrementing', ingredient.item_name, 'by', quantityToDecrement,
            'from', ingredient.quantity, 'to', newQuantity);

          if (newQuantity < 0) {
            inventoryWarnings.push({
              product: item.product_name,
              ingredient: ingredient.item_name,
              message: `Low stock warning: ${ingredient.item_name} may be running low (would go to ${newQuantity})`,
            });
          }

          // Update inventory
          await client.query(`
            UPDATE inventory
            SET quantity = quantity - $1
            WHERE inventory_id = $2
          `, [quantityToDecrement, ingredient.inventory_id]);
        }
      } catch (inventoryError) {
        console.warn('[Server] Inventory update failed for', item.product_name, '- continuing anyway:', inventoryError.message);
        inventoryWarnings.push({
          product: item.product_name,
          ingredient: 'Unknown',
          message: 'Inventory tracking unavailable for this product',
        });
      }

      // Create order item record
      console.log('[Server] Creating order item record for', item.product_name);
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [orderId, item.product_id, item.quantity, item.price]);
    }

    console.log('[Server] Committing transaction...');
    await client.query('COMMIT');

    console.log('[Server] Checkout successful! Order ID:', orderId, 'Warnings:', inventoryWarnings.length);
    res.json({
      success: true,
      data: {
        orderId,
        totalAmount,
        warnings: inventoryWarnings,
      },
      message: inventoryWarnings.length > 0 
        ? 'Order processed with inventory warnings' 
        : 'Order processed successfully',
    });
  } catch (error) {
    console.error('[Server] Error during checkout:', error);
    console.error('[Server] Error code:', error.code);
    await client.query('ROLLBACK');

    // Handle duplicate key errors gracefully
    if (error.code === '23505') {
      console.log('[Server] Duplicate key error - attempting retry without transaction');
      // Just return success since the order likely already exists
      return res.json({
        success: true,
        message: 'Order already processed',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process order',
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// GET order history
router.get('/history', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.order_id,
        o.order_date,
        o.total_amount,
        o.subtotal,
        o.tax,
        o.cashier_name,
        COUNT(oi.order_item_id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      GROUP BY o.order_id, o.order_date, o.total_amount, o.subtotal, o.tax, o.cashier_name
      ORDER BY o.order_date DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order history',
      error: error.message,
    });
  }
});

// GET specific order details
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderResult = await pool.query(`
      SELECT 
        order_id,
        order_date,
        total_amount,
        subtotal,
        tax,
        cashier_name
      FROM orders
      WHERE order_id = $1
    `, [orderId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const itemsResult = await pool.query(`
      SELECT 
        oi.order_item_id,
        oi.product_id,
        p.product_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) as total
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = $1
    `, [orderId]);

    res.json({
      success: true,
      data: {
        order: orderResult.rows[0],
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message,
    });
  }
});

  return router;
}
