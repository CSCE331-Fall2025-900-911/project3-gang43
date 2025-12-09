import express from "express";

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

  return router;
}
