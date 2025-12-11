import express from "express";
import PDFDocument from "pdfkit";

export default function createProductsRouter(pool) {
  const router = express.Router();

  // GET unique categories (must be before /:category route)
  router.get("/categories/list", async (req, res) => {
    console.log("[Server] GET /api/products/categories/list");
    try {
      const result = await pool.query(`
        SELECT DISTINCT category
        FROM products
        WHERE is_available = true
        ORDER BY category
      `);

      console.log("[Server] Categories found:", result.rows.length);
      res.json({
        success: true,
        data: result.rows.map((row) => row.category),
      });
    } catch (error) {
      console.error("[Server] Error fetching categories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      });
    }
  });

  // GET all products
  router.get("/", async (req, res) => {
    console.log("[Server] GET /api/products");
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

      console.log("[Server] Products found:", result.rows.length);
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("[Server] Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  });

  router.get("/employees", async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT employee_id, employee_name, role, active
      FROM employees
      ORDER BY employee_id ASC;
    `);

      res.json({ success: true, data: result.rows });
    } catch (err) {
      console.error("Error fetching employees:", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch employees" });
    }
  });

  router.post("/employees", async (req, res) => {
    try {
      const { employee_name, role } = req.body;

      if (!employee_name || !role) {
        return res.status(400).json({
          success: false,
          message: "Employee name and role are required",
        });
      }

      const result = await pool.query(
        `
      INSERT INTO employees (employee_name, role, active)
      VALUES ($1, $2, true)
      RETURNING employee_id, employee_name, role, active;
      `,
        [employee_name, role]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error("Error adding employee:", err);
      res.status(500).json({
        success: false,
        message: "Failed to add employee",
      });
    }
  });

  // UPDATE employee
  router.put("/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { employee_name, role, active } = req.body;

      const result = await pool.query(
        `
      UPDATE employees
      SET employee_name = $1,
          role = $2,
          active = $3
      WHERE employee_id = $4
      RETURNING employee_id, employee_name, role, active;
      `,
        [employee_name, role, active, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({
        success: false,
        message: "Failed to update employee",
      });
    }
  });

  // DELETE employee
  router.delete("/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(`DELETE FROM employees WHERE employee_id = $1`, [id]);

      res.json({ success: true, message: "Employee removed" });
    } catch (err) {
      console.error("Error deleting employee:", err);
      res.status(500).json({
        success: false,
        message: "Failed to delete employee",
      });
    }
  });
  // GET all inventory items
  router.get("/inventory", async (req, res) => {
    console.log("[Server] GET /api/products/inventory");
    try {
      const result = await pool.query(`
        SELECT inventory_id, item_name, quantity, unit, reorder_level
        FROM inventory
        ORDER BY item_name
      `);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("[Server] Error fetching inventory:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch inventory",
        error: error.message,
      });
    }
  });

  // GET ingredients for a specific product
  router.get("/:productId/ingredients", async (req, res) => {
    console.log("[Server] GET /api/products/:productId/ingredients");
    try {
      const { productId } = req.params;

      const result = await pool.query(`
        SELECT
          pi.product_ingredient_id,
          pi.inventory_id,
          i.item_name,
          pi.quantity_needed,
          i.unit
        FROM product_ingredients pi
        JOIN inventory i ON pi.inventory_id = i.inventory_id
        WHERE pi.product_id = $1
        ORDER BY i.item_name
      `, [productId]);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("[Server] Error fetching product ingredients:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product ingredients",
        error: error.message,
      });
    }
  });

  // POST create new product
  router.post("/", async (req, res) => {
    console.log("[Server] POST /api/products");
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { product_name, category, size, price, icon, color, description, ingredients } = req.body;

      if (!product_name || !category || !price) {
        return res.status(400).json({
          success: false,
          message: "Product name, category, and price are required",
        });
      }

      const result = await client.query(
        `
        INSERT INTO products (product_name, category, size, price, is_available, icon, color, description)
        VALUES ($1, $2, $3, $4, true, $5, $6, $7)
        RETURNING product_id, product_name, category, size, price, is_available, icon, color, description
        `,
        [product_name, category, size || 'Medium', price, icon || '🥤', color || '#3b82f6', description || '']
      );

      const productId = result.rows[0].product_id;

      // Add ingredients if provided
      if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
        for (const ingredient of ingredients) {
          if (ingredient.inventory_id && ingredient.quantity_needed > 0) {
            await client.query(
              `
              INSERT INTO product_ingredients (product_id, inventory_id, quantity_needed)
              VALUES ($1, $2, $3)
              ON CONFLICT (product_id, inventory_id) DO UPDATE
              SET quantity_needed = $3
              `,
              [productId, ingredient.inventory_id, ingredient.quantity_needed]
            );
          }
        }
      }

      await client.query('COMMIT');

      console.log("[Server] Product created with ID:", result.rows[0].product_id);
      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("[Server] Error creating product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create product",
        error: error.message,
      });
    } finally {
      client.release();
    }
  });

  // PUT update product
  router.put("/:productId", async (req, res) => {
    console.log("[Server] PUT /api/products/:productId");
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { productId } = req.params;
      const { product_name, category, size, price, icon, color, description, ingredients } = req.body;

      if (!product_name || !category || !price) {
        return res.status(400).json({
          success: false,
          message: "Product name, category, and price are required",
        });
      }

      const result = await client.query(
        `
        UPDATE products
        SET product_name = $1, category = $2, size = $3, price = $4, icon = $5, color = $6, description = $7, updated_at = CURRENT_TIMESTAMP
        WHERE product_id = $8
        RETURNING product_id, product_name, category, size, price, is_available, icon, color, description
        `,
        [product_name, category, size || 'Medium', price, icon || '🥤', color || '#3b82f6', description || '', productId]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Update ingredients if provided
      if (ingredients && Array.isArray(ingredients)) {
        // Delete existing ingredients
        await client.query('DELETE FROM product_ingredients WHERE product_id = $1', [productId]);

        // Add new ingredients
        for (const ingredient of ingredients) {
          if (ingredient.inventory_id && ingredient.quantity_needed > 0) {
            await client.query(
              `
              INSERT INTO product_ingredients (product_id, inventory_id, quantity_needed)
              VALUES ($1, $2, $3)
              `,
              [productId, ingredient.inventory_id, ingredient.quantity_needed]
            );
          }
        }
      }

      await client.query('COMMIT');

      console.log("[Server] Product updated with ID:", result.rows[0].product_id);
      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("[Server] Error updating product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: error.message,
      });
    } finally {
      client.release();
    }
  });

  // DELETE product
  router.delete("/:productId", async (req, res) => {
    console.log("[Server] DELETE /api/products/:productId");
    try {
      const { productId } = req.params;

      // Soft delete by setting is_available to false
      const result = await pool.query(
        `
        UPDATE products
        SET is_available = false
        WHERE product_id = $1
        RETURNING product_id, product_name
        `,
        [productId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      console.log("[Server] Product deleted:", result.rows[0].product_name);
      res.json({
        success: true,
        message: "Product deleted successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("[Server] Error deleting product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete product",
        error: error.message,
      });
    }
  });

  // GET products by category
  router.get("/:category", async (req, res) => {
    const { category } = req.params;
    console.log("[Server] GET /api/products/:category -", category);
    try {
      const result = await pool.query(
        `
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
      `,
        [category]
      );

      console.log("[Server] Products found for category:", result.rows.length);
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("[Server] Error fetching products by category:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  });

  router.get("/inventory/all", async (req, res) => {
  console.log("[Server] GET /api/products/inventory/all");
  try {
    const result = await pool.query(`
      SELECT * FROM inventory;`);
    const inventory = result.rows.map((item) => ({
      ...item,
      status: item.quantity <= 0 ? "Out of Stock" : item.quantity <= item.reorder_level ? "Low Stock" : "In Stock",
      severity: item.quantity <= 0 ? "critical" : item.quantity <= item.reorder_level ? "warning" : "normal",
    }));
    
    res.json({
      success: true,
      data: inventory,
      count: inventory.length
    });
  } catch (error) {
    console.error("[Server] Error fetching inventory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message
    });
  }
});

  // GET inventory alerts
  router.get("/inventory/alerts", async (req, res) => {
    console.log("[Server] GET /api/products/inventory/alerts");
    try {
      const result = await pool.query(`
        SELECT *
        FROM inventory
        WHERE quantity <= reorder_level
        ORDER BY 
          CASE 
            WHEN quantity <= 0 THEN 0  -- Out of stock items first
            ELSE 1
          END,
          (quantity::float / NULLIF(reorder_level, 0)) ASC  -- Then by how close to reorder level
      `);

      const alerts = result.rows.map((item) => ({
        ...item,
        status: item.quantity <= 0 ? "Out of Stock" : "Low Stock",
        severity: item.quantity <= 0 ? "critical" : "warning",
      }));

      console.log("[Server] Inventory alerts found:", alerts.length);
      res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      console.error("[Server] Error fetching inventory alerts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch inventory alerts",
        error: error.message,
      });
    }
  });

  router.post("/inventory/reorder", async (req, res) => {
    const { inventoryId, newQuantity } = req.body;

    try {
      const result = await pool.query(
        `UPDATE inventory 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE inventory_id = $2 
       RETURNING inventory_id, item_name, quantity, unit, reorder_level, updated_at`,
        [newQuantity, inventoryId]
      );

      if (result.rows.length > 0) {
        const updatedItem = result.rows[0];
        res.json({
          success: true,
          message: "Inventory updated successfully",
          data: updatedItem,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Inventory item not found",
        });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update inventory",
        error: error.message,
      });
    }
  });

  router.get("/dashboard/stats", async (req, res) => {
    try {
      const statsQuery = `
      WITH time_ranges AS (
        SELECT
          NOW() AS current_end,
          NOW() - INTERVAL '24 hours' AS current_start,
          NOW() - INTERVAL '48 hours' AS previous_start
      )
      SELECT
        CASE
          WHEN order_date >= (SELECT current_start FROM time_ranges)
           AND order_date <  (SELECT current_end FROM time_ranges)
          THEN 'current'
          ELSE 'previous'
        END AS period,
        COUNT(*) AS total_orders,
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COALESCE(SUM(
          (SELECT SUM(quantity)
           FROM order_items
           WHERE order_items.order_id = orders.order_id)
        ), 0) AS items_sold
      FROM orders
      WHERE order_date >= (SELECT previous_start FROM time_ranges)
        AND order_date <  (SELECT current_end FROM time_ranges)
      GROUP BY period;
    `;

      // RUN QUERY WITH NO PARAMETERS
      const statsResult = await pool.query(statsQuery);

      console.log("Raw stats result:", statsResult.rows);

      const currentData = statsResult.rows.find(
        (row) => row.period === "current"
      ) || { total_orders: 0, total_revenue: 0, items_sold: 0 };

      const previousData = statsResult.rows.find(
        (row) => row.period === "previous"
      ) || { total_orders: 0, total_revenue: 0, items_sold: 0 };

      const calculatePercentageChange = (current, previous) => {
        current = parseFloat(current);
        previous = parseFloat(previous);
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const stats = {
        todayRevenue: parseFloat(currentData.total_revenue),
        revenueChange: calculatePercentageChange(
          currentData.total_revenue,
          previousData.total_revenue
        ),
        totalOrders: parseInt(currentData.total_orders),
        ordersChange: calculatePercentageChange(
          currentData.total_orders,
          previousData.total_orders
        ),
        itemsSold: parseInt(currentData.items_sold),
        itemsSoldChange: calculatePercentageChange(
          currentData.items_sold,
          previousData.items_sold
        ),
      };

      console.log("Final calculated stats:", stats);
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard stats",
      });
    }
  });

  router.get("/orders/recent", async (req, res) => {
    try {
      const query = `
      SELECT
  o.order_id,
  o.total_amount,
  o.order_date,
  array_to_string(
    array_agg(
      p.product_name || ' x' || oi.quantity
      ORDER BY oi.order_item_id
    ),
    ', '
  ) AS items
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.status = 'completed'
GROUP BY o.order_id, o.total_amount, o.order_date
ORDER BY o.order_date DESC
LIMIT 3;
    `;

      const result = await pool.query(query);

      const recentOrders = result.rows.map((order) => ({
        id: `#${order.order_id}`,
        item: order.items,
        amount: `$${Number(order.total_amount).toFixed(2)}`,
        status: "Completed",
        statusColor: "#d1fae5",
        statusText: "#065f46",
      }));

      res.json({ success: true, data: recentOrders });
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch recent orders",
      });
    }
  });

  router.get("/revenue/last7days", async (req, res) => {
    try {
      const query = `
      WITH last7 AS (
        SELECT
          (NOW()::date - offs.day) AS date
        FROM generate_series(0, 6) AS offs(day)
      ),
      revenue_data AS (
        SELECT
          order_date::date AS date,
          SUM(total_amount) AS revenue
        FROM orders
        WHERE order_date >= NOW() - INTERVAL '7 days'
          AND status = 'completed'
        GROUP BY order_date::date
      )
      SELECT
        TO_CHAR(last7.date, 'Dy') AS day,
        COALESCE(revenue_data.revenue, 0)::numeric(10,2) AS revenue
      FROM last7
      LEFT JOIN revenue_data ON last7.date = revenue_data.date
      ORDER BY last7.date;
    `;

      const result = await pool.query(query);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching 7-day revenue:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch 7-day revenue",
      });
    }
  });

  router.get("/orders/top-items/last7days", async (req, res) => {
    try {
      const query = `
      SELECT
        p.product_name,
        SUM(oi.quantity) AS total_sold
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.status = 'completed'
        AND o.order_date >= NOW() - INTERVAL '7 days'
      GROUP BY p.product_name
      ORDER BY total_sold DESC
      LIMIT 5;
    `;

      const result = await pool.query(query);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      console.error("Error fetching top items:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch top-selling products",
      });
    }
  });

  // --- REPORT QUERIES ---

  // 1. Get Totals (Summary)
  const totalsQuery = `
    SELECT
        COUNT(order_id) AS total_orders,
        COALESCE(SUM(total_amount), 0) AS total_sales
    FROM orders
    WHERE status = 'completed';
`;

  // 2. Get Hourly Breakdown (The Graph)
  const hourlyQuery = `
    SELECT
        date_trunc('hour', order_date) AS hour_start,
        COUNT(order_id) AS order_count,
        COALESCE(SUM(total_amount), 0) AS total_sales
    FROM orders
    WHERE status = 'completed'
    GROUP BY date_trunc('hour', order_date)
    ORDER BY hour_start;
`;
  // --- ROUTES ---

  // X-REPORT: View current open sales (No changes to DB)
  router.get("/reports/x-report-pdf", async (req, res) => {
    try {
      const totalResult = await pool.query(totalsQuery);
      const hourlyResult = await pool.query(hourlyQuery);

      const summary = totalResult.rows[0];
      const hourlySales = hourlyResult.rows;

      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="x-report.pdf"',
        });
        res.send(pdfData);
      });

      // Title
      doc.fontSize(20).text("X-Report", { align: "center" });
      doc.moveDown(2);

      // Summary table
      doc.fontSize(14).text("Summary", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      doc.text(`Total Orders: ${summary.total_orders}`);
      doc.text(`Total Sales: $${Number(summary.total_sales).toFixed(2)}`);
      doc.moveDown(1);

      // Hourly Sales Table
      doc.fontSize(14).text("Hourly Sales", { underline: true });
      doc.moveDown(0.5);

      // Table headers
      doc.font("Helvetica-Bold").text("Hour", 50, doc.y, { width: 150 });
      doc.text("Order Count", 200, doc.y, { width: 100 });
      doc.text("Total Sales", 310, doc.y, { width: 100 });
      doc.moveDown(0.2);
      doc.font("Helvetica"); // Reset font for values

      // Rows
      hourlySales.forEach((row) => {
        const hour = new Date(row.hour_start).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });
        doc.text(hour, 50, doc.y, { width: 150 });
        doc.text(row.order_count, 200, doc.y, { width: 100 });
        doc.text(`$${Number(row.total_sales).toFixed(2)}`, 310, doc.y, {
          width: 100,
        });
        doc.moveDown(0.2);
      });

      doc.end();
    } catch (err) {
      console.error("Error generating X-Report PDF:", err);
      res.status(500).json({ error: "Failed to generate X-Report PDF" });
    }
  });

  // Z-REPORT: View sales AND close the shift (Transaction)
  router.post("/reports/z-report-pdf", async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get all "new" completed orders to report
      const summaryResult = await client.query(`
      SELECT COUNT(order_id) AS total_orders,
             COALESCE(SUM(total_amount), 0) AS total_sales
      FROM orders
      WHERE status = 'completed' AND reported = FALSE;
    `);
      const hourlyResult = await client.query(`
      SELECT date_trunc('hour', order_date) AS hour_start,
             COUNT(order_id) AS order_count,
             COALESCE(SUM(total_amount), 0) AS total_sales
      FROM orders
      WHERE status = 'completed' AND reported = FALSE
      GROUP BY date_trunc('hour', order_date)
      ORDER BY hour_start;
    `);

      // "Close the shift": mark those orders as reported
      await client.query(`
      UPDATE orders SET reported = TRUE 
      WHERE status = 'completed' AND reported = FALSE;
    `);
      await client.query("COMMIT");

      // Make PDF
      const summary = summaryResult.rows[0];
      const hourlySales = hourlyResult.rows;

      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="z-report.pdf"',
        });
        res.send(pdfData);
      });

      // Title
      doc.fontSize(20).text("Z-Report (Shift Closed)", { align: "center" });
      doc.moveDown(2);

      // If empty, show a friendly message
      if (!summary || summary.total_orders === "0") {
        doc
          .fontSize(14)
          .text("There are no completed sales to close for this shift.", {
            align: "center",
          });
        doc
          .fontSize(12)
          .text("All completed orders have been reported!", {
            align: "center",
          });
      } else {
        // Summary section
        doc.fontSize(14).text("Summary", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Orders Closed: ${summary.total_orders}`);
        doc.text(
          `Shift Sales Total: $${Number(summary.total_sales).toFixed(2)}`
        );
        doc.moveDown(1);

        // Hourly Sales Table
        doc.fontSize(14).text("Hourly Sales This Shift", { underline: true });
        doc.moveDown(0.5);

        // Table headers
        doc.font("Helvetica-Bold").text("Hour", 50, doc.y, { width: 150 });
        doc.text("Order Count", 200, doc.y, { width: 100 });
        doc.text("Total Sales", 310, doc.y, { width: 100 });
        doc.moveDown(0.2);
        doc.font("Helvetica"); // Reset font for values

        hourlySales.forEach((row) => {
          const hour = new Date(row.hour_start).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          });
          doc.text(hour, 50, doc.y, { width: 150 });
          doc.text(row.order_count, 200, doc.y, { width: 100 });
          doc.text(`$${Number(row.total_sales).toFixed(2)}`, 310, doc.y, {
            width: 100,
          });
          doc.moveDown(0.2);
        });
      }
      doc.end();
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error generating Z-Report PDF:", err);
      res.status(500).json({ error: "Failed to generate Z-Report PDF" });
    } finally {
      client.release();
    }
  });

  return router;
}
