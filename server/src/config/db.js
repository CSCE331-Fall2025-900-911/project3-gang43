import pkg from 'pg';
import dotenv from 'dotenv';

// Safely load environment variables - catch any errors
try {
  dotenv.config();
} catch (err) {
  console.warn('[DB] dotenv.config() warning:', err.message);
}

const { Pool } = pkg;

// If required DB env vars are not present, export a stub that throws clear errors
const required = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
const missing = required.filter(k => !process.env[k]);

let poolInstance;
// Prefer a cached global pool instance in serverless environments to avoid
// exhausting database connections across cold starts / multiple invocations.
const GLOBAL_POOL_KEY = '__PG_POOL_INSTANCE__';
try {
  if (globalThis[GLOBAL_POOL_KEY]) {
    poolInstance = globalThis[GLOBAL_POOL_KEY];
    console.log('[DB] Reusing cached pool instance');
  } else if (missing.length > 0) {
    console.warn('[DB] Missing environment variables:', missing.join(', '));

    poolInstance = {
      query: async () => {
        throw new Error(`Database not configured. Missing env vars: ${missing.join(', ')}`);
      },
      connect: async () => { throw new Error(`Database not configured. Missing env vars: ${missing.join(', ')}`); },
      end: async () => {},
    };
  } else {
    try {
      const poolConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        // In Vercel / serverless, keep pool small to avoid exhausting DB connections.
        max: process.env.VERCEL ? (Number(process.env.DB_POOL_MAX) || 1) : (Number(process.env.DB_POOL_MAX) || 10),
      };

      poolInstance = new Pool(poolConfig);

      // Cache the pool on the global object so subsequent invocations reuse it.
      try {
        globalThis[GLOBAL_POOL_KEY] = poolInstance;
      } catch (err) {
        // Non-fatal if we can't write to globalThis in some runtimes.
      }

      poolInstance.on('error', (err) => {
        console.error('[DB] Unexpected error on idle client', err);
      });
      
      console.log('[DB] Pool created successfully');
    } catch (poolErr) {
      console.error('[DB] Failed to create pool:', poolErr && poolErr.message ? poolErr.message : poolErr);
      // Create a stub that will fail gracefully when used
      poolInstance = {
        query: async () => {
          throw new Error(`Database pool creation failed: ${poolErr && poolErr.message ? poolErr.message : poolErr}`);
        },
        connect: async () => { throw new Error(`Database pool creation failed: ${poolErr && poolErr.message ? poolErr.message : poolErr}`); },
        end: async () => {},
      };
    }
  }
} catch (err) {
  console.error('[DB] Unexpected error during initialization:', err && err.message ? err.message : err);
  // Safe fallback
  poolInstance = {
    query: async () => {
      throw new Error('[DB] Pool initialization error: ' + (err && err.message ? err.message : String(err)));
    },
    connect: async () => { throw new Error('[DB] Pool initialization error: ' + (err && err.message ? err.message : String(err))); },
    end: async () => {},
  };
}

export default poolInstance;
