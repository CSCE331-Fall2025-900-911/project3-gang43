import express from "express";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import productsRouter from "../server/src/routes/products.js";
import ordersRouter from "../server/src/routes/orders.js";
import pool from "../server/src/config/db.js";

// Initialize Express app
const app = express();

// Configure CORS properly - allow Vercel domain
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
      // Allow requests with no origin (like mobile apps or curl)
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

// Handle preflight requests - Express 5.x requires different wildcard syntax
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return cors()(req, res, next);
  }
  next();
});

app.use(express.json());

// Initialize OAuth client - will use GOOGLE_CLIENT_ID from Vercel env vars
let client;
try {
  if (process.env.GOOGLE_CLIENT_ID) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
} catch (error) {
  console.error("Failed to initialize OAuth client:", error);
}

// Remove /api prefix since Vercel already routes /api/* to this file
app.get(["/", "/api"], (req, res) => {
  console.log("[Express] Matched GET / or /api");
  res.json({ message: "Server is running" });
});

app.get("/debug", (req, res) => {
  res.json({
    message: "Debug info",
    env: {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
      hasCorsOrigin: !!process.env.CORS_ORIGIN,
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
    }
  });
});

// Health endpoint that checks DB connectivity (useful in Vercel logs)
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ success: true, message: 'OK', db: 'connected' });
  } catch (err) {
    console.error('[Health] DB check failed:', err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: 'DB connection failed', error: err.message || String(err) });
  }
});

app.post("/auth/google", async (req, res) => {
  console.log("Auth request received:", { 
    hasCredential: !!req.body?.credential,
    clientId: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT SET"
  });
  
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "No credential provided",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID not set!");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
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
    
    res.json({
      success: true,
      user,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
      error: error.message,
    });
  }
});

app.get("/user/profile", (req, res) => {
  res.json({ message: "Protected route accessed" });
});

// Mount products and orders routers so /api/products and /api/orders work on Vercel
try {
  app.use('/products', productsRouter);
  app.use('/orders', ordersRouter);
  console.log('[Express] Mounted products and orders routers');
} catch (e) {
  console.error('[Express] Failed to mount routers:', e);
}

// Log DB environment presence and pool status for startup debugging
try {
  const required = ['DB_USER','DB_PASSWORD','DB_HOST','DB_PORT','DB_NAME'];
  const missing = required.filter(k => !process.env[k]);
  console.log('[Startup] Vercel env present:', !!process.env.VERCEL);
  console.log('[Startup] Missing DB env vars:', missing);
  try {
    console.log('[Startup] pool.query exists:', typeof pool?.query === 'function');
    if (pool && typeof pool.query === 'function') {
      // do not await here to avoid startup latency, just log config if possible
      console.log('[Startup] pool ready (query function detected)');
    }
  } catch (e) {
    console.error('[Startup] Error inspecting pool:', e && e.message ? e.message : e);
  }
} catch (e) {
  console.error('[Startup] Error logging startup info:', e && e.message ? e.message : e);
}

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});


// For local development - start Express server ONLY if not running in Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS origins allowed:`, corsOrigins);
  });
}

// Catch-all route to always return a response
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Export handler for Vercel serverless - properly handle async
export default async function handler(req, res) {
  console.log(`[Vercel] API handler invoked: ${req.method} ${req.url}`);

  // Normalize URL when Vercel rewrites send the original path as /api/...
  // Some Vercel rewrites pass the original path so req.url may start with /api.
  // Strip leading /api so Express routes (which are defined without /api) match.
  try {
    if (req.url && req.url.startsWith('/api')) {
      const original = req.url;
      // remove only the first /api prefix
      req.url = req.url.replace(/^\/api/, '') || '/';
      console.log(`[Vercel] Normalized req.url from ${original} to ${req.url}`);
    }
  } catch (e) {
    console.error('Error normalizing req.url', e);
  }
  // Set CORS headers manually for OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', corsOrigins.join(','));
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  try {
    // Let Express handle the request
    return await new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}
