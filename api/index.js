
console.log('[API] index.js loaded');

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import pkg from 'pg';

// Load environment variables from .env file (for local development)
dotenv.config();
import createProductsRouter from "./routes/products.js";
import createOrdersRouter from "./routes/orders.js";

// Inline database pool creation
const { Pool } = pkg;

let pool = null;
const GLOBAL_POOL_KEY = '__PG_POOL_INSTANCE__';

// Initialize pool
try {
  if (globalThis && globalThis[GLOBAL_POOL_KEY]) {
    pool = globalThis[GLOBAL_POOL_KEY];
    console.log('[API Init] Using cached pool');
  } else {
    const required = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
    const missing = required.filter(k => !process.env[k]);
    
    if (missing.length > 0) {
      console.warn('[API Init] Missing DB env vars:', missing.join(', '));
      pool = {
        query: async () => { throw new Error(`Missing: ${missing.join(', ')}`); },
        connect: async () => { throw new Error(`Missing: ${missing.join(', ')}`); },
        end: async () => {},
      };
    } else {
      const poolConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
        max: process.env.VERCEL ? 1 : 10,
      };
      
      pool = new Pool(poolConfig);
      pool.on('error', (err) => console.error('[DB] Error:', err && err.message ? err.message : err));
      
      try {
        if (globalThis) globalThis[GLOBAL_POOL_KEY] = pool;
      } catch (e) {
        console.warn('[API Init] Could not cache pool');
      }
      
      console.log('[API Init] Pool created');
    }
  }
} catch (err) {
  console.error('[API Init] Pool failed:', err && err.message ? err.message : err);
  pool = {
    query: async () => { throw new Error('DB init failed'); },
    connect: async () => { throw new Error('DB init failed'); },
    end: async () => {},
  };
}

const app = express();

const corsOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://project3-gang43.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return cors()(req, res, next);
  }
  next();
});

app.use(express.json());

// Routes
app.get(["/", "/api"], (req, res) => res.json({ message: "API running" }));

app.get("/debug", (req, res) => res.json({
  isVercel: !!process.env.VERCEL,
  nodeEnv: process.env.NODE_ENV,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
}));

app.get('/health', async (req, res) => {
  try {
    if (!pool || typeof pool.query !== 'function') {
      return res.status(500).json({ success: false, message: 'DB pool not available' });
    }
    await pool.query('SELECT 1');
    return res.json({ success: true, message: 'OK', db: 'connected' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'DB connection failed', error: err && err.message ? err.message : err });
  }
});

// Weather API endpoint
app.get("/weather", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "OpenWeather API key not configured",
      });
    }

    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide either city name or coordinates (lat, lon)",
      });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      res.json({
        success: true,
        data: {
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          city: data.name,
          country: data.sys.country,
          windSpeed: Math.round(data.wind.speed),
        },
      });
    } else {
      res.status(response.status).json({
        success: false,
        message: data.message || "Failed to fetch weather data",
      });
    }
  } catch (error) {
    console.error("Weather API error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Mount routers with pool dependency injection
try {
  const productsRouter = createProductsRouter(pool);
  const ordersRouter = createOrdersRouter(pool);

  app.use('/products', productsRouter);
  app.use('/orders', ordersRouter);
  console.log('[Express] Routers mounted with pool');
} catch (e) {
  console.error('[Express] Failed to mount routers:', e && e.message ? e.message : e);
}

// Auth
let client;
try {
  if (process.env.GOOGLE_CLIENT_ID) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
} catch (error) {
  console.error("Failed to initialize OAuth:", error);
}

app.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential || !client) return res.status(400).json({ success: false, message: "Invalid request" });
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    res.json({
      success: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: "User",
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Auth failed" });
  }
});

// Catch-all
app.use((req, res) => res.status(404).json({ success: false, message: "Not found" }));

app.use((err, req, res, next) => {
  console.error("[Express Error]", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Export the Express app for local development (dev.js) while keeping the
// default export as the Vercel handler for deployment.
export { app };
// Local development
if (
  process.env.NODE_ENV !== 'production' &&
  !process.env.VERCEL &&
  import.meta.url === `file://${process.argv[1]}`
) {
  console.log('[API] About to start local dev server');
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Vercel handler
export default async function handler(req, res) {
  try {
    console.log(`[Handler] ${req.method} ${req.url}`);
    
    if (req.url && req.url.startsWith('/api')) {
      req.url = req.url.replace(/^\/api/, '') || '/';
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).end();
    }

    return await new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (error) {
    console.error("[Handler Error]", error && error.message ? error.message : error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


