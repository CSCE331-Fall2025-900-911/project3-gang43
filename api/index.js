// Vercel serverless handler for the Boba POS API

import express from "express";
import cors from "cors";

export default async function handler(req, res) {
  try {
    console.log(`[Handler] ${req.method} ${req.url}`);
    res.json({ success: true, message: 'Handler with express and cors import works' });
  } catch (error) {
    console.error("[Handler] Error:", error && error.message ? error.message : error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

