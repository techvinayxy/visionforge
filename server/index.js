require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const sellerRoutes = require("./routes/sellers");
const assistantRoutes = require("./routes/assistant");

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;
let databaseConnectionPromise;

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const isVercelPreview =
      /^https:\/\/visionforge(?:-[a-z0-9-]+)*\.vercel\.app$/i.test(origin);

    if (isVercelPreview) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
}));

app.use(express.json({ limit: "1mb" }));

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!databaseConnectionPromise) {
    databaseConnectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      bufferCommands: false,
    }).then(() => {
      console.log("MongoDB Atlas connected successfully.");
      return mongoose.connection;
    }).catch((error) => {
      databaseConnectionPromise = null;
      throw error;
    });
  }

  return databaseConnectionPromise;
}

// Vercel Functions are stateless and may cold-start. Reuse Mongoose's
// connection within a warm instance, and connect before database-backed routes.
app.use(async (_req, res, next) => {
  try {
    await connectToDatabase();
    return next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return res.status(503).json({
      message: "The database is temporarily unavailable. Please try again.",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/assistant", assistantRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "VISIONFORGE API is running" });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use((error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Unhandled API error:", error.message);
  return res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

async function startServer() {
  await connectToDatabase();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VISIONFORGE API listening on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  });
}

module.exports = app;
