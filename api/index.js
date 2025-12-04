// Vercel serverless handler for the Boba POS API
// This file is the entry point for all /api/* requests in production

import express from "express";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";

// Import routers and database connection
import productsRouter from "../server/src/routes/products.js";
import ordersRouter from "../server/src/routes/orders.js";
import pool from "../server/src/config/db.js";

// Create Express app for handling routes
const app = express();

// Configure CORS
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://project3-gang43.vercel.app",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (corsOrigins.indexOf(origin) !== -1 || corsOrigins.includes("*")) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle OPTIONS preflight
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return cors()(req, res, next);
  }
  next();
});

app.use(express.json());

// Initialize OAuth client
let client;
try {
  if (process.env.GOOGLE_CLIENT_ID) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
} catch (error) {
  console.error("Failed to initialize OAuth client:", error);
}

// Basic routes
app.get(["/", "/api"], (req, res) => {
  console.log("[Express] Root request");
  res.json({ message: "Server is running" });
});

app.get("/debug", (req, res) => {
  res.json({
    message: "Debug info",
    env: {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
    }
  });
});

// Health endpoint
app.get('/health', async (req, res) => {
  try {
    if (!pool || typeof pool.query !== 'function') {
      return res.status(500).json({ success: false, message: 'DB pool not available' });
    }
    await pool.query('SELECT 1');
    return res.json({ success: true, message: 'OK', db: 'connected' });
  } catch (err) {
    console.error('[Health] DB check failed:', err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: 'DB connection failed', error: err.message || String(err) });
  }
});

// Mount routers
try {
  if (productsRouter) app.use('/products', productsRouter);
  if (ordersRouter) app.use('/orders', ordersRouter);
  console.log('[Express] Routers mounted');
} catch (e) {
  console.error('[Express] Failed to mount routers:', e.message);
}

// Auth route
app.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "No credential provided" });
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role: "cashier",
    };
    console.log("Auth successful for:", payload.email);
    res.json({ success: true, user, message: "Authentication successful" });
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ success: false, message: "Invalid credentials", error: error.message });
  }
});

app.get("/user/profile", (req, res) => {
  res.json({ message: "Protected route accessed" });
});

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export handler for Vercel
export default async function handler(req, res) {
  try {
    console.log(`[Handler] ${req.method} ${req.url}`);

    // Normalize URL path
    if (req.url && req.url.startsWith('/api')) {
      req.url = req.url.replace(/^\/api/, '') || '/';
    }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      return res.status(200).end();
    }

    // Route through Express app
    return await new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (error) {
    console.error("[Handler] Error:", error && error.message ? error.message : error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error && error.message ? error.message : String(error)
    });
  }
}

