import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();

// Configure CORS properly
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ];
app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Remove /api prefix since Vercel already routes /api/* to this file
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

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
    res.json({
      success: true,
      user,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
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
