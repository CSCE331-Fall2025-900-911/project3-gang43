import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

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

app.options("*", cors());
console.log("CORS origins configured:", corsOrigins);

app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Remove /api prefix since Vercel already routes /api/* to this file
app.get("/", (req, res) => {
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

// Export handler for Vercel serverless
export default function handler(req, res) {
  return app(req, res);
}
