const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const reviewRoutes = require("./routes/review.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const visitRequestRoutes = require("./routes/visitRequest.routes");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/visit-requests", visitRequestRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rentora backend is running",
  });
});

module.exports = app;