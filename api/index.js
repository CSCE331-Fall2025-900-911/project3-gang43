// Vercel serverless handler for the Boba POS API

import express from "express";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
// import pool from "../server/src/config/db.js";
import productsRouter from "../server/src/routes/products.js";
import ordersRouter from "../server/src/routes/orders.js";

export default async function handler(req, res) {
  try {
    console.log(`[Handler] ${req.method} ${req.url}`);
    res.json({ success: true, message: 'Handler with routers import works' });
  } catch (error) {
    console.error("[Handler] Error:", error && error.message ? error.message : error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

