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
console.log("CORS origins allowed:", corsOrigins);
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.get("/api", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/api/auth/google", async (req, res) => {
  console.log("Hello, world!");
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

app.get("/api/user/profile", (req, res) => {
  res.json({ message: "Protected route accessed" });
});

// Weather API endpoint
app.get("/api/weather", async (req, res) => {
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

// Export a handler for serverless platforms (Vercel). When running locally
// (not on Vercel), start a listener so `npm start` still works for development.
const PORT = process.env.PORT || 5050;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For @vercel/node we should export a default handler that forwards requests to the Express app.
// This allows Vercel to invoke the Express app per request. In ESM, export default a function.
export default function handler(req, res) {
  return app(req, res);
}
