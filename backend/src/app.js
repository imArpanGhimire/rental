const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per window
  message: "Too many requests, please try again later"
})

app.use(cors({
  origin: true, // reflects the request origin; safe here since the API is proxied through the frontend's single origin
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(limiter)

const authroutes = require("./routes/auth.routes")
const propertyroutes = require("./routes/property.routes")
const reviewroutes = require("./routes/review.routes")
const favoritesroutes = require("./routes/favorites.routes")
const visitrequestroutes = require("./routes/visitRequest.routes")

app.use("/api/auth", authroutes)
app.use("/api/properties", propertyroutes)
app.use("/api/reviews", reviewroutes)
app.use("/api/favorites", favoritesroutes)
app.use("/api/visit-requests", visitrequestroutes)

module.exports = app