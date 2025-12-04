import pkg from 'pg';
import dotenv from 'dotenv';

// Safely load environment variables
try {
  dotenv.config();
  console.log('[DB Init] dotenv.config() completed');
} catch (err) {
  console.warn('[DB Init] dotenv.config() had an issue:', err && err.message ? err.message : err);
}

const { Pool } = pkg;

// If required DB env vars are not present, export a stub that throws clear errors
const required = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
const missing = required.filter(k => !process.env[k]);

console.log('[DB Init] Checking DB env vars. Missing:', missing.length > 0 ? missing : 'none');

let poolInstance;

// Prefer a cached global pool instance in serverless environments
const GLOBAL_POOL_KEY = '__PG_POOL_INSTANCE__';

try {
  if (globalThis && globalThis[GLOBAL_POOL_KEY]) {
    poolInstance = globalThis[GLOBAL_POOL_KEY];
    console.log('[DB Init] Reusing cached pool instance from globalThis');
  } else if (missing.length > 0) {
    console.warn('[DB Init] Missing DB env vars:', missing.join(', '));
    // Create a stub that will fail gracefully when used
    poolInstance = {
      query: async () => {
        throw new Error(`Database not configured. Missing env vars: ${missing.join(', ')}`);
      },
      connect: async () => { throw new Error(`Database not configured. Missing env vars: ${missing.join(', ')}`); },
      end: async () => {},
    };
    console.log('[DB Init] Stub pool created (no DB credentials)');
  } else {
    try {
      console.log('[DB Init] Creating real database pool');
      const poolConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
        // In Vercel / serverless, keep pool small to avoid exhausting DB connections.
        max: process.env.VERCEL ? (Number(process.env.DB_POOL_MAX) || 1) : (Number(process.env.DB_POOL_MAX) || 10),
      };

      poolInstance = new Pool(poolConfig);

      // Cache the pool on the global object so subsequent invocations reuse it.
      try {
        if (globalThis) {
          globalThis[GLOBAL_POOL_KEY] = poolInstance;
          console.log('[DB Init] Pool cached on globalThis');
        }
      } catch (err) {
        console.warn('[DB Init] Could not cache pool on globalThis:', err && err.message ? err.message : err);
      }

      poolInstance.on('error', (err) => {
        console.error('[DB] Unexpected error on idle client', err && err.message ? err.message : err);
      });
      
      console.log('[DB Init] Real pool created successfully');
    } catch (poolErr) {
      console.error('[DB Init] Failed to create real pool:', poolErr && poolErr.message ? poolErr.message : poolErr);
      // Create a stub that will fail when used
      poolInstance = {
        query: async () => {
          throw new Error(`Database pool creation failed: ${poolErr && poolErr.message ? poolErr.message : poolErr}`);
        },
        connect: async () => { throw new Error(`Database pool creation failed: ${poolErr && poolErr.message ? poolErr.message : poolErr}`); },
        end: async () => {},
      };
      console.log('[DB Init] Stub pool created after pool creation failure');
    }
  }
} catch (err) {
  console.error('[DB Init] Unexpected error during initialization:', err && err.message ? err.message : err);
  // Safe fallback
  poolInstance = {
    query: async () => {
      throw new Error(`[DB Init] Pool initialization error: ${err && err.message ? err.message : String(err)}`);
    },
    connect: async () => { throw new Error(`[DB Init] Pool initialization error: ${err && err.message ? err.message : String(err)}`); },
    end: async () => {},
  };
}

console.log('[DB Init] Module loaded. Pool instance type:', typeof poolInstance);

export default poolInstance;
