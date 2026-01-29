const express = require("express");
const dns = require("dns");

// Fix for MongoDB SRV resolution issues in some environments
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin for static files/uploads
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static("uploads"));
app.use("/api/admin/auth/login", limiter); // Apply limiter only to login for better UX

const { protectAdmin } = require("./middleware/authMiddleware");

// Routes
app.use("/api/admin/auth", require("./routes/auth.admin.routes"));
app.use("/api/admin/upload", require("./routes/upload.admin.routes"));

// Protected Routes
app.use(
  "/api/admin/courses",
  protectAdmin,
  require("./routes/course.admin.routes"),
);
app.use(
  "/api/admin/users",
  protectAdmin,
  require("./routes/user.admin.routes"),
);
app.use(
  "/api/admin/stats",
  protectAdmin,
  require("./routes/stats.admin.routes"),
);
app.use(
  "/api/admin/revenue",
  protectAdmin,
  require("./routes/revenue.admin.routes"),
);
app.use(
  "/api/admin/settings",
  protectAdmin,
  require("./routes/settings.admin.routes"),
);
app.use(
  "/api/admin/doubts",
  protectAdmin,
  require("./routes/doubt.admin.routes"),
);

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to WorknAI Admin API" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Admin Backend Server running on port ${PORT}`);
});
